import bcrypt
from datetime import datetime, timedelta
from jose import jwt
from app.core.config import settings

# Ambil SECRET_KEY dari config kamu
SECRET_KEY = "KLINIK_AI_SECRET_KEY_99" 
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 1440

def get_password_hash(password: str) -> str:
    # Mengubah password string menjadi bytes
    pwd_bytes = password.encode('utf-8')
    # Membuat salt dan melakukan hashing
    salt = bcrypt.gensalt()
    hashed_password = bcrypt.hashpw(pwd_bytes, salt)
    # Mengembalikan dalam bentuk string agar bisa disimpan di database
    return hashed_password.decode('utf-8')

def verify_password(plain_password: str, hashed_password: str) -> bool:
    # Memeriksa apakah password cocok
    return bcrypt.checkpw(
        plain_password.encode('utf-8'), 
        hashed_password.encode('utf-8')
    )

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)