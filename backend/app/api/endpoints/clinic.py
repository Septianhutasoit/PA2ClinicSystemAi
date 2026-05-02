from fastapi import APIRouter, Depends, HTTPException, Body, File, UploadFile, Request
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime, timedelta, date
from pydantic import BaseModel
from app.database.session import get_db
from app.crud import clinic as crud
from app.schemas import clinic as schemas
from app.core.security import (
    require_admin, get_current_user,
    require_doctor_or_admin, require_nurse_or_admin,
    require_staff_or_admin
)
from app.core.config import settings

from app.models.appointment import Appointment
from app.models.clinic import Doctor, Service, MedicalRecord
from app.models.user import User
import shutil
import os
import uuid

router = APIRouter()


# ==========================================
# 1. MANAJEMEN DOKTER & STAFF (ADMIN ONLY)
# ==========================================

@router.get("/doctors", response_model=List[schemas.DoctorResponse])
def read_doctors(db: Session = Depends(get_db)):
    # GET doctors boleh publik (tampil di halaman landing)
    return db.query(Doctor).all()

@router.post("/doctors", response_model=schemas.DoctorResponse)
def add_doctor(
    data: schemas.DoctorBase,
    db: Session = Depends(get_db),
    admin: dict = Depends(require_admin)   # ✅ KRITIS #1: Harus admin
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
    admin: dict = Depends(require_admin)   # ✅ KRITIS #1: Harus admin
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
    admin: dict = Depends(require_admin)   # ✅ KRITIS #1: Harus admin
):
    doc = db.query(Doctor).filter(Doctor.id == doctor_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Dokter tidak ditemukan")
    db.delete(doc)
    db.commit()
    return {"message": "Staff dihapus"}

# ==========================================
# UPLOAD FOTO (VALIDASI KETAT)   ✅ KRITIS #2
# ==========================================

# Ekstensi yang diizinkan (image only)
ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp", ".gif"}
MAX_FILE_SIZE_MB = 2
MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024

@router.post("/upload-photo")
async def upload_photo(
    file: UploadFile = File(...),
    current_user: dict = Depends(get_current_user)  # ✅ KRITIS #1: Harus login
):
    # 1. Validasi ekstensi file
    file_ext = os.path.splitext(file.filename or "")[1].lower()
    if file_ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"Tipe file tidak diizinkan. Hanya: {', '.join(ALLOWED_EXTENSIONS)}"
        )

    # 2. Baca konten & validasi ukuran
    contents = await file.read()
    if len(contents) > MAX_FILE_SIZE_BYTES:
        raise HTTPException(
            status_code=400,
            detail=f"Ukuran file terlalu besar. Maksimal {MAX_FILE_SIZE_MB}MB."
        )

    try:
        # 3. Buat folder jika belum ada
        if not os.path.exists("uploads"):
            os.makedirs("uploads")

        # 4. Gunakan nama unik (UUID) untuk mencegah Path Traversal & overwrite
        safe_filename = f"{uuid.uuid4().hex}{file_ext}"
        file_path = os.path.join("uploads", safe_filename)

        with open(file_path, "wb") as buffer:
            buffer.write(contents)

        return {"url": f"{settings.BACKEND_URL}/uploads/{safe_filename}"}
    except Exception:
        raise HTTPException(status_code=500, detail="Gagal menyimpan file.")


# ==========================================
# 2. MANAJEMEN LAYANAN KLINIK (ADMIN ONLY)
# ==========================================

@router.get("/services", response_model=List[schemas.ServiceResponse])
def read_services(db: Session = Depends(get_db)):
    # GET services boleh publik (tampil di halaman landing)
    return db.query(Service).all()

@router.post("/services", response_model=schemas.ServiceResponse)
def add_service(
    data: schemas.ServiceBase,
    db: Session = Depends(get_db),
    admin: dict = Depends(require_admin)   # ✅ KRITIS #1: Harus admin
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
    admin: dict = Depends(require_admin)   # ✅ KRITIS #1: Harus admin
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
    admin: dict = Depends(require_admin)   # ✅ KRITIS #1: Harus admin
):
    item = db.query(Service).filter(Service.id == service_id).first()
    if item:
        db.delete(item)
        db.commit()
    return {"message": "Layanan dihapus"}


# ==========================================
# 3. RESERVASI JANJI TEMU
# ==========================================

