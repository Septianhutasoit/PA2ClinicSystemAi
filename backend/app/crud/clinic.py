from sqlalchemy.orm import Session
from app.models.clinic import Doctor, Service

def get_doctors(db: Session):
    return db.query(Doctor).all()

def get_services(db: Session):
    return db.query(Service).all()