from datetime import datetime, timedelta, timezone
from jose import jwt
from passlib.context import CryptContext
from fastapi.security import OAuth2PasswordBearer
# from app.core.config import settings # Aktifkan jika sudah ada file config-nya

# --- KONFIGURASI ---
SECRET_KEY = "KLINIK_AI_SECRET_KEY_99" 
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 1440

# --- INI YANG WAJIB ADA (Penyebab error tadi) ---
# Memberitahu FastAPI di mana endpoint login berada
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/v1/auth/login")

# Menggunakan passlib (lebih simpel & standar FastAPI daripada manual bcrypt)
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_password_hash(password: str) -> str:
    """Mengubah password menjadi hash aman"""
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Memverifikasi apakah password cocok dengan hash di DB"""
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict):
    """Membuat token JWT untuk login"""
    to_encode = data.copy()
    # Menggunakan timezone.utc karena utcnow() sudah deprecated di Python terbaru
    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)