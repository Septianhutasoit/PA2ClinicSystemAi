from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordRequestForm
from app.database.session import get_db
from app.models.user import User
from app.schemas.user import UserCreate, UserResponse, Token
from app.core import security

router = APIRouter()

@router.post("/register", response_model=UserResponse)
def register(user_in: UserCreate, db: Session = Depends(get_db)):
    # Cek apakah email sudah terdaftar
    user_exists = db.query(User).filter(User.email == user_in.email).first()
    if user_exists:
        raise HTTPException(status_code=400, detail="Email sudah digunakan")
    
    # Simpan user baru
    new_user = User(
        email=user_in.email,
        full_name=user_in.full_name,
        hashed_password=security.get_password_hash(user_in.password),
        role="patient" # Default pendaftar web adalah pasien
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@router.post("/login", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == form_data.username).first()
    if not user or not security.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Email atau password salah")
    
    access_token = security.create_access_token(data={"sub": user.email, "role": user.role})
    return {"access_token": access_token, "token_type": "bearer"}

# Tambahkan di bagian bawah auth.py
from pydantic import BaseModel, EmailStr

# 1. Definisikan Schema Request (Penting agar tidak 422 Error)
class ResetPasswordRequest(BaseModel):
    email: EmailStr
    new_password: str

# 2. Buat Endpoint-nya
@router.post("/reset-password")
def reset_password(data: ResetPasswordRequest, db: Session = Depends(get_db)):
    # Cari user berdasarkan email yang diinput di frontend
    user = db.query(User).filter(User.email == data.email).first()
    
    if not user:
        raise HTTPException(status_code=404, detail="Email tidak ditemukan di database Neon")

    # Hash password baru menggunakan security utility kita
    user.hashed_password = security.get_password_hash(data.new_password)
    
    db.commit() # Simpan ke Neon Cloud
    return {"message": "Password berhasil diperbarui!"}