from xmlrpc.client import Boolean

from sqlalchemy import Column, Integer, String, Text, JSON, ForeignKey, DateTime, Boolean
from app.database.session import Base
from datetime import datetime

class Doctor(Base):
    __tablename__ = "doctors"
    id          = Column(Integer, primary_key=True, index=True)
    name        = Column(String)
    specialty   = Column(String)
    photo_url   = Column(String, nullable=True)
    role        = Column(String, default="doctor")
    schedules   = Column(JSON, nullable=True)
    phone       = Column(String, nullable=True)
    email       = Column(String, nullable=True)
    experience  = Column(String, nullable=True)

class Service(Base):
    __tablename__ = "services"
    id          = Column(Integer, primary_key=True, index=True)
    name        = Column(String)
    description = Column(Text)
    price       = Column(String)
    image_url   = Column(String, nullable=True)
    detail_info = Column(Text, nullable=True)
    gallery_urls = Column(JSON, nullable=True)  # JSON works for both SQLite & PostgreSQL

class MedicalRecord(Base):
    __tablename__ = "medical_records"
    id             = Column(Integer, primary_key=True, index=True)
    appointment_id = Column(Integer, ForeignKey("appointments.id"), nullable=True)
    diagnosis      = Column(Text)
    treatment      = Column(Text)
    notes          = Column(Text, nullable=True)
    created_at     = Column(DateTime, default=datetime.utcnow)

class ChatLog(Base):
    __tablename__ = "chat_logs"
    id           = Column(Integer, primary_key=True, index=True)
    session_id   = Column(String, nullable=True)
    user_message = Column(Text)
    bot_response = Column(Text)
    feedback     = Column(Boolean, nullable=True)  # True=suka, False=tidak suka
    created_at   = Column(DateTime, default=datetime.utcnow)