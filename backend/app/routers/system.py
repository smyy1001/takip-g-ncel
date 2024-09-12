from fastapi import FastAPI, HTTPException, Depends, APIRouter, status
from sqlalchemy.orm import Session
import app.db.models as models
from app.deps import get_db
import app.schemas as schemas
from pydantic import UUID4
from typing import List


router = APIRouter()


@router.post("/add/", response_model=schemas.System)
def create_system(system: schemas.SystemCreate, db: Session = Depends(get_db)):
    existing_system = db.query(models.System).filter(models.System.name == system.name).first()
    if existing_system:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Bu isimde bir sistem zaten var"
        )
    db_system = models.System(**system.dict())
    db.add(db_system)
    db.commit()
    db.refresh(db_system)
    return db_system


@router.delete("/delete/{system_id}", response_model=schemas.System)
def delete_system(system_id: UUID4, db: Session = Depends(get_db)):
    db_system = db.query(models.System).filter(models.System.id == system_id).first()
    if not db_system:
        raise HTTPException(status_code=404, detail="System bulunamadı")
    db.delete(db_system)
    db.query(models.Malzeme).filter(models.Malzeme.system_id == system_id).delete(synchronize_session=False)
    db.commit()
    return db_system


@router.get("/all/", response_model=List[schemas.System])
def get_all_systems(db: Session = Depends(get_db)):
    systems = db.query(models.System).all()
    return systems


@router.get("/get/{id}", response_model=schemas.System)
def get_system_by_id(id: UUID4, db: Session = Depends(get_db)):
    system = db.query(models.System).filter(models.System.id == id).first()
    if not system:
        raise HTTPException(status_code=404, detail="Sistem bulunamadı")
    return system 

@router.put("/update/{system_id}", response_model=schemas.System)
def update_system(system_id: UUID4, updated_system: schemas.SystemCreate, db: Session = Depends(get_db)):
    db_system = db.query(models.System).filter(models.System.id == system_id).first()
    if not db_system:
        raise HTTPException(status_code=404, detail="Sistem bulunamadı")

    for field, value in updated_system.dict().items():
        setattr(db_system, field, value)

    db.commit()
    db.refresh(db_system)
    return db_system