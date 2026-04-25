import sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from app.database.session import SessionLocal
from app.models import clinic as models

db = SessionLocal()
try:
    # Hapus semua dokter dan layanan yang ada
    db.query(models.Doctor).delete()
    db.query(models.Service).delete()
    
    doctors = [
        models.Doctor(name="drg. Yetti Manalu", specialty="Dokter Gigi", schedules=["Senin - Jumat: 10.00 - 20.00", "Sabtu: 10.00 - 18.00"]),
        models.Doctor(name="drg. Serelady Sitorus", specialty="Dokter Gigi", schedules=["Senin - Jumat: 10.00 - 20.00", "Sabtu: 10.00 - 18.00"]),
        models.Doctor(name="drg. Domdom Panjaitan", specialty="Dokter Gigi", schedules=["Senin - Jumat: 10.00 - 20.00", "Sabtu: 10.00 - 18.00"]),
    ]
    db.add_all(doctors)

    services = [
        models.Service(name="Konsultasi & Pemeriksaan Gigi", description="Pemeriksaan kesehatan gigi dan rongga mulut", price="Rp 100.000"),
        models.Service(name="Scaling (Pembersihan Karang Gigi)", description="Pembersihan karang gigi profesional", price="Rp 250.000"),
        models.Service(name="Pencabutan Gigi", description="Cabut gigi dewasa dan anak", price="Rp 200.000"),
        models.Service(name="Tambal Gigi", description="Penambalan gigi berlubang", price="Rp 200.000")
    ]
    db.add_all(services)
    
    db.commit()
    print("✅ Data Dokter Spesialis NAULI DENTAL CARE berhasil ditambahkan!")
except Exception as e:
    db.rollback()
    print("Error:", e)
finally:
    db.close()
