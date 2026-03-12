import os
from langchain_community.document_loaders import DirectoryLoader, PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_cohere import CohereEmbeddings
from langchain_pinecone import PineconeVectorStore
from app.core.config import settings

# Setup API Keys
os.environ["COHERE_API_KEY"] = settings.COHERE_API_KEY
os.environ["PINECONE_API_KEY"] = settings.PINECONE_API_KEY

def upload_knowledge_multi_folder():
    # 1. PERBAIKAN: Nama folder di gambar kamu adalah 'docs', bukan 'dokumen'
    base_path = '../docs' 
    
    # 2. PERBAIKAN: Pastikan nama sub-folder sama persis dengan di gambar
    sub_folders = ['klinik_umum', 'prosedur_medis']
    
    all_chunks = []
    
    # Inisialisasi Text Splitter
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=500,
        chunk_overlap=100,
        separators=["\n\n", "\n", ". ", " ", ""]
    )

    print(f"🧐 Memulai pemindaian di folder: {os.path.abspath(base_path)}")

    for folder in sub_folders:
        # Menggabungkan path dengan benar
        folder_path = os.path.join(base_path, folder)
        
        if os.path.exists(folder_path):
            print(f"📄 Memproses folder: [{folder}]")
            
            # Loader khusus untuk PDF
            loader = DirectoryLoader(
                folder_path, 
                glob="**/*.pdf", 
                loader_cls=PyPDFLoader
            )
            
            docs = loader.load()
            if docs:
                chunks = text_splitter.split_documents(docs)
                all_chunks.extend(chunks)
                print(f"✅ Berhasil memuat {len(docs)} file PDF dari {folder}")
            else:
                print(f"⚠️ Tidak ada file PDF ditemukan di dalam {folder}")
        else:
            print(f"❌ FOLDER TIDAK DITEMUKAN: {folder_path}")

    if not all_chunks:
        print("❌ Tidak ada data untuk diupload.")
        return

    print(f"✂️ Total potongan teks (chunks): {len(all_chunks)}")

    # Embeddings Cohere v3 (Paling cepat & mendukung Bahasa Indonesia dengan baik)
    embeddings = CohereEmbeddings(model="embed-multilingual-v3.0")

    # Upload ke Pinecone
    print(f"🚀 Sinkronisasi ke Pinecone Index: {settings.PINECONE_INDEX_NAME}...")
    
    PineconeVectorStore.from_documents(
        documents=all_chunks,
        embedding=embeddings,
        index_name=settings.PINECONE_INDEX_NAME,
        pinecone_api_key=settings.PINECONE_API_KEY
    )

    print("\n✨ STATUS: AI SEKARANG LEBIH PINTAR!")
    print(f"AI telah mempelajari data dari {len(sub_folders)} folder secara mendalam.")

if __name__ == "__main__":
    upload_knowledge_multi_folder()