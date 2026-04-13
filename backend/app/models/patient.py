from sqlalchemy import Column, Integer, String, DateTime, Text
from datetime import datetime # Gunakan modul bawaan Python
from app.database.session import Base

class Patient(Base):
    __tablename__ = "patients"
    
    id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String, index=True)
    last_name = Column(String, index=True)
    date_of_birth = Column(DateTime)
    email = Column(String, unique=True, index=True)
    phone_number = Column(String, unique=True, index=True)
    gender = Column(String, nullable=True)
    address = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)  