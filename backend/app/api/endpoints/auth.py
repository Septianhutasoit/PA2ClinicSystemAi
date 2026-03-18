from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordRequestForm
from app.database.session import get_db
from app.models.user import User
from app.schemas.user import UserCreate, UserResponse, Token
from app.core import security
from pydantic import BaseModel, EmailStr

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
# Schema bantuan untuk Reset Password
class ResetPasswordRequest(BaseModel):
    email: EmailStr
    new_password: str

@router.post("/reset-password")
def reset_password(data: ResetPasswordRequest, db: Session = Depends(get_db)):
    """
    Fitur Reset Password:
    Mencari email di Neon Cloud, jika ada maka update hashed_password.
    """
    # 1. Cari user
    user = db.query(User).filter(User.email == data.email).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Email tidak terdaftar dalam sistem kami."
        )
    
    # 2. Update password dengan hashing baru (Bcrypt)
    user.hashed_password = security.get_password_hash(data.new_password)
    
    try:
        db.commit()
        return {"message": "Password berhasil diperbarui secara aman di database."}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail="Gagal menyimpan data ke database.")

@router.get("/me", response_model=UserResponse)
def get_current_user(db: Session = Depends(get_db), token: str = Depends(security.oauth2_scheme)):
    """
    Fitur 'Siapa Saya':
    Digunakan frontend untuk mengambil data profil user yang sedang login menggunakan Token.
    """
    try:
        # Decode token untuk ambil email
        payload = security.jwt.decode(token, security.SECRET_KEY, algorithms=[security.ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=401, detail="Token tidak valid")
    except Exception:
        raise HTTPException(status_code=401, detail="Sesi berakhir, silakan login ulang")

    user = db.query(User).filter(User.email == email).first()
    if user is None:
        raise HTTPException(status_code=404, detail="User tidak ditemukan")
        
    return user