import bcrypt
from datetime import datetime, timedelta, timezone
from jose import jwt, JWTError
from fastapi import Depends, HTTPException, status # Import digabung di atas
from fastapi.security import OAuth2PasswordBearer
from app.core.config import settings

# KONFIGURASI
SECRET_KEY = settings.SECRET_KEY
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 1440 # Kita kembalikan ke 24 jam agar saat koding sesi tidak cepat habis

# PERBAIKAN #1: Hapus garis miring awal agar Swagger UI tidak bingung
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/v1/auth/login")

# --- FUNGSI HASHING (DIRECT BCRYPT) ---

def get_password_hash(password: str) -> str:
    pwd_bytes = password.encode('utf-8')
    salt = bcrypt.gensalt()
    hashed_password = bcrypt.hashpw(pwd_bytes, salt)
    return hashed_password.decode('utf-8')

def verify_password(plain_password: str, hashed_password: str) -> bool:
    try:
        return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))
    except Exception:
        return False

# --- FUNGSI TOKEN ---

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

# --- DEPENDENCY: ROLE PROTECTION (CLEANER) ---

def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        role: str = payload.get("role")
        if email is None:
            raise HTTPException(status_code=401, detail="Token tidak valid")
        return {"email": email, "role": role}
    except Exception:
        raise HTTPException(status_code=401, detail="Sesi telah berakhir, silakan login ulang")

# Fungsi di bawah ini sekarang lebih bersih tanpa internal import
def require_admin(current_user: dict = Depends(get_current_user)):
    if current_user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Akses ditolak: Hanya admin yang diizinkan")
    return current_user

def require_doctor(current_user: dict = Depends(get_current_user)):
    if current_user.get("role") != "doctor":
        raise HTTPException(status_code=403, detail="Akses ditolak: Hanya dokter yang diizinkan")
    return current_user

def require_nurse(current_user: dict = Depends(get_current_user)):
    if current_user.get("role") != "nurse":
        raise HTTPException(status_code=403, detail="Akses ditolak: Hanya perawat yang diizinkan")
    return current_user

def require_doctor_or_admin(current_user: dict = Depends(get_current_user)):
    if current_user.get("role") not in ["doctor", "admin"]:
        raise HTTPException(status_code=403, detail="Hanya dokter atau admin yang diizinkan")
    return current_user

def require_staff_or_admin(current_user: dict = Depends(get_current_user)):
    if current_user.get("role") not in ["doctor", "nurse", "admin"]:
        raise HTTPException(status_code=403, detail="Hanya staff atau admin yang diizinkan")
    return current_user

require_nurse_or_admin = require_staff_or_admin
require_doctor_or_admin = require_staff_or_admin