import os
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from typing import List, Dict
from app.services.rag_service import ChatbotService
from app.database.session import get_db
from app.models.clinic import Doctor, Service
from app.core.config import settings
from langchain_cohere import CohereEmbeddings
from langchain_pinecone import PineconeVectorStore
from langchain_community.document_loaders import DirectoryLoader, PyPDFLoader

router = APIRouter()

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
        # A. Ambil data dari Database
        doctors = db.query(Doctor).all()
        services = db.query(Service).all()

        knowledge_base = [ 
            "Klinik Sehat Berlokasi di Jl. Merdeka No. 10, Balige. Jam Operasional: 08:00 - 21:00 (Senin - Jumat).",
            "Pendaftaran dapat dilakukan langsung di website atau melalui chatbot ini.",
            "Untuk informasi Lebih Lanjut, hubungi 0821 63526363 atau email ke info@klinik.com"
        ]
        
        for d in doctors:
            knowledge_base.append(f"Dokter {d.name} adalah spesialis {d.specialty}. Jadwal: {d.schedule}.")
        for s in services: 
            knowledge_base.append(f"Layanan {s.name}: {s.description}. Harga {s.price}.")

        # B. Ambil data dari Folder Docs (PDF)
        path_materi = '../docs'
        all_docs = []
        if os.path.exists(path_materi): 
            # Membaca subfolder klinik_umum dan prosedur_medis
            loader = DirectoryLoader(path_materi, glob="**/*.pdf", loader_cls=PyPDFLoader)
            all_docs = loader.load()

        # C. Proses Penggabungan & Kirim ke Pinecone
        os.environ["COHERE_API_KEY"] = settings.COHERE_API_KEY
        embeddings = CohereEmbeddings(model="embed-multilingual-v3.0")
        
        # Ingest teks dari Database
        vectorstore = PineconeVectorStore.from_texts(
            texts=knowledge_base,
            embedding=embeddings,
            index_name=settings.PINECONE_INDEX_NAME,
            pinecone_api_key=settings.PINECONE_API_KEY
        )
        
        # Ingest teks dari PDF (jika ada)
        if all_docs:
            vectorstore.add_documents(all_docs)

        return {"message": "✅ Sukses! AI telah mempelajari data Database dan folder Docs."}

    except Exception as e:
        print(f"DEBUG ERROR SYNC: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Sync Error: {str(e)}")

# 3. Endpoint untuk List File (DIPISAH, TIDAK BOLEH DI DALAM FUNGSI LAIN)
@router.get("/knowledge-files")
def list_knowledge_files():
    path_materi = '../docs'
    folders = ['klinik_umum', 'prosedur_medis']
    files_info = []

    if not os.path.exists(path_materi):
        return []

    for folder in folders:
        full_path = os.path.join(path_materi, folder)
        if os.path.exists(full_path):
            files = os.listdir(full_path)
            for f in files:
                if f.endswith('.pdf'):
                    files_info.append({"name": f, "category": folder})
    
    return files_info