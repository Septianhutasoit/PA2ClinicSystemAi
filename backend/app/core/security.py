import bcrypt
from datetime import datetime, timedelta, timezone
from jose import jwt, JWTError
from fastapi import Depends
from fastapi.security import OAuth2PasswordBearer
from app.core.config import settings

# SECRET_KEY dimuat dari .env via config (bukan hardcoded)
SECRET_KEY = settings.SECRET_KEY
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60  # ✅ KRITIS #5: Dikurangi dari 24 jam → 60 menit

# OAuth2 scheme untuk dependency injection di endpoint yang butuh autentikasi
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")

# --- FUNGSI HASHING (MENGGUNAKAN BCRYPT LANGSUNG) ---

def get_password_hash(password: str) -> str:
    """Mengubah teks biasa menjadi hash rahasia (Direct Bcrypt)"""
    pwd_bytes = password.encode('utf-8')
    salt = bcrypt.gensalt()
    hashed_password = bcrypt.hashpw(pwd_bytes, salt)
    return hashed_password.decode('utf-8')

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Membandingkan teks biasa dengan hash di database"""
    try:
        return bcrypt.checkpw(
            plain_password.encode('utf-8'), 
            hashed_password.encode('utf-8')
        )
    except Exception:
        return False

# --- FUNGSI TOKEN ---

def create_access_token(data: dict):
    """Membuat Token JWT untuk Login"""
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

# --- Dependency: Ambil user dari token ---
def get_current_user(token: str = Depends(oauth2_scheme)):
    """Decode JWT dan kembalikan payload user (email + role)"""
    from fastapi import HTTPException, status
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        role: str = payload.get("role")
        if email is None:
            raise HTTPException(status_code=401, detail="Token tidak valid")
        return {"email": email, "role": role}
    except Exception:
        raise HTTPException(status_code=401, detail="Sesi telah berakhir, silakan login ulang")

# --- Dependency: Hanya Admin yang boleh akses ---
def require_admin(current_user: dict = Depends(get_current_user)):
    """Pastikan user yang login adalah admin"""
    from fastapi import HTTPException
    if current_user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Akses ditolak: Hanya admin yang diizinkan")
    return current_user