from fastapi import APIRouter, Depends, HTTPException, Body
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
from app.database.session import get_db
from app.crud import clinic as crud
from app.schemas import clinic as schemas
from app.models.appointment import Appointment 
from app.models.clinic import Doctor, Service # Pastikan ini 'Service' bukan 'Services'
from app.models.user import User

router = APIRouter()

# --- 1. ENDPOINT PENDAFTARAN (SOLUSI ERROR 405 DI USER) ---
# --- 1. ENDPOINT UNTUK MENAMPILKAN LIST DI ADMIN (DITAMBAHKAN) ---
@router.get("/appointments", response_model=List[schemas.AppointmentResponse])
def get_all_appointments(db: Session = Depends(get_db)):
    """
    Fungsi ini WAJIB ada agar tabel di halaman Admin tidak Error 405.
    Mengambil semua data janji temu dari yang terbaru.
    """
    return db.query(Appointment).order_by(Appointment.appointment_date.desc()).all()


# --- 2. ENDPOINT PENDAFTARAN (UNTUK USER) ---
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
        print(f"ERROR POST: {str(e)}")
        raise HTTPException(status_code=500, detail="Gagal membuat janji temu")


# --- 3. ENDPOINT UPDATE STATUS & DATA (UNTUK ADMIN) ---
@router.patch("/appointments/{app_id}")
def update_appointment_status(app_id: int, payload: dict = Body(...), db: Session = Depends(get_db)):
    appointment = db.query(Appointment).filter(Appointment.id == app_id).first()
    if not appointment:
        raise HTTPException(status_code=404, detail="Data tidak ditemukan")

    # Update status atau data lainnya jika dikirim dari modal edit
    if "status" in payload:
        appointment.status = payload["status"]
    if "patient_name" in payload:
        appointment.patient_name = payload["patient_name"]
    if "patient_phone" in payload:
        appointment.patient_phone = payload["patient_phone"]
    
    try:
        db.commit()
        return {"message": "Berhasil diperbarui"}
    except Exception:
        db.rollback()
        raise HTTPException(status_code=500, detail="Gagal update database")


# --- 4. ENDPOINT STATISTIK (DASHBOARD) ---
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

# --- 4. ENDPOINT DOCTORS & SERVICES ---
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

@router.delete("/doctors/{doctor_id}")
def delete_doctor(doctor_id: int, db: Session = Depends(get_db)):
    doc = db.query(Doctor).filter(Doctor.id == doctor_id).first()
    if doc:
        db.delete(doc)
        db.commit()
    return {"message": "Dihapus"}