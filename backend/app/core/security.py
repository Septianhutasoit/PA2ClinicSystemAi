import bcrypt
from datetime import datetime, timedelta, timezone
from jose import jwt, JWTError
from fastapi.security import OAuth2PasswordBearer

# --- KONFIGURASI KEAMANAN ---
SECRET_KEY = "KLINIK_AI_SECRET_KEY_99" 
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 1440

# Satpam Token
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/v1/auth/login")

# --- FUNGSI HASHING (MENGGUNAKAN BCRYPT LANGSUNG) ---

def get_password_hash(password: str) -> str:
    """Mengubah teks biasa menjadi hash rahasia (Direct Bcrypt)"""
    # Password harus diubah ke bytes sebelum di-hash
    pwd_bytes = password.encode('utf-8')
    # Generate salt dan buat hash
    salt = bcrypt.gensalt()
    hashed_password = bcrypt.hashpw(pwd_bytes, salt)
    # Kembalikan dalam bentuk string agar bisa masuk ke database Neon
    return hashed_password.decode('utf-8')

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Membandingkan teks biasa dengan hash di database"""
    try:
        # Keduanya harus dalam bentuk bytes untuk dibandingkan
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
    # Menggunakan timezone.utc untuk kompatibilitas Python 3.13
    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)