import os
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from typing import List, Dict, Optional
from pathlib import Path
from datetime import datetime

from app.services.rag_service import ChatbotService
from app.database.session import get_db
from app.models.clinic import Doctor, Service, ChatLog
from app.models.appointment import Appointment
from app.core.security import get_current_user
from app.core.config import settings

from langchain_cohere import CohereEmbeddings
from langchain_pinecone import PineconeVectorStore
from langchain_community.document_loaders import DirectoryLoader, PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.schema import Document

router = APIRouter()

# ── Path ke folder docs ──────────────────────────────────────────────────────
current_file = Path(__file__).resolve()
ROOT_DIR     = current_file.parents[4]
PATH_MATERI  = ROOT_DIR / "docs"
print(f"[DEBUG] Folder docs: {PATH_MATERI}")

# Inisialisasi service (singleton)
chatbot_service = ChatbotService()


# ══════════════════════════════════════════════════════════════════════════════
# SCHEMA
# ══════════════════════════════════════════════════════════════════════════════

class ChatRequest(BaseModel):
    message: str
    history: List[Dict[str, str]] = []


class FeedbackRequest(BaseModel):
    user_message: str
    bot_response: str
    feedback: bool
    session_id: str


# ══════════════════════════════════════════════════════════════════════════════
# HELPER — Cocokkan nama dokter yang disebut user
# ══════════════════════════════════════════════════════════════════════════════

def find_doctor_by_name(message: str, db: Session) -> Optional[Doctor]:
    """
    Cek apakah nama dokter disebut di dalam pesan.
    Pencocokan fleksibel — abaikan 'drg.', 'seg.', titik, dan huruf kapital.

    Contoh cocok:
      "ingin bertemu drg. Yetti"   → Doctor(name="drg. Yetti Manalu")
      "tanya serelady"             → Doctor(name="drg. Serelady Sitorus")
    """
    doctors   = db.query(Doctor).all()
    msg_lower = message.lower()

    for doc in doctors:
        # Bersihkan gelar & titik dari nama dokter
        clean_name = (
            doc.name.lower()
            .replace("drg.", "")
            .replace("seg.", "")
            .replace(".", "")
            .strip()
        )
        # Cek setiap kata (minimal 3 huruf) apakah ada di pesan
        for part in clean_name.split():
            if len(part) >= 3 and part in msg_lower:
                print(f"[DOCTOR MATCH] '{part}' cocok dengan '{doc.name}'")
                return doc

    return None


# ══════════════════════════════════════════════════════════════════════════════
# 1. CHAT — Dengan deteksi niat booking
# ══════════════════════════════════════════════════════════════════════════════

# Kata kunci yang menandakan pasien ingin bertemu / booking dokter
BOOKING_KEYWORDS = [
    "ingin bertemu", "mau booking", "mau daftar", "janji temu",
    "konsultasi langsung", "mau periksa", "ingin periksa", "mau ketemu",
    "ingin konsultasi", "mau konsultasi", "periksa langsung",
    "mau berobat", "ingin berobat", "daftar sekarang", "buat janji",
]


@router.post("/chat")
async def chat_with_bot(
    request: ChatRequest,
    db: Session = Depends(get_db),
):
    try:
        # 1. Dapatkan jawaban dari AI
        answer = chatbot_service.get_response(request.message, request.history)

        # 2. Deteksi niat booking dari pesan user
        user_msg_lower = request.message.lower()
        has_booking_intent = any(kw in user_msg_lower for kw in BOOKING_KEYWORDS)

        if has_booking_intent:
            # 3. Cari nama dokter yang disebut (jika ada)
            matched_doctor = find_doctor_by_name(request.message, db)
            doctor_name    = matched_doctor.name if matched_doctor else "Belum Ditentukan"

            # 4. Buat appointment lead dengan status pending
            new_lead = Appointment(
                patient_name     = "User Chatbot",
                patient_phone    = "Chatbot Lead",
                doctor_name      = doctor_name,
                appointment_date = datetime.now(),
                status           = "pending",
                notes            = f"[CHATBOT LEAD] Pasien bertanya: '{request.message[:200]}'",
            )
            db.add(new_lead)
            db.commit()
            print(f"[SYSTEM] Lead baru dibuat → dokter: {doctor_name}")

        return {"reply": answer}

    except Exception as e:
        print(f"[ERROR] /chat: {e}")
        raise HTTPException(
            status_code=500,
            detail="AI sedang sibuk. Coba lagi dalam beberapa detik."
        )


