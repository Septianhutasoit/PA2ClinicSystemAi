"""
Script untuk membuat akun Dokter dan Perawat di database.
Jalankan dari folder backend: python create_staff.py
"""
import sys
import os

# Pastikan path app bisa diimport
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.database.session import SessionLocal, engine, Base
from app.models.user import User
from app.core.security import get_password_hash

# Buat tabel kalau belum ada
Base.metadata.create_all(bind=engine)

db = SessionLocal()

accounts = [
    {
        "email": "dokter@klinik.ai",
        "full_name": "dr. Pratama Wijaya",
        "password": "dokter1234",
        "role": "doctor"
    },
    {
        "email": "perawat@klinik.ai",
        "full_name": "Suster Siti Aminah",
        "password": "perawat1234",
        "role": "nurse"
    }
]

created = []
skipped = []

for acc in accounts:
    existing = db.query(User).filter(User.email == acc["email"]).first()
    if existing:
        skipped.append(acc["email"])
    else:
        new_user = User(
            email=acc["email"],
            full_name=acc["full_name"],
            hashed_password=get_password_hash(acc["password"]),
            role=acc["role"]
        )
        db.add(new_user)
        created.append(acc["email"])

try:
    db.commit()
    print("\n=== HASIL ===")
    for email in created:
        print(f"[BERHASIL DIBUAT] {email}")
    for email in skipped:
        print(f"[SUDAH ADA / SKIP] {email}")
    print("\nSelesai!")
except Exception as e:
    db.rollback()
    print(f"[ERROR] {e}")
finally:
    db.close()