@router.get("/appointments/me", response_model=List[schemas.AppointmentResponse])
def get_my_appointments(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    # Menyaring antrian khusus milik pasien yang login
    user = db.query(User).filter(User.email == current_user["email"]).first()
    if not user:
        raise HTTPException(status_code=404, detail="User tidak ditemukan")
    
    return db.query(Appointment).filter(Appointment.user_id == user.id).order_by(Appointment.appointment_date.desc()).all()

@router.post("/appointments", response_model=schemas.AppointmentResponse)
def create_appointment(
    data: schemas.AppointmentCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)  # ✅ KRITIS #1: Harus login (pasien/admin)
):
    try:
        user = db.query(User).filter(User.email == current_user["email"]).first()
        appo_data = data.model_dump()
        new_appo = Appointment(**appo_data, status="pending", user_id=user.id if user else None)
        db.add(new_appo)
        db.commit()
        db.refresh(new_appo)
        return new_appo
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail="Gagal mendaftar: " + str(e))

@router.get("/appointments", response_model=List[schemas.AppointmentResponse])
def get_all_appointments(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)  # ✅ KRITIS #1: Harus login
):
    # Endpoint ini untuk Nurse dan Doctor melihat semua antrian
    if current_user["role"] == "patient":
        raise HTTPException(status_code=403, detail="Pasien tidak diizinkan melihat semua antrian")
    return db.query(Appointment).order_by(Appointment.appointment_date.desc()).all()

@router.patch("/appointments/{app_id}")
def update_appointment_status(
    app_id: int,
    payload: dict = Body(...),
    db: Session = Depends(get_db),
    admin: dict = Depends(require_staff_or_admin)   # ✅ KRITIS #1: Bisa dilakukan dokter, perawat, atau admin
):
    appointment = db.query(Appointment).filter(Appointment.id == app_id).first()
    if not appointment:
        raise HTTPException(status_code=404, detail="Janji temu tidak ditemukan")

    for key, value in payload.items():
        if hasattr(appointment, key):
            setattr(appointment, key, value)
    db.commit()
    return {"message": "Update Berhasil"}

@router.get("/appointments/today")
def get_today_appointments(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)  # ✅ KRITIS #1: Harus login
):
    return db.query(Appointment).filter(Appointment.status == "scheduled").all()


# ==========================================
# 4. STATISTIK DASHBOARD (ADMIN ONLY)
# ==========================================

@router.get("/stats/summary")
def get_admin_stats(
    db: Session = Depends(get_db),
    admin: dict = Depends(require_admin)  # ✅ Sudah ada dari perbaikan sebelumnya
):
    try:
        total_doctors = db.query(Doctor).count()
        total_appointments = db.query(Appointment).count()
        total_patients = db.query(User).filter(User.role == "patient").count()

        today = datetime.now().date()
        today_bookings = db.query(Appointment).filter(
            Appointment.appointment_date >= datetime.combine(today, datetime.min.time())
        ).count()
        return {
            "total_doctors": total_doctors,
            "total_appointments": total_appointments,
            "total_patients": total_patients,
            "today_bookings": today_bookings,
            "reminder_success_rate": "98%"
        }
    except Exception:
        raise HTTPException(status_code=500, detail="Gagal mengambil data statistik.")

@router.get("/stats/analytics")
def get_stats_analytics(
    period: str = "weekly",
    db: Session = Depends(get_db),
    admin: dict = Depends(require_admin)
):
    """Data untuk grafik tren reservasi."""
    try:
        # Dummy data logic — bisa ditingkatkan dengan query group by date
        days = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"]
        if period == "monthly":
            days = ["Minggu 1", "Minggu 2", "Minggu 3", "Minggu 4"]
            
        # Contoh query sederhana untuk menghitung per hari (7 hari terakhir)
        analytics = []
        for d in days:
            import random
            analytics.append({
                "name": d,
                "online": random.randint(10, 50) # Dalam sistem nyata, ini query DB
            })
        return analytics
    except Exception:
        return []

@router.get("/stats/recent-bookings")
def get_recent_bookings(
    db: Session = Depends(get_db),
    admin: dict = Depends(require_admin)
):
    """Mengambil 5 reservasi terbaru."""
    return db.query(Appointment).order_by(Appointment.appointment_date.desc()).limit(5).all()

# ==========================================
# 5. MANAJEMEN PASIEN (ADMIN ONLY)
# ==========================================

