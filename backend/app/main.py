from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database.session import engine, Base

# 1. IMPORT SEMUA MODEL (Penting agar tabel dibuat di Neon)
from app.models import patient, clinic as clinic_models, appointment, user

# 2. IMPORT SEMUA ENDPOINT (Routers)
from app.api.endpoints import auth, clinic, chatbot

# 3. BUAT TABEL OTOMATIS DI DATABASE
Base.metadata.create_all(bind=engine)

# 4. INISIALISASI FASTAPI
app = FastAPI(title="Clinic System API")

# 5. SETUP CORS (Agar Frontend Next.js bisa memanggil API)
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 6. REGISTRASI ROUTER
app.include_router(auth.router, prefix="/api/v1/auth", tags=["Auth"])
app.include_router(clinic.router, prefix="/api/v1/clinic", tags=["Clinic Website"])
app.include_router(chatbot.router, prefix="/api/v1/chatbot", tags=["Chatbot AI"])

# 7. ROOT ENDPOINT
@app.get("/")
def health_check():
    return {"status": "ok", "message": "Backend Clinic System Aktif"}