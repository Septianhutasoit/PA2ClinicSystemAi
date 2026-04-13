from fastapi import APIRouter, Depends, HTTPException, Body, File, UploadFile
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
from app.database.session import get_db
from app.crud import clinic as crud
from app.schemas import clinic as schemas
from app.core.security import require_admin, get_current_user
from app.core.config import settings

from app.models.appointment import Appointment 
from app.models.clinic import Doctor, Service
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
    return {"message": "Data staff berhasil diperbarui"}

@router.delete("/doctors/{doctor_id}")
def delete_doctor(
    doctor_id: int,
    db: Session = Depends(get_db),
    admin: dict = Depends(require_admin)   # ✅ KRITIS #1: Harus admin
):
    doc = db.query(Doctor).filter(Doctor.id == doctor_id).first()
    if doc:
        db.delete(doc)
        db.commit()
    return {"message": "Staff berhasil dihapus"}


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
    return {"message": "Layanan berhasil diperbarui"}

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

@router.get("/appointments", response_model=List[schemas.AppointmentResponse])
def get_all_appointments(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)  # ✅ KRITIS #1: Harus login
):
    return db.query(Appointment).order_by(Appointment.appointment_date.desc()).all()

@router.post("/appointments", response_model=schemas.AppointmentResponse)
def create_appointment(
    data: schemas.AppointmentCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)  # ✅ KRITIS #1: Harus login (pasien/admin)
):
    try:
        new_appo = Appointment(
            patient_name=data.patient_name,
            patient_phone=data.patient_phone,
            doctor_name=data.doctor_name,
            appointment_date=data.appointment_date,
            status="pending"
        )
        db.add(new_appo)
        db.commit()
        db.refresh(new_appo)
        return new_appo
    except Exception:
        db.rollback()
        raise HTTPException(status_code=500, detail="Gagal mendaftar")

@router.patch("/appointments/{app_id}")
def update_appointment_status(
    app_id: int,
    payload: dict = Body(...),
    db: Session = Depends(get_db),
    admin: dict = Depends(require_admin)   # ✅ KRITIS #1: Hanya admin bisa ubah status
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
        today_bookings = db.query(Appointment).filter(Appointment.appointment_date >= today).count()
        
        return {
            "total_doctors": total_doctors,
            "total_appointments": total_appointments,
            "total_patients": total_patients,
            "today_bookings": today_bookings,
            "reminder_success_rate": "98%" 
        }
    except Exception:
        raise HTTPException(status_code=500, detail="Gagal mengambil data statistik.")
