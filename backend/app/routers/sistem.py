from fastapi import FastAPI, HTTPException, Depends, APIRouter
from sqlalchemy.orm import Session
import app.db.models as models
from app.deps import get_db
import app.schemas as schemas
from pydantic import UUID4
from typing import List


router = APIRouter()


@router.post("/add/", response_model=schemas.Sistem)
def create_sistem(sistem: schemas.SistemCreate, db: Session = Depends(get_db)):
    # check if the namw is unique
    db_sistem = db.query(models.Sistem).filter(models.Sistem.name == sistem.name).first()
    if db_sistem:
        raise HTTPException(status_code=400, detail="Bu isimde bir sistem zaten var")
    db_sistem = models.Sistem(**sistem.dict())
    db.add(db_sistem)
    db.commit()
    db.refresh(db_sistem)
    return db_sistem


@router.delete("/delete/{sistem_id}", response_model=schemas.Sistem)
def delete_sistem(sistem_id: int, db: Session = Depends(get_db)):
    db_sistem = db.query(models.Sistem).filter(models.Sistem.id == sistem_id).first()
    if not db_sistem:
        raise HTTPException(status_code=404, detail="Sistem bulunamadı")
    db.delete(db_sistem)
    db.commit()
    return db_sistem


@router.get("/all/", response_model=List[schemas.Sistem])
def get_all_sistems(db: Session = Depends(get_db)):
    systems = db.query(models.Sistem).all()
    return systems
