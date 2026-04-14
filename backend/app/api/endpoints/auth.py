from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordRequestForm
from pydantic import BaseModel, EmailStr

from app.database.session import get_db
from app.models.user import User
from app.schemas.user import UserCreate, UserResponse, Token
from app.core import security

router = APIRouter()

# Schema untuk Request Reset Password
class ResetPasswordRequest(BaseModel):
    email: EmailStr
    new_password: str

@router.post("/register", response_model=UserResponse)
def register(user_in: UserCreate, db: Session = Depends(get_db)):
    email_lower = user_in.email.lower().strip()
    
    # Cek apakah email sudah ada
    user_exists = db.query(User).filter(User.email == email_lower).first()
    if user_exists:
        raise HTTPException(status_code=400, detail="Email sudah digunakan")
    
    # Buat User Baru
    new_user = User(
        email=email_lower,
        full_name=user_in.full_name,
        hashed_password=security.get_password_hash(user_in.password),
        role="patient"  # <--- Role diatur otomatis di sini
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@router.post("/login", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    email_input = form_data.username.lower().strip()
    
    # Cari User
    user = db.query(User).filter(User.email == email_input).first()
    
    # Validasi User & Password
    if not user or not security.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail="Email atau password salah."
        )
    
    # Buat Token
    access_token = security.create_access_token(
        data={"sub": user.email, "role": user.role}
    )
    
    return {
        "access_token": access_token, 
        "token_type": "bearer",
        "role": user.role
    }

@router.post("/reset-password")
def reset_password(data: ResetPasswordRequest, db: Session = Depends(get_db)):
    # 1. Pastikan email diproses huruf kecil agar sinkron
    email_input = data.email.lower().strip()
    print(f"DEBUG: Mencoba reset password untuk email: {email_input}")

    # 2. Cari user
    user = db.query(User).filter(User.email == email_input).first()
    
    if not user:
        print("DEBUG: User tidak ditemukan di Neon Cloud")
        raise HTTPException(status_code=404, detail="Email tidak terdaftar.")

    # 3. Hash password baru dan update ke kolom hashed_password
    user.hashed_password = security.get_password_hash(data.new_password)
    
    try:
        db.commit() # Simpan ke Neon Cloud
        db.refresh(user)
        print("DEBUG: Password berhasil diperbarui di database!")
        return {"message": "Sandi berhasil diperbarui!"}
    except Exception as e:
        db.rollback()
        print(f"DEBUG ERROR: {str(e)}")
        raise HTTPException(status_code=500, detail="Gagal menyimpan ke database.")

@router.get("/me", response_model=UserResponse)
def get_me(db: Session = Depends(get_db), token: str = Depends(security.oauth2_scheme)):
    try:
        from jose import jwt
        payload = jwt.decode(token, security.SECRET_KEY, algorithms=[security.ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=401, detail="Token tidak valid")
            
        user = db.query(User).filter(User.email == email).first()
        if not user:
            raise HTTPException(status_code=404, detail="User tidak ditemukan")
        return user
    except Exception:
        raise HTTPException(status_code=401, detail="Sesi berakhir, silakan login ulang.")
    
@router.patch("/update-me")
def update_profile(payload: dict, db: Session = Depends(get_db), current_user: User = Depends(get_me)):
    # Update data user yang sedang login
    if "full_name" in payload: current_user.full_name = payload["full_name"]
    if "phone" in payload: current_user.phone = payload["phone"]
    if "address" in payload: current_user.address = payload["address"]
    if "gender" in payload: current_user.gender = payload["gender"]
    
    db.commit()
    return {"message": "Profil berhasil diperbarui!"}