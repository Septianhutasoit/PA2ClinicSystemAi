from pydantic import BaseModel, EmailStr
from typing import Optional

class UserBase(BaseModel):
    email: EmailStr
    full_name: str
    role: str

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: int
    role: str
    class Config: from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class Token(BaseModel):
    acces_token: str
    token_type: str
    role: str
