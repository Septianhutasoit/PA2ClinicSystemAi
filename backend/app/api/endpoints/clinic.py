from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime # Perbaikan import
from app.database.session import get_db
from app.crud import clinic as crud
from app.schemas import clinic as schemas
from app.models.appointment import Appointment 
from app.models.clinic import Doctor, Service
from app.models.user import User # Pasien kita simpan di tabel User dengan role patient

router = APIRouter()

# --- ENDPOINT STATISTIK DASHBOARD ---
@router.get("/stats/summary")
def get_admin_stats(db: Session = Depends(get_db)):
    try:
        total_doctors = db.query(Doctor).count()
        total_appointments = db.query(Appointment).count()
        # Hitung user yang rolenya 'patient'
        total_patients = db.query(User).filter(User.role == "patient").count()
        
        # Hitung booking khusus hari ini
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

# --- ENDPOINT LAINNYA (TETAP DIJAGA) ---
@router.get("/doctors", response_model=List[schemas.DoctorResponse])
def read_doctors(db: Session = Depends(get_db)):
    return crud.get_doctors(db)

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
    if not doc:
        raise HTTPException(status_code=404, detail="Dokter tidak ditemukan")
    db.delete(doc)
    db.commit()
    return {"message": "Dokter berhasil dihapus"}