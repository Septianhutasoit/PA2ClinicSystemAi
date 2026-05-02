from sqlalchemy import create_engine, event
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from app.core.config import settings

# Konfigurasi engine berdasarkan jenis database
if settings.DATABASE_URL.startswith("sqlite"):
    engine = create_engine(
        settings.DATABASE_URL,
        connect_args={
            "check_same_thread": False,
            "timeout": 30,        # 30 detik timeout untuk sqlite
        },
        pool_pre_ping=True,       # Cek koneksi sebelum dipakai (cegah stale connections)
        pool_recycle=300,         # Recycle koneksi setiap 5 menit
    )

    # Aktifkan WAL mode dan foreign keys untuk SQLite
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
        settings.DATABASE_URL,
        pool_pre_ping=True,
        pool_size=5,              # Maksimal 5 koneksi
        max_overflow=2,           # Boleh overflow 2 koneksi tambahan
        pool_recycle=300,         # Recycle setiap 5 menit
        pool_timeout=30,          # Timeout 30 detik
    )

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()