# ══════════════════════════════════════════════════════════════════════════════
# 2. FEEDBACK & HISTORY
# ══════════════════════════════════════════════════════════════════════════════

@router.get("/chat/history")
async def get_chat_history_placeholder():
    """Placeholder agar tidak 404 — history per-user ada di /clinic/chat-history."""
    return []


@router.post("/log-feedback")
async def log_feedback(data: FeedbackRequest, db: Session = Depends(get_db)):
    new_log = ChatLog(
        session_id   = data.session_id,
        user_message = data.user_message,
        bot_response = data.bot_response,
        feedback     = data.feedback,
    )
    db.add(new_log)
    db.commit()
    return {"status": "recorded"}


# ══════════════════════════════════════════════════════════════════════════════
# 3. STATISTIK ADMIN
# ══════════════════════════════════════════════════════════════════════════════

@router.get("/admin/stats")
def get_ai_stats(db: Session = Depends(get_db)):
    likes    = db.query(ChatLog).filter(ChatLog.feedback == True).count()
    dislikes = db.query(ChatLog).filter(ChatLog.feedback == False).count()
    total    = likes + dislikes
    accuracy = round(likes / total * 100, 1) if total > 0 else 0
    return {
        "likes":              likes,
        "dislikes":           dislikes,
        "accuracy":           accuracy,
        "total_interactions": db.query(ChatLog).count(),
    }


@router.get("/admin/history")
def get_ai_history(db: Session = Depends(get_db)):
    return db.query(ChatLog).order_by(ChatLog.created_at.desc()).limit(20).all()


# ══════════════════════════════════════════════════════════════════════════════
# 4. INGEST — SINKRONISASI AI
# ══════════════════════════════════════════════════════════════════════════════

