from fastapi import APIRouter, Depends, HTTPException, Body, File, UploadFile
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
from app.database.session import get_db
from app.crud import clinic as crud
from app.schemas import clinic as schemas
from app.core.security import require_admin, get_current_user

from app.models.appointment import Appointment 
from app.models.clinic import Doctor, Service
from app.models.user import User
import shutil
import os

router = APIRouter()

# ==========================================
# 1. MANAJEMEN DOKTER & STAFF (ADMIN)
# ==========================================

@router.get("/doctors", response_model=List[schemas.DoctorResponse])
def read_doctors(db: Session = Depends(get_db)):
    return db.query(Doctor).all()

@router.post("/doctors", response_model=schemas.DoctorResponse)
def add_doctor(data: schemas.DoctorBase, db: Session = Depends(get_db)):
    # Membuat staff baru (Bisa role doctor atau nurse)
    new_doc = Doctor(**data.model_dump())
    db.add(new_doc)
    db.commit()
    db.refresh(new_doc)
    return new_doc

# SOLUSI EDIT: Tambahkan endpoint PATCH agar fitur Edit di Frontend berfungsi
@router.patch("/doctors/{doc_id}")
def update_doctor(doc_id: int, payload: dict = Body(...), db: Session = Depends(get_db)):
    doc = db.query(Doctor).filter(Doctor.id == doc_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Staff tidak ditemukan")
    
    # Update field secara dinamis
    for key, value in payload.items():
        if hasattr(doc, key):
            setattr(doc, key, value)
    
    db.commit()
    return {"message": "Data staff berhasil diperbarui"}

@router.delete("/doctors/{doctor_id}")
def delete_doctor(doctor_id: int, db: Session = Depends(get_db)):
    doc = db.query(Doctor).filter(Doctor.id == doctor_id).first()
    if doc:
        db.delete(doc)
        db.commit()
    return {"message": "Staff berhasil dihapus"}


@router.post("/upload-photo")
async def upload_photo(file: UploadFile = File(...)):
    try:
        # 1. Buat folder jika belum ada
        if not os.path.exists("uploads"):
            os.makedirs("uploads")

        # 2. Simpan file ke folder uploads
        file_path = os.path.join("uploads", file.filename)
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        return {"url": f"http://127.0.0.1:8000/uploads/{file.filename}"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Gagal upload: {str(e)}")

# ==========================================
# 2. MANAJEMEN LAYANAN KLINIK
# ==========================================

@router.get("/services", response_model=List[schemas.ServiceResponse])
def read_services(db: Session = Depends(get_db)):
    return db.query(Service).all()

# TAMBAHKAN INI: Agar admin bisa input layanan baru
@router.post("/services", response_model=schemas.ServiceResponse)
def add_service(data: schemas.ServiceBase, db: Session = Depends(get_db)):
    new_service = Service(**data.model_dump())
    db.add(new_service)
    db.commit()
    db.refresh(new_service)
    return new_service

@router.patch("/services/{service_id}")
def update_service(service_id: int, payload: dict = Body(...), db: Session = Depends(get_db)):
    item = db.query(Service).filter(Service.id == service_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Layanan tidak ditemukan")
    
    for key, value in payload.items():
        if hasattr(item, key):
            setattr(item, key, value)
    
    db.commit()
    return {"message": "Layanan berhasil diperbarui"}

@router.delete("/services/{service_id}")
def delete_service(service_id: int, db: Session = Depends(get_db)):
    item = db.query(Service).filter(Service.id == service_id).first()
    if item:
        db.delete(item)
        db.commit()
    return {"message": "Layanan dihapus"}

# ==========================================
# 3. RESERVASI JANJI TEMU (PATIENT & ADMIN)
# ==========================================

@router.get("/appointments", response_model=List[schemas.AppointmentResponse])
def get_all_appointments(db: Session = Depends(get_db)):
    # Mengambil semua data untuk tabel Admin
    return db.query(Appointment).order_by(Appointment.appointment_date.desc()).all()

@router.post("/appointments", response_model=schemas.AppointmentResponse)
def create_appointment(data: schemas.AppointmentCreate, db: Session = Depends(get_db)):
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
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail="Gagal mendaftar")

@router.patch("/appointments/{app_id}")
def update_appointment_status(app_id: int, payload: dict = Body(...), db: Session = Depends(get_db)):
    appointment = db.query(Appointment).filter(Appointment.id == app_id).first()
    if not appointment:
        raise HTTPException(status_code=404)

    # Bisa update status, nama, atau telp (untuk fitur Edit Pasien)
    for key, value in payload.items():
        if hasattr(appointment, key):
            setattr(appointment, key, value)
    
    db.commit()
    return {"message": "Update Berhasil"}

@router.get("/appointments/today")
def get_today_appointments(db: Session = Depends(get_db)):
    return db.query(Appointment).filter(Appointment.status == "scheduled").all()


# ==========================================
# 4. STATISTIK DASHBOARD
# ==========================================

@router.get("/stats/summary")
def get_admin_stats(db: Session = Depends(get_db)):
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
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
