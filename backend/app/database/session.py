import os
from sqlalchemy import create_engine, event
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from app.core.config import settings
from dotenv import load_dotenv

# 1. Pastikan .env dimuat (Tambahan keamanan)
load_dotenv()

# 2. Ambil URL dari settings
db_url = settings.DATABASE_URL

# 3. FIX KRITIS: SQLAlchemy 1.4+ mewajibkan "postgresql://" bukan "postgres://"
# Neon Cloud sering memberikan link yang diawali "postgres://"
if db_url and db_url.startswith("postgres://"):
    db_url = db_url.replace("postgres://", "postgresql://", 1)

# Konfigurasi engine berdasarkan jenis database
if db_url and db_url.startswith("sqlite"):
    engine = create_engine(
        db_url,
        connect_args={
            "check_same_thread": False,
            "timeout": 30,
        },
        pool_pre_ping=True,
        pool_recycle=300,
    )

    @event.listens_for(engine, "connect")
    def set_sqlite_pragma(dbapi_connection, connection_record):
        cursor = dbapi_connection.cursor()
        cursor.execute("PRAGMA journal_mode=WAL")
        cursor.execute("PRAGMA foreign_keys=ON")
        cursor.execute("PRAGMA synchronous=NORMAL")
        cursor.close()
else:
    # PostgreSQL / Neon Cloud
    engine = create_engine(
        db_url,
        pool_pre_ping=True,
        pool_size=5,              # Neon (Free Tier) punya limit koneksi, 5-10 sudah cukup
        max_overflow=2,
        pool_recycle=300,
        pool_timeout=30,
    )

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    except Exception:
        db.rollback() # Rollback otomatis jika ada error saat transaksi
        raise
    finally:
        db.close()