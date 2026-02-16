from fastapi import Depends
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from typing import Annotated
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parents[1]
DB_PATH = BASE_DIR / "data" / "students.db"

engine = create_engine(f'sqlite:///{DB_PATH}')

SessionLocal = sessionmaker(bind=engine)

def get_db():
    db = SessionLocal()
    try :
        yield db
    finally:
        db.close()

db_dependency = Annotated[Session, Depends(get_db)]