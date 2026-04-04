from fastapi import APIRouter, Depends, HTTPException,  Body
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime # Perbaikan import
from app.database.session import get_db
from app.crud import clinic as crud
from app.schemas import clinic as schemas
from app.models.appointment import Appointment 
from app.models.clinic import Doctor, Services
from app.models.user import User # Pasien kita simpan di tabel User dengan role patient

router = APIRouter()

# --- ENDPOINT STATISTIK DASHBOARD ---
@router.get("/stats/summary")
def get_admin_stats(db: Session = Depends(get_db)):
    try:
        # 1. Hitung total staff dokter
        total_doctors = db.query(Doctor).count()
        
        # 2. Hitung total riwayat janji temu
        total_appointments = db.query(Appointment).count()
        
        # 3. Hitung user dengan role pasien
        total_patients = db.query(User).filter(User.role == "patient").count()
        
        # 4. Hitung khusus booking untuk HARI INI
        today = datetime.now().date()
        today_bookings = db.query(Appointment).filter(
            Appointment.appointment_date >= today
        ).count()
        
        return {
            "total_doctors": total_doctors,
            "total_appointments": total_appointments,
            "total_patients": total_patients,
            "today_bookings": today_bookings,
            "reminder_success_rate": "98%" 
        }
    except Exception as e:
        # Log error asli ke terminal agar admin/dev bisa baca
        print(f"CRASH PADA STATS: {str(e)}") 
        raise HTTPException(status_code=500, detail="Gagal mengambil ringkasan data")

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

@router.get("/services", response_model=List[schemas.ServiceResponse])
def read_services(db: Session = Depends(get_db)):
    return crud.get_services(db)

# backend/app/api/endpoints/clinic.py
@router.patch("/appointments/{app_id}")
def update_appointment_status(app_id: int, payload: dict = Body(...), db: Session = Depends(get_db)):
    # 1. Cari data janji temu
    appointment = db.query(Appointment).filter(Appointment.id == app_id).first()
    
    if not appointment:
        raise HTTPException(status_code=404, detail="Data janji temu tidak ditemukan")

    # 2. Update status (misal dari 'pending' ke 'confirmed')
    new_status = payload.get("status")
    if new_status:
        appointment.status = new_status
    
    try:
        db.commit()
        return {"message": f"Berhasil! Status diperbarui ke {new_status}"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail="Gagal menyimpan ke database cloud")