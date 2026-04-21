from sqlalchemy import Column, Integer, String, Enum, Text, Date
from app.database.session import Base
import enum

class UserRole(str, enum.Enum):
    ADMIN = "admin"
    DOCTOR = "doctor"
    NURSE = "nurse"
    PATIENT = "patient"

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    role = Column(String, default=UserRole.PATIENT)
    phone = Column(String, nullable=True)
    address = Column(Text, nullable=True)
    birth_date = Column(Date, nullable=True)
    gender = Column(String, nullable=True)  