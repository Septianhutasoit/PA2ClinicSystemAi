from fastapi import FastAPI, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.database.session import engine, Base
from app.core.config import settings
import os

# 1. IMPORT SEMUA MODEL
from app.models import patient, clinic as clinic_models, appointment, user

# 2. BUAT TABEL OTOMATIS DI DATABASE NEON
Base.metadata.create_all(bind=engine)

# 3. INISIALISASI FASTAPI
app = FastAPI(
    title="Clinic System API",
    description="Sistem Informasi Klinik Gigi Terintegrasi AI",
    version="1.0.0"
)

# 4. PASTIKAN FOLDER 'uploads' ADA
if not os.path.exists("uploads"):
    os.makedirs("uploads")

# 5. MOUNT STATIC FILES
# Agar file di folder 'uploads' punya URL (misal: http://localhost:8000/uploads/foto.jpg)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# 6. SOLUSI ERROR 404 FAVICON
@app.get("/favicon.ico", include_in_schema=False)
async def favicon():
    return Response(status_code=204)

# 7. SETUP CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 8. IMPORT & REGISTRASI ROUTER
from app.api.endpoints import auth, clinic, chatbot

app.include_router(auth.router, prefix="/api/v1/auth", tags=["Auth"])
app.include_router(clinic.router, prefix="/api/v1/clinic", tags=["Clinic Website"])
app.include_router(chatbot.router, prefix="/api/v1/chatbot", tags=["Chatbot AI"])

# 9. ROOT ENDPOINT
@app.get("/")
def health_check():
    return {
        "status": "online", 
        "database": "connected",
        "storage": "uploads_folder_ready",
        "message": "Backend Clinic System Aktif"
    }