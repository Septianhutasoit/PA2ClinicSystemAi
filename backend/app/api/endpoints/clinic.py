from app.models.patient import Patient
from fastapi import APIRouter, Depends, HTTPException, Body, File, UploadFile
from sqlalchemy import func, or_, Date, cast
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime, date, timedelta, timezone
from pydantic import BaseModel, EmailStr
from app.database.session import get_db
from app.schemas import clinic as schemas
from app.core import security
from app.core.security import (
    require_admin, get_current_user,
    require_doctor_or_admin, require_nurse_or_admin,
    require_staff_or_admin,
)
from app.core.config import settings
from app.models.appointment import Appointment
from app.models.clinic import Doctor, Service, MedicalRecord
from app.models.user import User
import os
import uuid
import pytz

router = APIRouter()

@router.get("/profile/me")
def get_my_profile(db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    user = _get_user_by_token(current_user, db)
    
    # Ambil profil tambahan dari tabel Doctor (jika ada)
    details = db.query(Doctor).filter(Doctor.email == user.email).first()
    
    # Hitung Pasien Selesai secara nyata (REAL)
    total_completed = db.query(Appointment).filter(
        Appointment.doctor_name == user.full_name,
        Appointment.status == "completed"
    ).count()

    return {
        "full_name": user.full_name,
        "email": user.email,
        "role": user.role,
        "created_at": user.id, # Nanti ganti user.created_at jika sudah ada kolomnya
        "details": {
            "phone": details.phone if details else "-",
            "specialty": details.specialty if details else "Staff Umum",
            "experience": details.experience if details else "0",
            "photo_url": details.photo_url if details else None,
            "schedules": details.schedules if details else []
        },
        "stats": {
            "total_handled": total_completed
        }
    }

# ─────────────────────────────────────────────────────────────────────────────
# KONVENSI STATUS (pegang teguh di seluruh file ini):
#   pending   → baru dibuat pasien, belum dikonfirmasi admin
#   confirmed → sudah dikonfirmasi admin, masuk antrian dokter
#   completed → selesai diperiksa
#   cancelled → dibatalkan
# ─────────────────────────────────────────────────────────────────────────────

VALID_STATUSES = {"pending", "confirmed", "scheduled", "completed", "cancelled"}


# ══════════════════════════════════════════════════════════════════════════════
# HELPER: ambil User dari email token (DRY)
# ══════════════════════════════════

def _get_user_by_token(current_user: dict, db: Session) -> User:
    user = db.query(User).filter(User.email == current_user["email"]).first()
    if not user:
        raise HTTPException(status_code=404, detail="Akun tidak ditemukan di database")
    return user


# ══════════════════════════════════════════════════════════════════════════════
# 1. MANAJEMEN DOKTER & STAFF (ADMIN ONLY)
# ══════════════════════════════════════════════════════════════════════════════

@router.get("/doctors", response_model=List[schemas.DoctorResponse])
def read_doctors(db: Session = Depends(get_db)):
    """Publik — tampil di halaman landing."""
    return db.query(Doctor).all()


@router.post("/doctors", response_model=schemas.DoctorResponse)
def add_doctor(
    data: schemas.DoctorBase,
    db: Session = Depends(get_db),
    admin: dict = Depends(require_admin),
):
    new_doc = Doctor(**data.model_dump())
    db.add(new_doc)
    db.commit()
    db.refresh(new_doc)
    return new_doc

@router.get("/doctor/notifications")
def get_doctor_notifications(
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_doctor_or_admin)
):
    user = _get_user_by_token(current_user, db)
    my_name = user.full_name.strip().lower() # Bersihkan nama
    
    return db.query(Appointment).filter(
        func.lower(Appointment.doctor_name) == my_name, # Gunakan func.lower
        Appointment.status.in_(["pending", "confirmed"])
    ).order_by(Appointment.id.desc()).limit(5).all()

