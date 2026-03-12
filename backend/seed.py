from sqlalchemy.orm import Session
from app.database.session import SessionLocal, engine, Base
from app.models import clinic as models

# Pastikan tabel sudah dibuat
Base.metadata.create_all(bind=engine)

def seed_data():
    db = SessionLocal()
    try:
        # Tambah Dokter 
        if db.query(models.Doctor).count() == 0:
            doctors = [
                models.Doctor(name="dr. Andi Pratama", specialty="Umum", schedule="Senin - Jumat, 08:00 - 14:00"),
                models.Doctor(name="drg. Siti Aminah", specialty="Gigi", schedule="Senin - Rabu, 16:00 - 20:00"),
                models.Doctor(name="dr. Budi Santoso", specialty="Anak", schedule="Kamis - Sabtu, 09:00 - 12:00"),
            ]
            db.add_all(doctors)
            print("✅ Data Dokter berhasil ditambah!")

        # Tambah Layanan
        if db.query(models.Service).count() == 0:
            services = [
                models.Service(name="Konsultasi Umum", description="Pemeriksaan kesehatan rutin", price="Rp 50.000"),
                models.Service(name="Pembersihan Karang Gigi", description="Scaling gigi profesional", price="Rp 200.000"),
                models.Service(name="Vaksinasi Anak", description="Layanan imunisasi lengkap", price="Rp 150.000"),
            ]
            db.add_all(services)
            print("✅ Data Layanan berhasil ditambah!")

        db.commit()
    except Exception as e:
        print(f"❌ Error: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    seed_data()