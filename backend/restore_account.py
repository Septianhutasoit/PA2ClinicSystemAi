import sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from app.database.session import SessionLocal
from app.models.user import User
from app.core.security import get_password_hash

db = SessionLocal()
accounts = [
    {"email": "admin@klinik.ai", "full_name": "Administrator", "password": "admin", "role": "admin"},
    {"email": "amos.baringbing2305@gmail.com", "full_name": "Amos Baringbing", "password": "password123", "role": "patient"}
]
try:
    for acc in accounts:
        if not db.query(User).filter(User.email == acc["email"]).first():
            db.add(User(email=acc["email"], full_name=acc["full_name"], hashed_password=get_password_hash(acc["password"]), role=acc["role"]))
    db.commit()
    print("Akun berhasil direstore!")
except Exception as e:
    print("Error:", e)
finally:
    db.close()
