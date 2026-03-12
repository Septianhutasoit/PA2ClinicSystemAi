from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Clinic Chatbot"
    DATABASE_URL: str = "sqlite:///./clinic.db"
    
    COHERE_API_KEY: str
    PINECONE_API_KEY: str
    PINECONE_INDEX_NAME: str

    class Config:
        env_file = ".env"
        # Tambahkan ini agar tidak error jika ada variabel tambahan di .env
        extra = "ignore" 

settings = Settings()