from fastapi import FastAPI, Response # 1. Gabungkan import Response di sini
from fastapi.middleware.cors import CORSMiddleware
from app.database.session import engine, Base

# 1. IMPORT SEMUA MODEL (Penting agar tabel dibuat di Neon)
from app.models import patient, clinic as clinic_models, appointment, user

# 2. BUAT TABEL OTOMATIS DI DATABASE
Base.metadata.create_all(bind=engine)

# 3. INISIALISASI FASTAPI (Satu kali saja)
app = FastAPI(
    title="Clinic System API",
    description="Sistem Informasi Klinik Gigi Terintegrasi AI",
    version="1.0.0"
)

# 4. SOLUSI ERROR 404 FAVICON (Letakkan di sini setelah variabel app dibuat)
@app.get("/favicon.ico", include_in_schema=False)
async def favicon():
    return Response(status_code=204)

# 5. SETUP CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 6. IMPORT & REGISTRASI ROUTER
from app.api.endpoints import auth, clinic, chatbot

app.include_router(auth.router, prefix="/api/v1/auth", tags=["Auth"])
app.include_router(clinic.router, prefix="/api/v1/clinic", tags=["Clinic Website"])
app.include_router(chatbot.router, prefix="/api/v1/chatbot", tags=["Chatbot AI"])

# 7. ROOT ENDPOINT
@app.get("/")
def health_check():
    return {
        "status": "online", 
        "database": "connected",
        "message": "Backend Clinic System Aktif"
    }