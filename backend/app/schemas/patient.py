from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional

class PatientBase(BaseModel):
    first_name: str
    last_name: str
    date_of_birth: datetime
    email: str
    phone_number: str

class PatientCreate(PatientBase):
    pass

class PatientResponse(PatientBase):
    id: int
    created_at: datetime
    class Config:
        from_attributes = True