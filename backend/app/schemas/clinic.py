from pydantic import BaseModel, EmailStr
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

class StaffCreateRequest(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: str # 'doctor' atau 'nurse'
    specialty: Optional[str] = "Umum" # Diperlukan jika role adalah doctor

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
    patient_name: Optional[str] = None
    patient_phone: str
    doctor_name: str
    appointment_date: datetime
    patient_address: Optional[str] = None
    patient_gender: Optional[str] = None
    notes: Optional[str] = None

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

class MedicalRecordResponse(BaseModel): # Gunakan BaseModel agar fleksibel menerima hasil JOIN
    id: int
    appointment_id: int
    diagnosis: str
    treatment: str
    notes: Optional[str] = None
    created_at: datetime
    patient_name: str # <--- WAJIB ADA karena hasil JOIN
    doctor_name: str  # <--- WAJIB ADA karena hasil JOIN

    class Config:
        from_attributes = True # Agar bisa membaca data dari SQLAlchemy row