from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from app.core.config import settings

# MODIFIKASI: Menambahkan parameter Pooling agar tangguh di Cloud
engine = create_engine(
    settings.DATABASE_URL,
    # 1. pool_pre_ping: Sebelum menjalankan SQL, SQLAlchemy akan mengetes (ping) 
    # apakah Neon sudah bangun. Jika belum, dia akan menyambung ulang otomatis.
    pool_pre_ping=True, 
    
    # 2. pool_recycle: Menutup koneksi setiap 300 detik (5 menit) 
    # agar tidak ada koneksi "basi" yang menyangkut di memori.
    pool_recycle=300,
    
    # 3. pool_size: Membatasi jumlah koneksi aktif (Neon Free Tier punya batas koneksi).
    pool_size=5,
    max_overflow=10
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()