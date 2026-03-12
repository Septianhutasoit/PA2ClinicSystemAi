import os
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from typing import List, Dict  # <--- TAMBAHKAN INI
from app.services.rag_service import ChatbotService
from app.database.session import get_db
from app.models.clinic import Doctor, Service
from app.core.config import settings
from langchain_cohere import CohereEmbeddings
from langchain_pinecone import PineconeVectorStore

router = APIRouter()

# Inisialisasi service chatbot
chatbot_service = ChatbotService() 

# --- PERBAIKAN DI SINI ---
class ChatRequest(BaseModel):
    message: str
    # Tambahkan field history agar FastAPI mengenali data riwayat dari frontend
    history: List[Dict[str, str]] = [] 

# ... (import tetap sama) ...

@router.post("/chat")
async def chat_with_bot(request: ChatRequest):
    try:
        # Panggil fungsi dengan parameter query dan history
        answer = chatbot_service.get_response(request.message, request.history)
        return {"reply": answer}
    except Exception as e:
        # TAMPILKAN ERROR DI TERMINAL (PENTING!)
        print("-" * 50)
        print(f"CRITICAL ERROR DI ENDPOINT CHAT: {str(e)}")
        print("-" * 50)
        raise HTTPException(status_code=500, detail=f"AI Error: {str(e)}")

# 2. Endpoint untuk Sinkronisasi Pengetahuan (Tetap)
@router.post("/ingest")
async def sync_chatbot_knowledge(db: Session = Depends(get_db)):
    try:
        doctors = db.query(Doctor).all()
        services = db.query(Service).all()

        knowledge_base = [
            "Klinik Sehat Berlokasi di Jl. Merdeka No. 10. Balige Jam Operasional: 08:00 - 21:00 setiap hari senin sampai jumat.",
            "Pendaftaran dapat dilakukan langsung di website atau melalui chatbot ini.",
            "Pasien diharapkan datang 15 menit sebelum jadwal konsultasi.",
            "Klinik Sehat menyediakan layanan konsultasi online dan offline.",
            "Untuk informasi Lebih Lanjut, silahkan hubungi kami di 0821 63526363 atau email ke info@klinik.com"
        ]
        
        for d in doctors:
            knowledge_base.append(f"Dokter {d.name} adalah spesialis {d.specialty}. Jadwal: {d.schedule}.")
        
        for s in services:
            knowledge_base.append(f"Layanan {s.name}: {s.description}. Harga {s.price}.")

        os.environ["COHERE_API_KEY"] = settings.COHERE_API_KEY
        embeddings = CohereEmbeddings(model="embed-multilingual-v3.0")
        
        PineconeVectorStore.from_texts(
            texts=knowledge_base,
            embedding=embeddings,
            index_name=settings.PINECONE_INDEX_NAME,
            pinecone_api_key=settings.PINECONE_API_KEY
        )

        return {"message": "✅ Sukses! Ingatan AI telah diperbarui menjadi lebih pintar."}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Sync Error: {str(e)}")