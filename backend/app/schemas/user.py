from pydantic import BaseModel, EmailStr
from typing import Optional

# Data dasar user
class UserBase(BaseModel):
    email: EmailStr
    full_name: str

# Data yang dikirim saat DAFTAR (Tanpa Role!)
class UserCreate(UserBase):
    password: str

# Data yang dikembalikan setelah berhasil (Ada Role & ID)
class UserResponse(UserBase):
    id: int
    role: str
    class Config: 
        from_attributes = True

# Data Token untuk Login
class Token(BaseModel):
    access_token: str
    token_type: str
    role: str