@router.post("/ingest")
async def sync_chatbot_knowledge(db: Session = Depends(get_db)):
    """
    Gabungkan 2 sumber data ke Pinecone:
      A. Teks dari Database (dokter, layanan, info klinik)
      B. PDF dari folder /docs/** (rekursif)
    """
    try:
        os.environ["COHERE_API_KEY"]   = settings.COHERE_API_KEY
        os.environ["PINECONE_API_KEY"] = settings.PINECONE_API_KEY

        embeddings = CohereEmbeddings(model="embed-multilingual-v3.0")

        splitter = RecursiveCharacterTextSplitter(
            chunk_size    = 1500,
            chunk_overlap = 200,
            separators    = ["\n\n", "\n", ". ", " ", ""],
        )

        all_docs: list[Document] = []

        # ── A. Data dari Database ────────────────────────────────────────────
        db_texts = [
            "Klinik Nauli Dental Care berlokasi di Jl. Raja Paindoan No.20A, "
            "Lumban Dolok Haume Bange, Kec. Balige, Toba, Sumatera Utara 22314.",
            "Jam operasional klinik: Senin–Jumat 10:00–20:00, Sabtu 10:00–18:00, Minggu tutup.",
            "Pendaftaran dapat dilakukan melalui website, WhatsApp, atau langsung ke klinik.",
            "Nomor WhatsApp klinik: 0821-6352-6363.",
            "Email klinik: booking@naulidental.com.",
            "Dokter yang tersedia: drg. Yetti Manalu, drg. Serelady Sitorus, "
            "seg. Domdom Panjaitan, Ratna Manalu, Hippu Panjaitan, Yuni Lalisuk, Sanya Panjaitan.",
            "Jadwal praktek semua dokter: Senin–Jumat pukul 10.00–20.00 WIB, "
            "Sabtu pukul 10.00–18.00 WIB.",
        ]

        # Data dokter dari DB
        doctors = db.query(Doctor).all()
        for d in doctors:
            jadwal = "Senin–Jumat 10:00–20:00, Sabtu 10:00–18:00"
            if d.schedules:
                try:
                    jadwal = ", ".join(
                        f"{s['day']} jam {s['time']} di {s.get('loc', 'klinik')}"
                        for s in d.schedules
                    )
                except Exception:
                    jadwal = str(d.schedules)
            db_texts.append(
                f"Dokter {d.name} adalah spesialis {d.specialty}. "
                f"Jadwal praktik: {jadwal}. "
                f"Pengalaman: {d.experience or '-'} tahun. "
                f"Email: {d.email or '-'}."
            )

        # Data layanan dari DB
        services = db.query(Service).all()
        for s in services:
            raw_price = str(s.price).replace(".", "").replace(",", "")
            try:
                price_display = f"{int(raw_price):,}".replace(",", ".")
            except Exception:
                price_display = str(s.price)

            db_texts.append(
                f"Layanan: {s.name}. "
                f"Biaya estimasi: Rp {price_display}. "
                f"Deskripsi: {s.description or '-'}. "
                f"Detail prosedur: {s.detail_info or '-'}."
            )

        db_documents = [
            Document(page_content=t, metadata={"source": "database"})
            for t in db_texts
        ]
        all_docs.extend(splitter.split_documents(db_documents))
        print(f"[INGEST] DB → {len(all_docs)} chunk")

        # ── B. PDF dari folder /docs ─────────────────────────────────────────
        pdf_count = 0
        if PATH_MATERI.exists():
            try:
                loader  = DirectoryLoader(
                    str(PATH_MATERI),
                    glob       = "**/*.pdf",
                    loader_cls = PyPDFLoader,
                    show_progress = True,
                )
                pdf_raw  = loader.load()
                pdf_docs = splitter.split_documents(pdf_raw)
                all_docs.extend(pdf_docs)
                pdf_count = len(pdf_raw)
                print(f"[INGEST] PDF → {pdf_count} halaman → {len(pdf_docs)} chunk")
            except Exception as e:
                print(f"[WARN] Gagal baca PDF: {e}")
        else:
            print(f"[WARN] Folder docs tidak ada: {PATH_MATERI}")

        if not all_docs:
            raise HTTPException(
                status_code = 400,
                detail      = "Tidak ada data untuk di-ingest.",
            )

        # ── C. Upload ke Pinecone ────────────────────────────────────────────
        print(f"[INGEST] Total upload: {len(all_docs)} chunk ke Pinecone...")
        PineconeVectorStore.from_documents(
            documents      = all_docs,
            embedding      = embeddings,
            index_name     = settings.PINECONE_INDEX_NAME,
            pinecone_api_key = settings.PINECONE_API_KEY,
        )

        return {
            "message": (
                f"✅ Sinkronisasi selesai! AI telah mempelajari "
                f"{len(doctors)} dokter, {len(services)} layanan, "
                f"dan {pdf_count} halaman PDF "
                f"({len(all_docs)} chunk total)."
            ),
            "total_chunks": len(all_docs),
            "pdf_pages":    pdf_count,
            "db_entries":   len(doctors) + len(services),
        }

    except HTTPException:
        raise
    except Exception as e:
        print(f"[ERROR] /ingest: {e}")
        raise HTTPException(status_code=500, detail=f"Gagal sinkronisasi: {str(e)}")


# ══════════════════════════════════════════════════════════════════════════════
# 5. LIST FILE PDF
# ══════════════════════════════════════════════════════════════════════════════

@router.get("/knowledge-files")
async def list_knowledge_files():
    try:
        if not PATH_MATERI.exists():
            return []
        return [
            {
                "name":     p.name,
                "category": p.parent.name if p.parent.name != "docs" else "Utama",
                "size_kb":  round(p.stat().st_size / 1024, 1),
            }
            for p in PATH_MATERI.rglob("*.pdf")
        ]
    except Exception as e:
        print(f"[ERROR] /knowledge-files: {e}")
        return []