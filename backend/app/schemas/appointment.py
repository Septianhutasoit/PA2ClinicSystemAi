from pydantic import BaseModel
from datetime import datetime

class Appointment(BaseModel):
    patient_name: str
    patient_phone: str
    doctor_name: str
    appointment_date: datetime
    patient_address: Optional[str] = None
    patient_gender: Optional[str] = None

class AppointmentCreate(Appointment):
    pass

class AppointmentResponse(Appointment):
    id: int
    status: str
    class Config:
        from_attributes = True