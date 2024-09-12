from fastapi import FastAPI, HTTPException, Depends, APIRouter
from sqlalchemy.orm import Session
import app.db.models as models
from app.deps import get_db
import app.schemas as schemas
from pydantic import UUID4
from typing import List


router = APIRouter()


@router.post("/add/", response_model=schemas.Unsur)
def create_type(sistem: schemas.UnsurCreate, db: Session = Depends(get_db)):
    db_type = models.Unsur(**sistem.dict())
    db.add(db_type)
    db.commit()
    db.refresh(db_type)
    return db_type


@router.delete("/delete/{type_id}", response_model=schemas.Unsur)
def delete_type(type_id: int, db: Session = Depends(get_db)):
    db_type = db.query(models.Unsur).filter(models.Unsur.id == type_id).first()
    if not db_type:
        raise HTTPException(status_code=404, detail="Unsur bulunamadı")
    db.delete(db_type)
    db.commit()
    return db_type


@router.get("/all/", response_model=List[schemas.Unsur])
def get_all_type(db: Session = Depends(get_db)):
    types = db.query(models.Unsur).all()
    return types