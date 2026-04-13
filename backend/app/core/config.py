from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Clinic Chatbot"
    DATABASE_URL: str = "sqlite:///./clinic.db"
    
    COHERE_API_KEY: str
    PINECONE_API_KEY: str
    PINECONE_INDEX_NAME: str
    SECRET_KEY: str = "CHANGE_THIS_SECRET_KEY_IN_PRODUCTION"
    FRONTEND_URL: str = "http://localhost:3000"
    BACKEND_URL: str = "http://127.0.0.1:8000"

    class Config:
        env_file = ".env"
        # Tambahkan ini agar tidak error jika ada variabel tambahan di .env
        extra = "ignore" 

settings = Settings()