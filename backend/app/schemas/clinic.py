from pydantic import BaseModel
from datetime import datetime

# --- 1. Schema untuk Dokter ---
class DoctorBase(BaseModel): # <--- WAJIB ADA UNTUK INPUT DATA
    name: str
    specialty: str
    schedule: str

class DoctorResponse(DoctorBase): # Menambah ID untuk output data
    id: int
    class Config: 
        from_attributes = True

# --- 2. Schema untuk Layanan ---
class ServiceBase(BaseModel): # <--- TAMBAHKAN AGAR RAPI
    name: str
    description: str
    price: str

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