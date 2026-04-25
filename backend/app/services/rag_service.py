import os
from langchain_cohere import ChatCohere, CohereEmbeddings
from langchain_pinecone import PineconeVectorStore
from langchain.chains import create_retrieval_chain
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain.chains import create_history_aware_retriever
from langchain_core.messages import HumanMessage, AIMessage
from app.core.config import settings

# Pastikan API Key terpasang
os.environ["COHERE_API_KEY"]   = settings.COHERE_API_KEY
os.environ["PINECONE_API_KEY"] = settings.PINECONE_API_KEY

class ChatbotService:
    def __init__(self):
        try:
            print(f"[INFO] Inisialisasi Chatbot untuk Index: {settings.PINECONE_INDEX_NAME}")
            
            # 1. Setup Database & Model
            self.embeddings = CohereEmbeddings(model="embed-multilingual-v3.0")
            self.vectorstore = PineconeVectorStore(
                index_name=settings.PINECONE_INDEX_NAME,
                embedding=self.embeddings
            )
            self.llm = ChatCohere(model="command-r-plus-08-2024", temperature=0.3)

            # 2. PROMPT: Agar AI Pintar mengolah konteks riwayat chat
            contextualize_q_system_prompt = (
                "Sederhanakan pertanyaan pengguna agar menjadi pertanyaan mandiri "
                "berdasarkan riwayat obrolan yang ada."
            )
            contextualize_q_prompt = ChatPromptTemplate.from_messages([
                ("system", contextualize_q_system_prompt),
                MessagesPlaceholder("chat_history"),
                ("human", "{input}"),
            ])
            
            self.history_aware_retriever = create_history_aware_retriever(
                self.llm, self.vectorstore.as_retriever(search_kwargs={"k": 3}), contextualize_q_prompt
            )

            # 3. PROMPT: Jawaban Utama KlinikAI
            system_prompt = """
            Anda adalah "KlinikAIChatbot", asisten AI resmi Klinik Nauli Dental Care Balige.
            Gunakan konteks berikut untuk menjawab pertanyaan pasien dengan ramah (Sopan khas Toba).
            Jika tidak ada di konteks, arahkan untuk menghubungi admin.
            
            KONTEKS:
            {context}
            """
            
            qa_prompt = ChatPromptTemplate.from_messages([
                ("system", system_prompt),
                MessagesPlaceholder("chat_history"),
                ("human", "{input}"),
            ])

            # 4. Bangun RAG Chain
            question_answer_chain = create_stuff_documents_chain(self.llm, qa_prompt)
            self.rag_chain = create_retrieval_chain(self.history_aware_retriever, question_answer_chain)
            print("[INFO] Chatbot Service Berhasil Dibuat!")
            
        except Exception as e:
            print(f"[ERROR] GAGAL MEMBUAT CHATBOT SERVICE: {str(e)}")

    def get_response(self, query: str, history: list = []):
        try:
            # Konversi history dari Frontend ke LangChain format
            chat_history = []
            for msg in history:
                if msg['role'] == 'user':
                    chat_history.append(HumanMessage(content=msg['content']))
                elif msg['role'] == 'bot':
                    chat_history.append(AIMessage(content=msg['content']))

            # Jalankan AI
            print(f"[CHAT] User bertanya: {query}")
            result = self.rag_chain.invoke({
                "input": query, 
                "chat_history": chat_history
            })
            return result["answer"]
            
        except Exception as e:
            print(f"[ERROR] SAAT MEMPROSES JAWABAN: {str(e)}")
            raise e