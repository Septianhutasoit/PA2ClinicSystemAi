from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database.session import engine, Base

# 1. IMPORT SEMUA MODEL (Penting agar tabel dibuat di Neon)
# Pastikan urutan import model sebelum create_all
from app.models import patient, clinic as clinic_models, appointment, user

# 2. BUAT TABEL OTOMATIS DI DATABASE
# Ini akan membuat tabel di Neon Cloud saat backend dinyalakan
Base.metadata.create_all(bind=engine)

# 3. INISIALISASI FASTAPI (Cukup Sekali Saja!)
app = FastAPI(
    title="Clinic System API",
    description="Sistem Informasi Klinik Gigi Terintegrasi AI",
    version="1.0.0"
)

# 4. SETUP CORS (Solusi Network Error & CORS Missing)
# Menggunakan "*" sangat disarankan saat development lewat IP Network
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 5. IMPORT & REGISTRASI ROUTER
from app.api.endpoints import auth, clinic, chatbot

app.include_router(auth.router, prefix="/api/v1/auth", tags=["Auth"])
app.include_router(clinic.router, prefix="/api/v1/clinic", tags=["Clinic Website"])
app.include_router(chatbot.router, prefix="/api/v1/chatbot", tags=["Chatbot AI"])

# 6. ROOT ENDPOINT
@app.get("/")
def health_check():
    return {
        "status": "online", 
        "database": "connected",
        "message": "Backend Clinic System Aktif"
    }