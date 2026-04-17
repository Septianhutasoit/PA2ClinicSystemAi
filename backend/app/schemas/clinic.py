from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List, Any

class DoctorBase(BaseModel):
    name: str
    specialty: str
    photo_url: Optional[str] = None
    role: Optional[str] = "doctor"
    schedules: Optional[List[Any]] = None
    phone: Optional[str] = ""
    email: Optional[str] = ""
    experience: Optional[str] = ""

class DoctorResponse(DoctorBase):
    id: int
    class Config:
        from_attributes = True

class ServiceBase(BaseModel):
    name: str
    description: str
    price: str
    image_url: Optional[str] = None
    detail_info: Optional[str] = None
    gallery_urls: Optional[List[str]] = []

class ServiceResponse(ServiceBase):
    id: int
    class Config: 
        from_attributes = True

# INDUK: Harus dibuat paling atas agar bisa dipanggil anak-anaknya
class AppointmentBase(BaseModel):
    patient_name: str
    patient_phone: str
    doctor_name: str
    appointment_date: datetime
    patient_address: Optional[str] = None # Kolom baru Neon
    patient_gender: Optional[str] = None  # Kolom baru Neon

class AppointmentCreate(AppointmentBase):
    pass

class AppointmentResponse(AppointmentBase):
    id: int
    status: str
    class Config: 
        from_attributes = True

class PatientResponse(BaseModel):
    id: int
    first_name: str
    last_name: str
    email: str
    phone_number: str
    gender: Optional[str] = None
    address: Optional[str] = None

    class Config:
        from_attributes = True

class MedicalRecordBase(BaseModel):
    appointment_id: int
    diagnosis: str
    treatment: str
    notes: Optional[str] = None

class MedicalRecordCreate(MedicalRecordBase):
    pass

class MedicalRecordResponse(MedicalRecordBase):
    id: int
    patient_name: str # Kita ambil dari join table nanti
    created_at: datetime

    class Config:
        from_attributes = True