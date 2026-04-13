from fastapi import APIRouter, Depends, HTTPException, Body, File, UploadFile, Request
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime, timedelta
from app.database.session import get_db
from app.crud import clinic as crud
from app.schemas import clinic as schemas
from app.models.appointment import Appointment 
from app.models.clinic import Doctor, Service 
from app.models.user import User
import shutil, os, time
from sqlalchemy import func

router = APIRouter()

# ==========================================
# 1. STAFF MANAGEMENT (DOCTORS & NURSES)
# ==========================================

@router.get("/doctors", response_model=List[schemas.DoctorResponse])
def read_doctors(db: Session = Depends(get_db)):
    return db.query(Doctor).all()

@router.post("/doctors", response_model=schemas.DoctorResponse)
def add_doctor(data: schemas.DoctorBase, db: Session = Depends(get_db)):
    new_doc = Doctor(**data.model_dump())
    db.add(new_doc)
    db.commit()
    db.refresh(new_doc)
    return new_doc

@router.patch("/doctors/{doc_id}")
def update_doctor(doc_id: int, payload: dict = Body(...), db: Session = Depends(get_db)):
    doc = db.query(Doctor).filter(Doctor.id == doc_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Staff tidak ditemukan")
    for key, value in payload.items():
        if hasattr(doc, key):
            setattr(doc, key, value)
    db.commit()
    return {"message": "Data staff diperbarui"}

@router.delete("/doctors/{doctor_id}")
def delete_doctor(doctor_id: int, db: Session = Depends(get_db)):
    doc = db.query(Doctor).filter(Doctor.id == doctor_id).first()
    if doc:
        db.delete(doc)
        db.commit()
    return {"message": "Staff dihapus"}

@router.post("/upload-photo")
async def upload_photo(request: Request, file: UploadFile = File(...)):
    try:
        upload_dir = "uploads"
        if not os.path.exists(upload_dir): os.makedirs(upload_dir)
        filename = f"{int(time.time())}_{file.filename.replace(' ', '_')}"
        file_path = os.path.join(upload_dir, filename)
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        base_url = str(request.base_url).rstrip('/')
        return {"url": f"{base_url}/uploads/{filename}"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ==========================================
# 2. CLINIC SERVICES (CATALOG)
# ==========================================

@router.get("/services", response_model=List[schemas.ServiceResponse])
def read_services(db: Session = Depends(get_db)):
    return db.query(Service).all()

@router.post("/services", response_model=schemas.ServiceResponse)
def add_service(data: schemas.ServiceBase, db: Session = Depends(get_db)):
    new_service = Service(**data.model_dump())
    db.add(new_service)
    db.commit()
    db.refresh(new_service)
    return new_service

# PERBAIKAN: Nama fungsi diubah jadi update_service agar tidak bentrok
@router.patch("/services/{service_id}")
def update_service(service_id: int, payload: dict, db: Session = Depends(get_db)):
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
# 3. APPOINTMENTS (RESERVASI)
# ==========================================

@router.get("/appointments", response_model=List[schemas.AppointmentResponse])
def get_all_appointments(db: Session = Depends(get_db)):
    return db.query(Appointment).order_by(Appointment.appointment_date.desc()).all()

@router.post("/appointments", response_model=schemas.AppointmentResponse)
def create_appointment(data: schemas.AppointmentCreate, db: Session = Depends(get_db)):
    try:
        new_appo = Appointment(**data.model_dump(), status="pending")
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
    if not appointment: raise HTTPException(status_code=404)
    for key, value in payload.items():
        if hasattr(appointment, key):
            setattr(appointment, key, value)
    db.commit()
    return {"message": "Update Berhasil"}

# ==========================================
# 4. DASHBOARD ANALYTICS (FIXING 404)
# ==========================================

@router.get("/stats/summary")
def get_admin_stats(db: Session = Depends(get_db)):
    total_doctors = db.query(Doctor).count()
    total_appointments = db.query(Appointment).count()
    total_patients = db.query(User).filter(User.role == "patient").count()
    today = datetime.now().date()
    today_bookings = db.query(Appointment).filter(func.date(Appointment.appointment_date) == today).count()
    return {
        "total_doctors": total_doctors,
        "total_appointments": total_appointments,
        "total_patients": total_patients,
        "today_bookings": today_bookings,
        "reminder_success_rate": "98%" 
    }

@router.get("/stats/weekly-bookings")
def get_weekly_stats(db: Session = Depends(get_db)):
    try:
        seven_days_ago = datetime.now() - timedelta(days=7)
        stats = db.query(
            func.date(Appointment.appointment_date).label('date'),
            func.count(Appointment.id).label('count')
        ).filter(Appointment.appointment_date >= seven_days_ago)\
         .group_by(func.date(Appointment.appointment_date)).all()
        return [{"day": s.date.strftime("%a"), "total": s.count} for s in stats]
    except Exception:
        return []

@router.get("/stats/recent-bookings")
def get_recent_bookings(db: Session = Depends(get_db)):
    return db.query(Appointment).order_by(Appointment.id.desc()).limit(5).all()