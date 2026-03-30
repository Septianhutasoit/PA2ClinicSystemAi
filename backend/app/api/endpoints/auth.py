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
    # 1. Cari user di Neon Cloud
    user = db.query(User).filter(User.email == form_data.username).first()
    
    # 2. Validasi Password
    if not user or not security.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail="Email atau password salah"
        )
    
    # 3. Buat Token (Role dimasukkan ke dalam Payload JWT)
    access_token = security.create_access_token(
        data={"sub": user.email, "role": user.role}
    )
    
    # 4. MODIFIKASI PENTING: Kirim role secara eksplisit ke Frontend
    return {
        "access_token": access_token, 
        "token_type": "bearer",
        "role": user.role  # <--- Ini sangat penting agar Frontend bisa redirect
    }

# --- FITUR RESET PASSWORD (Harus Login) ---

class ResetPasswordRequest(BaseModel):
    new_password: str

@router.post("/reset-password")
def reset_password(
    data: ResetPasswordRequest, 
    db: Session = Depends(get_db),
    current_user: dict = Depends(security.get_current_user)
):
    # Ambil email dari token JWT (bukan dari input user)
    user = db.query(User).filter(User.email == current_user["email"]).first()
    
    if not user:
        raise HTTPException(status_code=404, detail="User tidak ditemukan")

    # Validasi panjang password minimum
    if len(data.new_password) < 8:
        raise HTTPException(status_code=400, detail="Password minimal 8 karakter")

    # Update Password (di-hash ulang)
    user.hashed_password = security.get_password_hash(data.new_password)
    
    try:
        db.commit()
        return {"message": "Password berhasil diperbarui!"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail="Gagal menyimpan perubahan ke database")

# --- FITUR TAMBAHAN: GET ME ---
@router.get("/me", response_model=UserResponse)
def get_me(db: Session = Depends(get_db), token: str = Depends(security.oauth2_scheme)):
    """Endpoint untuk mengambil data profil user yang sedang login"""
    try:
        payload = security.jwt.decode(token, security.SECRET_KEY, algorithms=[security.ALGORITHM])
        email: str = payload.get("sub")
        user = db.query(User).filter(User.email == email).first()
        return user
    except:
        raise HTTPException(status_code=401, detail="Sesi tidak valid")