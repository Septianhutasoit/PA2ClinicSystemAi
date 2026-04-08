from sqlalchemy import Column, Integer, String, Text
from sqlalchemy.dialects.postgresql import JSONB  # PENTING: JSONB harus diimpor dari dialek postgresql
from app.database.session import Base

class Doctor(Base):
    __tablename__ = "doctors"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    specialty = Column(String)
    photo_url = Column(String, nullable=True)
    role = Column(String, default="doctor")
    # Menggunakan JSONB agar efisien dalam penyimpanan data jadwal terstruktur di Neon Cloud
    schedules = Column(JSONB, nullable=True) 

class Service(Base):
    __tablename__ = "services"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    description = Column(Text)
    price = Column(String)