import os, bcrypt
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv
from app.models.user import User # <--- Pastikan path model benar
from app.database.session import Base

load_dotenv()
engine = create_engine(os.getenv("DATABASE_URL"))
SessionLocal = sessionmaker(bind=engine)
db = SessionLocal()

# Buat tabel jika belum ada
Base.metadata.create_all(bind=engine)

email = "admin@klinik.ai"
password = "admin123"
hashed = bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()

# Hapus akun lama (jika ada) agar tidak duplikat
db.query(User).filter(User.email == email).delete()
db.commit()

user_baru = User(
    full_name="Administrator Utama",
    email=email,
    hashed_password=hashed,
    role="admin"
)
db.add(user_baru)
db.commit()
print(f"✅ SUKSES! Akun Neon telah direset.")
print(f"Silakan Login dengan: {email} / {password}")