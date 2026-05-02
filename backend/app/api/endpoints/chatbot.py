import os
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from typing import List, Dict
from pathlib import Path

# Service & Database
from app.services.rag_service import ChatbotService
from app.database.session import get_db
from app.models.clinic import Doctor, Service
from app.core.config import settings

# AI & LangChain
from langchain_cohere import CohereEmbeddings
from langchain_pinecone import PineconeVectorStore
from langchain_community.document_loaders import DirectoryLoader, PyPDFLoader

router = APIRouter()

# --- PENENTUAN PATH ABSOLUT (ANTI GAGAL) ---
# Mengambil lokasi file ini sekarang
current_file = Path(__file__).resolve()
# 1. endpoints -> 2. api -> 3. app -> 4. backend -> 5. clinic-system (ROOT)
ROOT_DIR = current_file.parents[4]
PATH_MATERI = ROOT_DIR / "docs"

print(f"[DEBUG] KLINIK.AI: Folder Docs terdeteksi di: {PATH_MATERI}")

# Inisialisasi service chatbot
chatbot_service = ChatbotService() 

class ChatRequest(BaseModel):
    message: str
    history: List[Dict[str, str]] = [] 

# 1. Endpoint untuk Chat
@router.post("/chat")
async def chat_with_bot(request: ChatRequest):
    try:
        answer = chatbot_service.get_response(request.message, request.history)
        return {"reply": answer}
    except Exception as e:
        print(f"DEBUG ERROR CHAT: {str(e)}")
        raise HTTPException(status_code=500, detail=f"AI Error: {str(e)}")

# 2. Endpoint untuk Sinkronisasi Pengetahuan (Database + Folder Docs)
@router.post("/ingest")
async def sync_chatbot_knowledge(db: Session = Depends(get_db)):
    try:
        # A. Pastikan folder docs ada
        if not PATH_MATERI.exists():
            print(f"[ERROR] Folder {PATH_MATERI} tidak ditemukan!")
            raise HTTPException(status_code=404, detail="Folder 'docs' tidak ditemukan.")

        print("[INFO] Memulai sinkronisasi AI...")
        
        # B. Ambil data dari Database
        doctors = db.query(Doctor).all()
        services = db.query(Service).all()

        # Gunakan nama variabel yang konsisten: knowledge_texts
        knowledge_texts = [ 
            "Klinik Nauli Dental Care berlokasi di Balige, Toba. Jam Operasional: 08:00 - 21:00.",
            "Pendaftaran dapat dilakukan melalui website atau chatbot KlinikAI."
        ]
        
        # PERBAIKAN LOGIKA DOKTER
        for d in doctors:
            jadwal_teks = ""
            # Gunakan d.schedules (jamak) sesuai model terbaru kita
            if d.schedules:
                # Pastikan format data schedules adalah list of dict
                try:
                    jadwal_list = [f"{s['day']} jam {s['time']} di {s['loc']}" for s in d.schedules]
                    jadwal_teks = ", ".join(jadwal_list)
                except:
                    jadwal_teks = str(d.schedules)
            else:
                jadwal_teks = "Jadwal belum diatur"

            info_dokter = f"Dokter {d.name} adalah spesialis {d.specialty}. Jadwal praktik: {jadwal_teks}."
            knowledge_texts.append(info_dokter) # Perbaikan: append ke knowledge_texts

        # PERBAIKAN LOGIKA LAYANAN
        for s in services: 
            info_layanan = f"Layanan {s.name} memiliki biaya estimasi Rp {s.price}. Deskripsi: {s.description}. Detail prosedur: {s.detail_info or ''}"
            knowledge_texts.append(info_layanan) # Perbaikan: append ke knowledge_texts

        # C. Ambil data dari Folder Docs (PDF)
        pdf_docs = []
        try:
            loader = DirectoryLoader(str(PATH_MATERI), glob="**/*.pdf", loader_cls=PyPDFLoader)
            pdf_docs = loader.load()
            print(f"[INFO] Berhasil memuat {len(pdf_docs)} halaman dari file PDF.")
        except Exception as e:
            print(f"[WARN] Gagal membaca beberapa PDF: {str(e)}")

        # D. Setup AI & Upload ke Pinecone
        os.environ["COHERE_API_KEY"] = settings.COHERE_API_KEY
        os.environ["PINECONE_API_KEY"] = settings.PINECONE_API_KEY
        
        embeddings = CohereEmbeddings(model="embed-multilingual-v3.0")
        
        # Ingest teks dari Database (knowledge_texts)
        # Sesuai library terbaru, kita gunakan inisialisasi yang bersih
        vectorstore = PineconeVectorStore.from_texts(
            texts=knowledge_texts,
            embedding=embeddings,
            index_name=settings.PINECONE_INDEX_NAME,
            pinecone_api_key=settings.PINECONE_API_KEY
        )
        
        # Tambahkan data dari PDF jika ada
        if pdf_docs:
            vectorstore.add_documents(pdf_docs)

        return {"message": "Sukses! AI telah mempelajari database dan folder PDF terbaru."}

    except Exception as e:
        print(f"DEBUG ERROR SYNC: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Gagal Sinkron: {str(e)}")
    
# 3. Endpoint untuk List File (DIPERBAIKI)
@router.get("/knowledge-files")
async def list_knowledge_files():
    try:
        files_info = []
        if not PATH_MATERI.exists():
            print(f"[WARN] Folder {PATH_MATERI} tidak ditemukan.")
            return []

        # Mencari semua file PDF di folder docs dan subfoldernya
        for path in PATH_MATERI.rglob("*.pdf"):
            files_info.append({
                "name": path.name,
                "category": path.parent.name if path.parent.name != "docs" else "Utama"
            })
            
        print(f"[INFO] Berhasil mendata {len(files_info)} file PDF.")
        return files_info
    except Exception as e:
        print(f"DEBUG ERROR LIST FILES: {str(e)}")
        return []