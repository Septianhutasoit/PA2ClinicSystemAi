from sqlalchemy import Column, Integer, String, DateTime, Boolean
from app.database.session import Base
from datetime import datetime 

class Appointment(Base):
    __tablename__ = "appointments"
    
    id = Column(Integer, primary_key=True, index=True)
    patient_name = Column(String)
    patient_phone = Column(String)
    doctor_name = Column(String)
    appointment_date = Column(DateTime) # Sekarang DateTime sudah dikenali
    reminder_sent = Column(Boolean, default=False) # Untuk monitoring n8n
    notes = Column(String, nullable=True) # Untuk catatan medis singkat
    status = Column(String, default="Scheduled")