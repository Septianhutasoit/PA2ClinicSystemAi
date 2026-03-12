from sqlalchemy import Column, Integer, String, DateTime  
from app.database.session import Base
from datetime import datetime 

class Appointment(Base):
    __tablename__ = "appointments"
    
    id = Column(Integer, primary_key=True, index=True)
    patient_name = Column(String)
    patient_phone = Column(String)
    doctor_name = Column(String)
    appointment_date = Column(DateTime) # Sekarang DateTime sudah dikenali
    status = Column(String, default="Scheduled")