@router.patch("/doctors/{doc_id}")
def update_doctor(
    doc_id: int,
    payload: dict = Body(...),
    db: Session = Depends(get_db),
    admin: dict = Depends(require_admin),
):
    doc = db.query(Doctor).filter(Doctor.id == doc_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Staff tidak ditemukan")
    for key, value in payload.items():
        if hasattr(doc, key):
            setattr(doc, key, value)
    db.commit()
    return {"message": "Data staff diperbarui"}


@router.delete("/doctors/{doctor_id}")
def delete_doctor(
    doctor_id: int,
    db: Session = Depends(get_db),
    admin: dict = Depends(require_admin),
):
    doc = db.query(Doctor).filter(Doctor.id == doctor_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Dokter tidak ditemukan")
    db.delete(doc)
    db.commit()
    return {"message": "Staff dihapus"}


# ── Register Staff (Buat akun login + profil dokter sekaligus) ────────────────

class StaffCreateRequest(BaseModel):
    """
    FIX BUG #1 & #3:
    - Semua field didefinisikan di sini (bukan di schemas, tidak duplikat).
    - Pakai 'name' sebagai field tunggal (konsisten dengan tabel doctors).
    """
    name: str                  # Nama lengkap — ini yang disimpan ke BOTH users.full_name & doctors.name
    email: EmailStr
    password: str
    specialty: str
    role: str = "doctor"       # "doctor" | "nurse" | "admin"
    phone: Optional[str] = None
    experience: Optional[str] = None
    photo_url: Optional[str] = None
    schedules: Optional[list] = []


@router.post("/register-staff")
def register_staff(
    data: StaffCreateRequest,
    db: Session = Depends(get_db),
    admin: dict = Depends(require_admin),
):
    """
    Admin membuat akun staff baru.
    Satu aksi ini melakukan DUA hal:
      1. Buat baris di tabel `users`  (untuk login)
      2. Buat baris di tabel `doctors` (untuk tampil di profil & matching nama pasien)

    KRITIS: `users.full_name` HARUS sama persis dengan `doctors.name`
    agar filter appointment.doctor_name == user.full_name bekerja.
    """
    # Validasi role
    if data.role not in {"doctor", "nurse", "admin"}:
        raise HTTPException(status_code=400, detail="Role tidak valid. Gunakan: doctor, nurse, admin")

    # Cek duplikasi email
    if db.query(User).filter(User.email == data.email.lower()).first():
        raise HTTPException(status_code=400, detail="Email sudah digunakan oleh akun lain")

    try:
        # 1. Simpan ke tabel USERS (akun login)
        new_user = User(
            email=data.email.lower(),
            full_name=data.name,          # ← full_name di users = name di doctors (SINKRON)
            hashed_password=security.get_password_hash(data.password),
            role=data.role,
        )
        db.add(new_user)

        # 2. Simpan ke tabel DOCTORS (profil publik + source nama untuk filter)
        #    Nurse/admin tidak perlu baris di tabel doctors
        if data.role == "doctor":
            existing_doctor = db.query(Doctor).filter(Doctor.name == data.name).first()
            if existing_doctor:
                # Kalau profil dokter sudah ada (ditambah manual sebelumnya), update email-nya saja
                existing_doctor.email = data.email.lower()
                if data.phone:
                    existing_doctor.phone = data.phone
                if data.experience:
                    existing_doctor.experience = data.experience
                if data.photo_url:
                    existing_doctor.photo_url = data.photo_url
            else:
                new_doctor = Doctor(
                    name=data.name,               # ← HARUS sama dengan users.full_name
                    specialty=data.specialty,
                    role="doctor",
                    email=data.email.lower(),
                    phone=data.phone,
                    experience=data.experience,
                    photo_url=data.photo_url,
                    schedules=data.schedules or [],
                )
                db.add(new_doctor)

        db.commit()
        return {
            "message": f"Akun {data.role} untuk '{data.name}' berhasil dibuat.",
            "email": data.email.lower(),
            "role": data.role,
        }

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Gagal menyimpan: {str(e)}")


# ══════════════════════════════════════════════════════════════════════════════
# 2. UPLOAD FOTO
# ══════════════════════════════════════════════════════════════════════════════

ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp", ".gif"}
MAX_FILE_SIZE_BYTES = 2 * 1024 * 1024  # 2 MB


@router.post("/upload-photo")
async def upload_photo(
    file: UploadFile = File(...),
    current_user: dict = Depends(get_current_user),
):
    file_ext = os.path.splitext(file.filename or "")[1].lower()
    if file_ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"Tipe file tidak diizinkan. Hanya: {', '.join(ALLOWED_EXTENSIONS)}",
        )

    contents = await file.read()
    if len(contents) > MAX_FILE_SIZE_BYTES:
        raise HTTPException(status_code=400, detail="Ukuran file melebihi batas 2MB.")

    try:
        os.makedirs("uploads", exist_ok=True)
        safe_filename = f"{uuid.uuid4().hex}{file_ext}"
        file_path = os.path.join("uploads", safe_filename)
        with open(file_path, "wb") as buffer:
            buffer.write(contents)
        return {"url": f"{settings.BACKEND_URL}/uploads/{safe_filename}"}
    except Exception:
        raise HTTPException(status_code=500, detail="Gagal menyimpan file.")


# ══════════════════════════════════════════════════════════════════════════════
# 3. MANAJEMEN LAYANAN KLINIK (ADMIN ONLY)
# ══════════════════════════════════════════════════════════════════════════════

@router.get("/services", response_model=List[schemas.ServiceResponse])
def read_services(db: Session = Depends(get_db)):
    return db.query(Service).all()


@router.post("/services", response_model=schemas.ServiceResponse)
def add_service(
    data: schemas.ServiceBase,
    db: Session = Depends(get_db),
    admin: dict = Depends(require_admin),
):
    new_service = Service(**data.model_dump())
    db.add(new_service)
    db.commit()
    db.refresh(new_service)
    return new_service


@router.patch("/services/{service_id}")
def update_service(
    service_id: int,
    payload: dict = Body(...),
    db: Session = Depends(get_db),
    admin: dict = Depends(require_admin),
):
    item = db.query(Service).filter(Service.id == service_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Layanan tidak ditemukan")
    for key, value in payload.items():
        if hasattr(item, key):
            setattr(item, key, value)
    db.commit()
    return {"message": "Layanan diperbarui"}


@router.delete("/services/{service_id}")
def delete_service(
    service_id: int,
    db: Session = Depends(get_db),
    admin: dict = Depends(require_admin),
):
    item = db.query(Service).filter(Service.id == service_id).first()
    if item:
        db.delete(item)
        db.commit()
    return {"message": "Layanan dihapus"}


# ══════════════════════════════════════════════════════════════════════════════
# 4. APPOINTMENT — PASIEN
# ══════════════════════════════════════════════════════════════════════════════

@router.get("/appointments/me", response_model=List[schemas.AppointmentResponse])
def get_my_appointments(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    """Pasien melihat riwayat appointment miliknya sendiri."""
    user = _get_user_by_token(current_user, db)
    return (
        db.query(Appointment)
        .filter(Appointment.user_id == user.id)
        .order_by(Appointment.appointment_date.desc())
        .all()
    )


@router.post("/appointments", response_model=schemas.AppointmentResponse)
def create_appointment(
    data: schemas.AppointmentCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    try:
        # ── Ambil user dari token ────────────────────────────────────────────
        user = _get_user_by_token(current_user, db)

        # ── patient_name SELALU dari akun login, bukan dari input form ───────
        new_appo = Appointment(
            patient_name    = user.full_name,        # ← otomatis dari akun
            patient_phone   = data.patient_phone,
            doctor_name     = data.doctor_name,
            appointment_date= data.appointment_date,
            patient_address = data.patient_address or '-',
            patient_gender  = data.patient_gender  or '-',
            notes           = data.notes,
            status          = "pending",
            user_id         = user.id,
        )
        db.add(new_appo)

        # ── Tambah ke tabel patients jika belum ada ──────────────────────────
        existing = db.query(Patient).filter(Patient.email == user.email).first()
        if not existing:
            db.add(Patient(
                full_name    = user.full_name,
                email        = user.email,
                phone_number = data.patient_phone,
                address      = data.patient_address or '-',
                gender       = data.patient_gender  or '-',
                created_at   = datetime.utcnow(),
            ))

        db.commit()
        db.refresh(new_appo)
        return new_appo

    except Exception as e:
        db.rollback()
        print(f"BOOKING ERROR: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Gagal menyimpan reservasi: {str(e)}")


# ══════════════════════════════════════════════════════════════════════════════
# 5. APPOINTMENT — DOKTER (filter hanya milik dokter yang login)
# ══════════════════════════════════

@router.get("/appointments/my-patients")
def get_my_patients(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    """
    Dokter melihat SEMUA pasien yang pernah memilihnya (semua waktu).
    Filter: doctor_name == full_name user yang login, status confirmed/completed.
    """
    if current_user["role"] not in {"doctor", "admin"}:
        raise HTTPException(status_code=403, detail="Akses ditolak. Endpoint ini hanya untuk dokter.")

    user = _get_user_by_token(current_user, db)

    return (
        db.query(Appointment)
        .filter(
            Appointment.doctor_name == user.full_name,
            Appointment.status.in_(["confirmed", "completed"]),
        )
        .order_by(Appointment.appointment_date.desc())
        .all()
    )


@router.get("/appointments/my-today")
def get_doctor_today(
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_doctor_or_admin),
):
    user = _get_user_by_token(current_user, db)
    my_name = user.full_name.strip().lower()

    # ── Range WIB → konversi ke UTC (sama dengan analytics) ─────────────────
    WIB       = pytz.timezone("Asia/Jakarta")
    today_wib = datetime.now(WIB).date()

    start_utc = WIB.localize(datetime.combine(today_wib, datetime.min.time())) \
                   .astimezone(pytz.utc).replace(tzinfo=None)
    end_utc   = WIB.localize(datetime.combine(today_wib, datetime.max.time())) \
                   .astimezone(pytz.utc).replace(tzinfo=None)

    return (
        db.query(Appointment)
        .filter(
            func.lower(func.trim(Appointment.doctor_name)) == my_name,
            Appointment.appointment_date >= start_utc,
            Appointment.appointment_date <= end_utc,
            Appointment.status.in_(["confirmed", "scheduled"]),
        )
        .order_by(Appointment.appointment_date.asc())
        .all()
    )


@router.get("/appointments/my-schedule")
def get_doctor_schedule(
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_doctor_or_admin),
):
    """Semua appointment milik dokter yang login (tanpa filter tanggal)."""
    user = _get_user_by_token(current_user, db)
    return (
        db.query(Appointment)
        .filter(Appointment.doctor_name == user.full_name)
        .order_by(Appointment.appointment_date.desc())
        .all()
    )


@router.get("/appointments/doctor-stats")
def get_doctor_stats(
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_doctor_or_admin)
):
    user    = _get_user_by_token(current_user, db)
    my_name = user.full_name.strip().lower()

    # ── UTC range ────────────────────────────────────────────────────────────
    WIB       = pytz.timezone("Asia/Jakarta")
    today_wib = datetime.now(WIB).date()

    start_utc = WIB.localize(datetime.combine(today_wib, datetime.min.time())) \
                   .astimezone(pytz.utc).replace(tzinfo=None)
    end_utc   = WIB.localize(datetime.combine(today_wib, datetime.max.time())) \
                   .astimezone(pytz.utc).replace(tzinfo=None)

    # ── Base queries ─────────────────────────────────────────────────────────
    base = db.query(Appointment).filter(
        func.lower(func.trim(Appointment.doctor_name)) == my_name
    )
    base_today = base.filter(
        Appointment.appointment_date >= start_utc,
        Appointment.appointment_date <= end_utc,
    )

    return {
        "doctor_name":        user.full_name,
        "total_all_patients": base.count(),
        "today_patients":     base_today.count(),
        "waiting_patients":   base_today.filter(Appointment.status == "confirmed").count(),
        "scheduled_patients": base_today.filter(Appointment.status == "scheduled").count(),
        "completed_today":    base_today.filter(Appointment.status == "completed").count(),
    }


# ══════════════════════════════════════════════════════════════════════════════
# 6. APPOINTMENT — PERAWAT / ADMIN
# ══════════════════════════════════════════════════════════════════════════════

@router.get("/appointments")
def get_all_appointments(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    if current_user["role"] == "patient":
        raise HTTPException(status_code=403)

    # Kita ambil data Appointment dan kita gabungkan (Join) dengan MedicalRecord
    results = db.query(Appointment).order_by(Appointment.id.desc()).all()
    
    output = []
    for app in results:
        # Cari apakah sudah ada rekam medis untuk janji temu ini
        record = db.query(MedicalRecord).filter(MedicalRecord.appointment_id == app.id).first()
        
        output.append({
            "id": app.id,
            "patient_name": app.patient_name,
            "doctor_name": app.doctor_name,
            "appointment_date": app.appointment_date,
            "status": app.status,
            "patient_phone": app.patient_phone,
            "notes": app.notes, # Catatan pendaftaran
            # TAMBAHKAN DUA FIELD INI (HASIL DOKTER)
            "doctor_diagnosis": record.diagnosis if record else None,
            "treatment": record.treatment if record else None
        })
        
    return output


@router.get("/appointments/queue")
def get_today_queue(
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_nurse_or_admin),
):
    """Antrian hari ini — untuk layar perawat."""
    today_start = datetime.combine(date.today(), datetime.min.time())
    today_end   = datetime.combine(date.today(), datetime.max.time())
    return (
        db.query(Appointment)
        .filter(
            Appointment.appointment_date >= today_start,
            Appointment.appointment_date <= today_end,
        )
        .order_by(Appointment.appointment_date.asc())
        .all()
    )


@router.get("/appointments/nurse-stats")
def get_nurse_stats(
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_nurse_or_admin),
):
    """Statistik operasional untuk dashboard perawat."""
    today_start = datetime.combine(date.today(), datetime.min.time())
    today_end   = datetime.combine(date.today(), datetime.max.time())

    today_base = db.query(Appointment).filter(
        Appointment.appointment_date >= today_start,
        Appointment.appointment_date <= today_end,
    )

    return {
        "total_today":    today_base.count(),
        "waiting":        today_base.filter(Appointment.status == "confirmed").count(),
        "completed":      today_base.filter(Appointment.status == "completed").count(),
        "cancelled":      today_base.filter(Appointment.status == "cancelled").count(),
        "total_all_time": db.query(Appointment).count(),
    }

@router.post("/log-feedback")
async def log_feedback(payload: dict, db: Session = Depends(get_db)):
    from app.models.clinic import ChatLog
    log = ChatLog(
        user_message=payload.get("user_message", ""),
        bot_response=payload.get("bot_response", ""),
        feedback=payload.get("feedback"),
        session_id=payload.get("session_id", "")
    )
    db.add(log)
    db.commit()
    return {"status": "ok"}

# CHAT HISTORY — Per User (Persisten)

@router.get("/chat-history")
def get_chat_history(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """Ambil semua riwayat chat milik user yang login."""
    from app.models.clinic import ChatLog
    user = _get_user_by_token(current_user, db)

    logs = (
        db.query(ChatLog)
        .filter(ChatLog.session_id == f"user_{user.id}")
        .order_by(ChatLog.created_at.asc())
        .all()
    )
    return [
        {
            "id":           log.id,
            "user_message": log.user_message,
            "bot_response": log.bot_response,
            "feedback":     log.feedback,
            "created_at":   log.created_at.isoformat() if log.created_at else None,
        }
        for log in logs
    ]


@router.post("/chat-history")
def save_chat_message(
    payload: dict,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """Simpan satu pasang pesan user + balasan bot ke database."""
    from app.models.clinic import ChatLog
    user = _get_user_by_token(current_user, db)

    log = ChatLog(
        user_message = payload.get("user_message", ""),
        bot_response = payload.get("bot_response", ""),
        session_id   = f"user_{user.id}",   # ← kunci per-akun
    )
    db.add(log)
    db.commit()
    db.refresh(log)
    return {
        "id":           log.id,
        "user_message": log.user_message,
        "bot_response": log.bot_response,
        "created_at":   log.created_at.isoformat() if log.created_at else None,
    }


@router.delete("/chat-history/{log_id}")
def delete_one_chat(
    log_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """Hapus satu entri chat milik user yang login."""
    from app.models.clinic import ChatLog
    user = _get_user_by_token(current_user, db)

    log = db.query(ChatLog).filter(
        ChatLog.id         == log_id,
        ChatLog.session_id == f"user_{user.id}",   # pastikan milik user ini
    ).first()

    if not log:
        raise HTTPException(status_code=404, detail="Riwayat tidak ditemukan")

    db.delete(log)
    db.commit()
    return {"message": "Riwayat dihapus"}


@router.delete("/chat-history")
def clear_all_chat(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """Hapus SEMUA riwayat chat milik user yang login."""
    from app.models.clinic import ChatLog
    user = _get_user_by_token(current_user, db)

    deleted = db.query(ChatLog).filter(
        ChatLog.session_id == f"user_{user.id}"
    ).delete()
    db.commit()
    return {"message": f"{deleted} riwayat berhasil dihapus"}

@router.get("/admin/stats")
async def get_ai_stats(db: Session = Depends(get_db)):
    from app.models.clinic import ChatLog
    likes    = db.query(ChatLog).filter(ChatLog.feedback == True).count()
    dislikes = db.query(ChatLog).filter(ChatLog.feedback == False).count()
    total    = likes + dislikes
    accuracy = round(likes / total * 100, 1) if total > 0 else 0
    return {"likes": likes, "dislikes": dislikes, "accuracy": accuracy,
            "total_interactions": db.query(ChatLog).count()}

@router.get("/admin/history")
async def get_ai_history(db: Session = Depends(get_db)):
    from app.models.clinic import ChatLog
    return db.query(ChatLog).order_by(ChatLog.created_at.desc()).limit(50).all()

# ══════════════════════════════════════════════════════════════════════════════
# 7. UPDATE STATUS APPOINTMENT (dengan validasi kepemilikan)
# ══════════════════════════════════════════════════════════════════════════════

class StatusUpdate(BaseModel):
    status: str
    notes: Optional[str] = None


@router.patch("/appointments/{appointment_id}/status")
def update_appointment_status(
    appointment_id: int,
    body: StatusUpdate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    role = current_user.get("role")
    new_status = body.status.lower()
    user = _get_user_by_token(current_user, db)

    appo = db.query(Appointment).filter(Appointment.id == appointment_id).first()
    if not appo:
        raise HTTPException(status_code=404, detail="Appointment tidak ditemukan")

    # LOGGING UNTUK DEBUG (Lihat di terminal uvicorn)
    print(f"DEBUG: User {user.full_name} ({role}) mencoba ubah ID {appointment_id}")
    print(f"DEBUG: Alur {appo.status} -> {new_status}")

    # ── 1. LOGIKA ADMIN (Bebas) ──────────────────────────────────
    if role == "admin":
        appo.status = new_status
        if body.notes: appo.notes = body.notes

    # ── 2. LOGIKA PERAWAT (Nurse) ────────────────────────────────
    elif role == "nurse":
        # Perawat boleh konfirmasi (pending -> confirmed) 
        # ATAU panggil (confirmed -> scheduled)
        # ATAU panggil langsung (pending -> scheduled) -> Kita buat fleksibel
        if appo.status in ["pending", "confirmed"] and new_status in ["confirmed", "scheduled"]:
            appo.status = new_status
        else:
            print(f"REJECTED: Perawat dilarang ubah {appo.status} ke {new_status}")
            raise HTTPException(status_code=403, detail=f"Perawat dilarang ubah {appo.status} ke {new_status}")

    # ── 3. LOGIKA DOKTER ──────────────────────────────────────────
    elif role == "doctor":
        # Normalisasi nama untuk pengecekan kepemilikan
        db_doc_name = appo.doctor_name.replace(".", "").strip().lower()
        my_name = user.full_name.replace(".", "").strip().lower()

        if db_doc_name != my_name:
            print(f"REJECTED: Pasien ini milik {appo.doctor_name}, bukan {user.full_name}")
            raise HTTPException(status_code=403, detail="Anda bukan dokter pasien ini.")

        if appo.status == "confirmed" and new_status == "scheduled":
            appo.status = "scheduled"
        elif appo.status == "scheduled" and new_status == "completed":
            appo.status = "completed"
        else:
            raise HTTPException(status_code=403, detail="Alur status dokter tidak valid.")

    else:
        raise HTTPException(status_code=403, detail="Role tidak dikenal.")

    try:
        db.commit()
        db.refresh(appo)
        return {"message": "Berhasil diperbarui", "status": appo.status}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

    """
    Update status appointment.

    Aturan akses (RBAC):
      - Admin  → boleh ubah appointment siapapun
      - Nurse  → boleh ubah appointment siapapun (operasional)
      - Dokter → HANYA boleh ubah appointment yang doctor_name == full_name-nya
      - Pasien → DITOLAK
    """
    role = current_user.get("role")

    if role not in {"doctor", "nurse", "admin"}:
        raise HTTPException(status_code=403, detail="Akses ditolak.")

    if body.status not in VALID_STATUSES:
        raise HTTPException(
            status_code=400,
            detail=f"Status tidak valid. Gunakan salah satu: {', '.join(VALID_STATUSES)}",
        )

    appo = db.query(Appointment).filter(Appointment.id == appointment_id).first()
    if not appo:
        raise HTTPException(status_code=404, detail="Appointment tidak ditemukan")

    # FIX BUG #6: Ownership check untuk dokter
    if role == "doctor":
        user = _get_user_by_token(current_user, db)
        if appo.doctor_name != user.full_name:
            raise HTTPException(
                status_code=403,
                detail="Anda tidak berhak mengubah status pasien dokter lain.",
            )

    appo.status = body.status
    if body.notes is not None:
        appo.notes = body.notes

    try:
        db.commit()
        db.refresh(appo)
        return appo
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))


# Alias lama — tetap kompatibel dengan frontend yang belum diupdate
@router.patch("/appointments/{app_id}")
def update_appointment_legacy(
    app_id: int,
    payload: dict = Body(...),
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_staff_or_admin),
):
    """
    Endpoint lama (dipakai admin dashboard).
    Untuk update status gunakan /appointments/{id}/status (lebih aman).
    """
    appo = db.query(Appointment).filter(Appointment.id == app_id).first()
    if not appo:
        raise HTTPException(status_code=404, detail="Janji temu tidak ditemukan")
    for key, value in payload.items():
        if hasattr(appo, key):
            setattr(appo, key, value)
    db.commit()
    return {"message": "Update berhasil"}


# ══════════════════════════════════════════════════════════════════════════════
# 8. STATISTIK DASHBOARD ADMIN
# ══════════════════════════════════════════════════════════════════════════════

@router.get("/stats/summary")
def get_admin_stats(
    db: Session = Depends(get_db),
    admin: dict = Depends(require_admin),
):
    try:
        today = date.today()
        today_start = datetime.combine(today, datetime.min.time())

        return {
            "total_doctors":          db.query(Doctor).count(),
            "total_appointments":     db.query(Appointment).count(),
            "total_patients":         db.query(User).filter(User.role == "patient").count(),
            "today_bookings":         db.query(Appointment).filter(
                Appointment.appointment_date >= today_start
            ).count(),
            "reminder_success_rate":  "98%",
        }
    except Exception:
        raise HTTPException(status_code=500, detail="Gagal mengambil data statistik.")


@router.get("/stats/recent-bookings")
def get_recent_bookings(
    db: Session = Depends(get_db),
    admin: dict = Depends(require_admin),
):
    return db.query(Appointment).order_by(Appointment.appointment_date.desc()).limit(5).all()


@router.get("/stats/analytics")
def get_stats_analytics(
    period: str = "weekly",
    db: Session = Depends(get_db),
    admin: dict = Depends(require_admin),
):
    data_points = []
    # Set zona waktu ke Jakarta
    WIB = pytz.timezone("Asia/Jakarta")
    now_wib = datetime.now(WIB)
    today_wib = now_wib.date()

    try:
        if period == "weekly":
            # Looping 7 hari terakhir
            for i in range(6, -1, -1):
                target_date = today_wib - timedelta(days=i)
                
                # Buat rentang waktu dari jam 00:00:00 sampai 23:59:59 (WIB)
                start_wib = WIB.localize(datetime.combine(target_date, datetime.min.time()))
                end_wib = WIB.localize(datetime.combine(target_date, datetime.max.time()))
                
                # Konversi rentang tersebut ke UTC agar cocok dengan database Neon
                start_utc = start_wib.astimezone(pytz.utc).replace(tzinfo=None)
                end_utc = end_wib.astimezone(pytz.utc).replace(tzinfo=None)

                # Hitung data dalam rentang tersebut
                count = db.query(Appointment).filter(
                    Appointment.appointment_date >= start_utc,
                    Appointment.appointment_date <= end_utc
                ).count()
                
                days_name = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"]
                data_points.append({
                    "name": days_name[target_date.weekday()],
                    "online": count
                })
                
        else: # monthly (Tampilan per minggu dalam sebulan terakhir)
            for i in range(3, -1, -1):
                target_end_date = today_wib - timedelta(days=i * 7)
                target_start_date = target_end_date - timedelta(days=6)
                
                start_utc = WIB.localize(datetime.combine(target_start_date, datetime.min.time())).astimezone(pytz.utc).replace(tzinfo=None)
                end_utc = WIB.localize(datetime.combine(target_end_date, datetime.max.time())).astimezone(pytz.utc).replace(tzinfo=None)

                count = db.query(Appointment).filter(
                    Appointment.appointment_date >= start_utc,
                    Appointment.appointment_date <= end_utc
                ).count()
                
                data_points.append({
                    "name": f"W-{4-i}",
                    "online": count
                })

        return data_points

    except Exception as e:
        print(f"GRAFIK ERROR: {str(e)}")
        return []



# ══════════════════════════════════════════════════════════════════════════════
# 9. MANAJEMEN PASIEN (ADMIN & STAFF)
# ══════════════════════════════════════════════════════════════════════════════

@router.get("/patients")
def get_patients(db: Session = Depends(get_db), current_user: dict = Depends(require_staff_or_admin)):
    from app.models.patient import Patient
    patients = db.query(Patient).all()
    
    output = []
    for p in patients:
        # Hitung jumlah janji berdasarkan nama lengkap
        count = db.query(Appointment).filter(
            func.lower(Appointment.patient_name) == p.full_name.lower()
        ).count()

        output.append({
            "id": p.id,
            "full_name": p.full_name, # Frontend akan membaca ini dengan lancar
            "email": p.email,
            "phone_number": p.phone_number,
            "created_at": p.created_at,
            "total_appointments": count
        })
    return output

@router.patch("/patients/{p_id}")
def update_patient(
    p_id: int,
    payload: dict = Body(...),
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_staff_or_admin),
):
    from app.models.patient import Patient
    p = db.query(Patient).filter(Patient.id == p_id).first()
    if not p:
        raise HTTPException(status_code=404, detail="Pasien tidak ditemukan")
    for k, v in payload.items():
        if hasattr(p, k):
            setattr(p, k, v)
    db.commit()
    return {"message": "Data pasien diperbarui"}


# ══════════════════════════════════════════════════════════════════════════════
# 10. REKAM MEDIS
# ══════════════════════════════════════════════════════════════════════════════

@router.get("/medical-records", response_model=List[schemas.MedicalRecordResponse])
def read_medical_records(
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_staff_or_admin)
):
    # Kita lakukan JOIN agar mendapatkan nama pasien dan dokter dari tabel Appointment
    results = db.query(
        MedicalRecord.id,
        MedicalRecord.appointment_id,
        MedicalRecord.diagnosis,
        MedicalRecord.treatment,
        MedicalRecord.notes,
        MedicalRecord.created_at,
        Appointment.patient_name,
        Appointment.doctor_name
    ).join(Appointment, MedicalRecord.appointment_id == Appointment.id).all()
    
    return results


@router.post("/medical-records")
def create_medical_record(
    data: schemas.MedicalRecordCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_doctor_or_admin)
):
    try:
        # 1. Simpan data ke tabel medical_records
        new_record = MedicalRecord(**data.model_dump())
        db.add(new_record)

        appt = db.query(Appointment).filter(Appointment.id == data.appointment_id).first()
        if appt:
            appt.status = "completed"

        db.commit()
        return {"message": "Rekam medis tersimpan & Antrean diperbarui"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    
@router.get("/appointments/my-medical-history", response_model=List[schemas.MedicalRecordResponse])
def get_patient_medical_history(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user) 
):
    # Ambil rekam medis yang terhubung dengan appointment milik user ini
    user = _get_user_by_token(current_user, db)
    
    results = db.query(MedicalRecord).join(
        Appointment, MedicalRecord.appointment_id == Appointment.id
    ).filter(Appointment.user_id == user.id).all()
    
    return results

@router.get("/admin/notifications/reservations")
def get_recent_reservations(
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_admin)
):
    # Ambil 10 janji temu terbaru yang dibuat oleh pasien
    appointments = db.query(Appointment).order_by(Appointment.id.desc()).limit(10).all()
    
    notif_list = []
    for app in appointments:
        # Tentukan status warna/judul berdasarkan status reservasi
        title = "Reservasi Baru" if app.status == "pending" else "Status Diperbarui"
        
        notif_list.append({
            "id": app.id,
            "patient_name": app.patient_name,
            "consultation_time": app.appointment_date.strftime("%H:%M"), # Jam: 14:00
            "consultation_date": app.appointment_date.strftime("%d %B %Y"), # Tanggal: 16 Mei 2026
            "title": title,
            "status": app.status,
            "created_at": app.appointment_date # Digunakan untuk pengurutan
        })
        
    return notif_list