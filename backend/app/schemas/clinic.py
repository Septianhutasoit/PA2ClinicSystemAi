from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List, Any

# --- 1. Schema untuk Dokter ---
class DoctorBase(BaseModel):
    name: str
    specialty: str
    photo_url: Optional[str] = None
    role: Optional[str] = "doctor"
    schedules: Optional[List[Any]] = None  # Gunakan List[Any] agar bisa menerima format JSON array
    phone: Optional[str] = ""
    email: Optional[str] = ""
    experience: Optional[str] = ""

class DoctorResponse(DoctorBase):
    id: int
    class Config:
        from_attributes = True

# --- 2. Schema untuk Layanan ---
class ServiceBase(BaseModel): # <--- TAMBAHKAN AGAR RAPI
    name: str
    description: str
    price: str
    image_url: Optional[str] = ""
    details: Optional[str] = ""
    gallery_urls: Optional[List[str]] = ""

class ServiceResponse(ServiceBase):
    id: int
    class Config: 
        from_attributes = True

# --- 3. Schema untuk Appointment (Janji Temu) ---
class AppointmentCreate(BaseModel):
    patient_name: str
    patient_phone: str
    doctor_name: str
    appointment_date: datetime

class AppointmentResponse(AppointmentCreate):
    id: int
    status: str
    class Config: 
        from_attributes = True