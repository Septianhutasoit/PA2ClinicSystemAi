from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database.session import get_db
from app.crud import clinic as crud
from app.schemas import clinic as schemas
from app.core.security import require_admin, get_current_user

# Kita panggil langsung class-nya agar tidak perlu pakai 'models.'
from app.models.appointment import Appointment 
from app.models.clinic import Doctor, Service
from app.models.patient import Patient

router = APIRouter()

@router.get("/doctors", response_model=List[schemas.DoctorResponse])
def read_doctors(db: Session = Depends(get_db)):
    return crud.get_doctors(db)

@router.get("/services", response_model=List[schemas.ServiceResponse])
def read_services(db: Session = Depends(get_db)):
    return crud.get_services(db)

# Tambahkan ini di file clinic.py
@router.post("/doctors", response_model=schemas.DoctorResponse)
def add_doctor(data: schemas.DoctorBase, db: Session = Depends(get_db), admin: dict = Depends(require_admin)):
    new_doc = Doctor(**data.model_dump())
    db.add(new_doc)
    db.commit()
    db.refresh(new_doc)
    return new_doc

@router.delete("/doctors/{doctor_id}")
def delete_doctor(doctor_id: int, db: Session = Depends(get_db), admin: dict = Depends(require_admin)):
    doc = db.query(Doctor).filter(Doctor.id == doctor_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Dokter tidak ditemukan")
    db.delete(doc)
    db.commit()
    return {"message": "Dokter berhasil dihapus"}

@router.post("/appointments", response_model=schemas.AppointmentResponse)
def create_appointment(data: schemas.AppointmentCreate, db: Session = Depends(get_db)):
    new_appo = Appointment(**data.model_dump())
    db.add(new_appo)
    db.commit()
    db.refresh(new_appo)
    return new_appo

@router.get("/appointments/today")
def get_today_appointments(db: Session = Depends(get_db)):
    # Panggil 'Appointment' langsung
    return db.query(Appointment).filter(Appointment.status == "scheduled").all()


@router.get("/stats/summary")
def get_admin_stats(db: Session = Depends(get_db), admin: dict = Depends(require_admin)):
    total_doctors = db.query(Doctor).count()
    total_appointments = db.query(Appointment).count()
    total_patients = db.query(Patient).count()
    
    # Menghitung pendaftar hari ini
    return {
        "total_doctors": total_doctors,
        "total_appointments": total_appointments,
        "total_patients": total_patients,
        "reminder_success_rate": "98%" # Contoh data statis dulu
    }