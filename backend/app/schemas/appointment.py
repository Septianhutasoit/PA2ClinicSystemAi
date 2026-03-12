from pydantic import BaseModel
from datetime import datetime

class Appointment(BaseModel):
    patient_name: str
    patient_phone: str
    doctor_name: str
    appointment_date: datetime

class AppointmentResponse(Appointment):
    id: int
    status: str
    class Config:
        from_attributes = True