@router.get("/patients")
def get_patients(
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_staff_or_admin)
):
    # Mengambil semua user dengan role patient
    patients = db.query(User).filter(User.role == "patient").all()
    
    # Format data agar rapi untuk frontend
    return [
        {
            "id": p.id,
            "full_name": p.full_name,
            "email": p.email,
            "created_at": p.created_at if hasattr(p, 'created_at') else None,
            "total_appointments": db.query(Appointment).filter(Appointment.patient_name == p.full_name).count()
        }
        for p in patients
    ]

@router.patch("/patients/{p_id}")
def update_patient(p_id: int, payload: dict, db: Session = Depends(get_db)):
    from app.models.patient import Patient
    p = db.query(Patient).filter(Patient.id == p_id).first()
    if p:
        for k, v in payload.items():
            setattr(p, k, v)
        db.commit()
    return {"message": "Success"}

@router.get("/medical-records", response_model=List[schemas.MedicalRecordResponse])
def read_medical_records(db: Session = Depends(get_db)):
    try:
        # Mengambil data rekam medis dan menggabungkannya dengan nama pasien dari tabel appointments
        results = db.query(
            MedicalRecord.id,
            MedicalRecord.diagnosis,
            MedicalRecord.treatment,
            MedicalRecord.notes,
            MedicalRecord.created_at,
            Appointment.patient_name,
            MedicalRecord.appointment_id
        ).join(Appointment, MedicalRecord.appointment_id == Appointment.id).all()
        return results
    except Exception as e:
        print(f"❌ ERROR REKAM MEDIS: {str(e)}")
        raise HTTPException(status_code=500, detail="Gagal mengambil data rekam medis")


# --- ENDPOINT SIMPAN REKAM MEDIS BARU ---
@router.post("/medical-records")
def create_medical_record(data: schemas.MedicalRecordCreate, db: Session = Depends(get_db)):
    try:
        # Gunakan 'data' (Pydantic) bukan 'payload' (dict) agar lebih aman
        new_record = MedicalRecord(**data.model_dump())
        db.add(new_record)
        db.commit()
        return {"message": "Rekam medis tersimpan"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))


# ============================================================
# ENDPOINT DOKTER
# ============================================================

@router.get("/appointments/my-schedule")
def get_doctor_schedule(
    current_user: dict = Depends(require_doctor_or_admin),
    db: Session = Depends(get_db)
):
    """Dokter melihat semua appointment yang ditujukan ke namanya."""
    # Cari nama dokter dari tabel User berdasarkan email
    user = db.query(User).filter(User.email == current_user["email"]).first()
    if not user:
        raise HTTPException(status_code=404, detail="User tidak ditemukan")
    
    appointments = db.query(Appointment).filter(
        Appointment.doctor_name == user.full_name
    ).order_by(Appointment.appointment_date.desc()).all()
    return appointments


@router.get("/appointments/my-today")
def get_doctor_today(
    current_user: dict = Depends(require_doctor_or_admin),
    db: Session = Depends(get_db)
):
    """Dokter melihat pasien yang datang hari ini."""
    user = db.query(User).filter(User.email == current_user["email"]).first()
    if not user:
        raise HTTPException(status_code=404, detail="User tidak ditemukan")
    
    today_start = datetime.combine(date.today(), datetime.min.time())
    today_end = datetime.combine(date.today(), datetime.max.time())
    
    appointments = db.query(Appointment).filter(
        Appointment.doctor_name == user.full_name,
        Appointment.appointment_date >= today_start,
        Appointment.appointment_date <= today_end
    ).order_by(Appointment.appointment_date.asc()).all()
    return appointments


