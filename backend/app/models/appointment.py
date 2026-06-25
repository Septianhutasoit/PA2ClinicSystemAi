from sqlalchemy import Column, Integer, String, DateTime, Boolean, ForeignKey
from app.database.session import Base
from sqlalchemy.orm import relationship
from datetime import datetime 

class Appointment(Base):
    __tablename__ = "appointments"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    patient_name = Column(String)
    patient_phone = Column(String)
    doctor_name = Column(String)
    appointment_date = Column(DateTime)
    reminder_sent = Column(Boolean, default=False)
    notes = Column(String, nullable=True)
    status = Column(String, default="Scheduled")
    created_at = Column(DateTime, default=func.now())
    patient_address = Column(String, nullable=True) 
    patient_gender = Column(String, nullable=True)  
    medical_record = relationship("MedicalRecord", back_populates="appointment", uselist=False)