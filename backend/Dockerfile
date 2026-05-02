# Gunakan image Python resmi
FROM python:3.11-slim

# Set folder kerja
WORKDIR /app

# Install dependencies sistem untuk PostgreSQL
RUN apt-get update && apt-get install -y libpq-dev gcc && rm -rf /var/lib/apt/lists/*

# Copy requirements dan install library
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy seluruh kode backend
COPY . .

# Jalankan FastAPI
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]