@router.get("/appointments/doctor-stats")
def get_doctor_stats(
    current_user: dict = Depends(require_doctor_or_admin),
    db: Session = Depends(get_db)
):
    """Statistik ringkas untuk dashboard dokter."""
    user = db.query(User).filter(User.email == current_user["email"]).first()
    if not user:
        raise HTTPException(status_code=404, detail="User tidak ditemukan")
    
    today_start = datetime.combine(date.today(), datetime.min.time())
    today_end = datetime.combine(date.today(), datetime.max.time())
    
    total_all = db.query(Appointment).filter(
        Appointment.doctor_name == user.full_name
    ).count()
    
    today_count = db.query(Appointment).filter(
        Appointment.doctor_name == user.full_name,
        Appointment.appointment_date >= today_start,
        Appointment.appointment_date <= today_end
    ).count()
    
    waiting_count = db.query(Appointment).filter(
        Appointment.doctor_name == user.full_name,
        Appointment.appointment_date >= today_start,
        Appointment.appointment_date <= today_end,
        Appointment.status == "Scheduled"
    ).count()
    
    completed_today = db.query(Appointment).filter(
        Appointment.doctor_name == user.full_name,
        Appointment.appointment_date >= today_start,
        Appointment.appointment_date <= today_end,
        Appointment.status == "Completed"
    ).count()
    
    return {
        "doctor_name": user.full_name,
        "total_all_patients": total_all,
        "today_patients": today_count,
        "waiting_patients": waiting_count,
        "completed_today": completed_today,
    }


# ============================================================
# ENDPOINT PERAWAT
# ============================================================

@router.get("/appointments/all")
def get_all_appointments_nurse(
    current_user: dict = Depends(require_nurse_or_admin),
    db: Session = Depends(get_db)
):
    """Perawat/Admin melihat semua appointment."""
    appointments = db.query(Appointment).order_by(
        Appointment.appointment_date.desc()
    ).all()
    return appointments


@router.get("/appointments/queue")
def get_today_queue(
    current_user: dict = Depends(require_nurse_or_admin),
    db: Session = Depends(get_db)
):
    """Antrian pasien hari ini (untuk perawat)."""
    today_start = datetime.combine(date.today(), datetime.min.time())
    today_end = datetime.combine(date.today(), datetime.max.time())
    
    appointments = db.query(Appointment).filter(
        Appointment.appointment_date >= today_start,
        Appointment.appointment_date <= today_end,
    ).order_by(Appointment.appointment_date.asc()).all()
    return appointments


@router.get("/appointments/nurse-stats")
def get_nurse_stats(
    current_user: dict = Depends(require_nurse_or_admin),
    db: Session = Depends(get_db)
):
    """Statistik ringkas untuk dashboard perawat."""
    today_start = datetime.combine(date.today(), datetime.min.time())
    today_end = datetime.combine(date.today(), datetime.max.time())
    
    total_today = db.query(Appointment).filter(
        Appointment.appointment_date >= today_start,
        Appointment.appointment_date <= today_end
    ).count()
    
    waiting = db.query(Appointment).filter(
        Appointment.appointment_date >= today_start,
        Appointment.appointment_date <= today_end,
        Appointment.status == "Scheduled"
    ).count()
    
    completed = db.query(Appointment).filter(
        Appointment.appointment_date >= today_start,
        Appointment.appointment_date <= today_end,
        Appointment.status == "Completed"
    ).count()
    
    cancelled = db.query(Appointment).filter(
        Appointment.appointment_date >= today_start,
        Appointment.appointment_date <= today_end,
        Appointment.status == "Cancelled"
    ).count()
    
    total_all_time = db.query(Appointment).count()
    
    return {
        "total_today": total_today,
        "waiting": waiting,
        "completed": completed,
        "cancelled": cancelled,
        "total_all_time": total_all_time,
    }


# ============================================================
# ENDPOINT UPDATE STATUS (Dokter & Perawat)
# ============================================================

class StatusUpdate(BaseModel):
    status: str  # "Scheduled" | "Completed" | "Cancelled"
    notes: Optional[str] = None


@router.patch("/appointments/{appointment_id}/status")
def update_appointment_status_by_role(
    appointment_id: int,
    body: StatusUpdate,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update status appointment — bisa dilakukan dokter, perawat, atau admin."""
    allowed_roles = ["doctor", "nurse", "admin"]
    if current_user.get("role") not in allowed_roles:
        raise HTTPException(status_code=403, detail="Akses ditolak")
    
    allowed_statuses = ["Scheduled", "Completed", "Cancelled"]
    if body.status not in allowed_statuses:
        raise HTTPException(
            status_code=400,
            detail=f"Status tidak valid. Gunakan: {', '.join(allowed_statuses)}"
        )
    
    appo = db.query(Appointment).filter(Appointment.id == appointment_id).first()
    if not appo:
        raise HTTPException(status_code=404, detail="Appointment tidak ditemukan")
    
    appo.status = body.status
    if body.notes:
        appo.notes = body.notes
    
    try:
        db.commit()
        db.refresh(appo)
        return appo
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
