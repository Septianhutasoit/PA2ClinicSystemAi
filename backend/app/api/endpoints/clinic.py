from app.models.patient import Patient
from fastapi import APIRouter, Depends, HTTPException, Body, File, UploadFile
from sqlalchemy import func
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime, date
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

VALID_STATUSES = {"pending", "confirmed", "completed", "cancelled"}


# ══════════════════════════════════════════════════════════════════════════════
# HELPER: ambil User dari email token (DRY)
# ══════════════════════════════════════════════════════════════════════════════

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
    """Pasien membuat janji temu baru (status awal: pending)."""
    try:
        user = _get_user_by_token(current_user, db)
        new_appo = Appointment(
            **data.model_dump(),
            status="pending",
            user_id=user.id,
        )
        db.add(new_appo)
        db.commit()
        db.refresh(new_appo)
        return new_appo
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Gagal mendaftar: {str(e)}")


# ══════════════════════════════════════════════════════════════════════════════
# 5. APPOINTMENT — DOKTER (filter hanya milik dokter yang login)
# ══════════════════════════════════════════════════════════════════════════════

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
    """
    Dokter melihat antrian HARI INI yang ditujukan kepadanya.
    Filter ketat: nama dokter + rentang waktu hari ini + status confirmed.
    """
    user = _get_user_by_token(current_user, db)

    today_start = datetime.combine(date.today(), datetime.min.time())
    today_end   = datetime.combine(date.today(), datetime.max.time())

    return (
        db.query(Appointment)
        .filter(
            Appointment.doctor_name == user.full_name,
            Appointment.appointment_date >= today_start,
            Appointment.appointment_date <= today_end,
            Appointment.status == "confirmed",
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
    # Ambil data dokter yang sedang login
    user = _get_user_by_token(current_user, db)
    today = date.today()

    my_name = user.full_name.strip().lower() 
    
    # Base query: Pasien yang memanggil nama dokter ini
    base = db.query(Appointment).filter(func.lower(Appointment.doctor_name) == my_name)

    return {
        "doctor_name": user.full_name,
        "total_all_patients": base.count(),
        "today_patients": base.filter(func.date(Appointment.appointment_date) == today).count(),
        # FIX: Gunakan status huruf kecil 'confirmed'
        "waiting_patients": base.filter(
            func.date(Appointment.appointment_date) == today, 
            Appointment.status == "confirmed" 
        ).count(),
        # FIX: Gunakan status huruf kecil 'completed'
        "completed_today": base.filter(
            func.date(Appointment.appointment_date) == today, 
            Appointment.status == "completed"
        ).count(),
    }


# ══════════════════════════════════════════════════════════════════════════════
# 6. APPOINTMENT — PERAWAT / ADMIN
# ══════════════════════════════════════════════════════════════════════════════

@router.get("/appointments")
def get_all_appointments(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    """
    Semua appointment — hanya nurse/admin/doctor yang boleh.
    Pasien langsung ditolak agar tidak bisa intip data orang lain.
    """
    if current_user["role"] == "patient":
        raise HTTPException(status_code=403, detail="Pasien tidak diizinkan melihat semua antrian")
    return db.query(Appointment).order_by(Appointment.appointment_date.desc()).all()


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
    """Tren reservasi — implementasi dummy, ganti dengan query GROUP BY saat siap."""
    import random
    labels = (
        ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"]
        if period == "weekly"
        else ["Minggu 1", "Minggu 2", "Minggu 3", "Minggu 4"]
    )
    return [{"name": d, "online": random.randint(10, 50)} for d in labels]


# ══════════════════════════════════════════════════════════════════════════════
# 9. MANAJEMEN PASIEN (ADMIN & STAFF)
# ══════════════════════════════════════════════════════════════════════════════

@router.get("/patients")
def get_patients(
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_staff_or_admin),
):
    from app.models.patient import Patient
    patients = db.query(Patient).all()
    
    output = []
    for p in patients:
        # Gabungka nama
        full_name = f"{p.first_name} {p.last_name or ''}".strip()
        
        output.append({
            "id": p.id,
            "full_name": full_name, 
            "first_name": p.first_name,
            "last_name": p.last_name,
            "email": p.email,
            "phone_number": p.phone_number,
            "created_at": p.created_at,
            "total_appointments": db.query(Appointment)
                                    .filter(func.lower(Appointment.patient_name) == full_name.lower())
                                    .count(),
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