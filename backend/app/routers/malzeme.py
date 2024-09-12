from fastapi import FastAPI, HTTPException, Depends, APIRouter, Body
from sqlalchemy.orm import Session, selectinload
import app.db.models as models
from app.deps import get_db
import app.schemas as schemas
from pydantic import UUID4
from typing import List


router = APIRouter()


@router.post("/add/", response_model=schemas.Malzeme)
def create_malzeme(malzeme: schemas.MalzemeCreate, db: Session = Depends(get_db)):
    # check if it exists
    db_malzeme = (
        db.query(models.Malzeme)
        .filter(models.Malzeme.system_id == malzeme.system_id)
        .filter(models.Malzeme.name == malzeme.name)
        .first()
    )
    if db_malzeme:
        raise HTTPException(
            status_code=400, detail="Bu malzeme zaten bu sistemde mevcut"
        )
    # create new malzeme
    db_malzeme = models.Malzeme(**malzeme.dict())
    db.add(db_malzeme)
    db.commit()
    db.refresh(db_malzeme)
    return db_malzeme


@router.delete("/delete/{malzeme_id}", response_model=schemas.Malzeme)
def delete_malzeme(malzeme_id: UUID4, db: Session = Depends(get_db)):
    db_malzeme = (
        db.query(models.Malzeme).filter(models.Malzeme.id == malzeme_id).first()
    )
    if not db_malzeme:
        raise HTTPException(status_code=404, detail="Malzeme bulunamadı")
    db.delete(db_malzeme)
    db.commit()
    return db_malzeme


@router.get("/all/", response_model=List[schemas.Malzeme])
def get_all_systems(db: Session = Depends(get_db)):
    systems = db.query(models.Malzeme).all()
    return systems


@router.get("/get/{id}", response_model=List[schemas.Malzeme])
def get_malzeme_by_system_id(id: UUID4, db: Session = Depends(get_db)):
    malzemeler = db.query(models.Malzeme).filter(models.Malzeme.system_id == id).all()
    if not malzemeler:
        return []
    return malzemeler


@router.get("/get/withoutId/{id}", response_model=List[schemas.Malzeme])
def get_malzeme_by_system_id_without_ids(id: UUID4, db: Session = Depends(get_db)):
    # malzemeler = (
    #     db.query(models.Malzeme)
    #     .options(joinedload(models.Malzeme.type))
    #     .options(joinedload(models.Malzeme.marka))
    #     .options(joinedload(models.Malzeme.model))
    #     .options(joinedload(models.Malzeme.mevzi))
    #     .filter(models.Malzeme.system_id == id)
    #     .all()
    # )

    malzemeler = (
        db.query(models.Malzeme)
        .join(models.Type, models.Malzeme.type_id == models.Type.id, isouter=True)
        .join(models.Marka, models.Malzeme.marka_id == models.Marka.id, isouter=True)
        .join(models.Model, models.Malzeme.mmodel_id == models.Model.id, isouter=True)
        .join(models.Mevzi, models.Malzeme.mevzi_id == models.Mevzi.id, isouter=True)
        .filter(models.Malzeme.system_id == id)
        .options(joinedload(models.Malzeme.type))
        .options(joinedload(models.Malzeme.marka))
        .options(joinedload(models.Malzeme.model))
        .options(joinedload(models.Malzeme.mevzi))
        .all()
    )

    if not malzemeler:
        return []
    result = []
    for malzeme in malzemeler:
        malzeme_data = {
            "id": malzeme.id,
            "name": malzeme.name,
            "description": malzeme.description,
            "seri_num": malzeme.seri_num,
            "depo": malzeme.depo,
            "giris_tarihi": malzeme.giris_tarihi,
            "arizalar": malzeme.arizalar,
            "onarimlar": malzeme.onarimlar,
            "bakimlar": malzeme.bakimlar,
            "system_id": malzeme.system_id,
            "type": malzeme.type.name if malzeme.type else None,
            "marka": malzeme.marka.name if malzeme.marka else None,
            "model": malzeme.model.name if malzeme.model else None,
            "mevzi": malzeme.mevzi.name if malzeme.mevzi else None,
        }
        result.append(malzeme_data)

    return result


@router.put("/{malzeme_id}/ariza", response_model=schemas.MalzemeBase)
def add_ariza(
    malzeme_id: UUID4, ariza: schemas.ArizaCreate, db: Session = Depends(get_db)
):
    malzeme = db.query(models.Malzeme).filter(models.Malzeme.id == malzeme_id).first()

    if not malzeme:
        raise HTTPException(status_code=404, detail="Malzeme mevcut değil")

    # Append the new timestamp to the arizalar list
    if malzeme.arizalar is None:
        malzeme.arizalar = [ariza.ariza_timestamp]
    else:
        malzeme.arizalar.append(ariza.ariza_timestamp)

    db.add(malzeme)
    db.commit()
    db.refresh(malzeme)

    return malzeme


@router.put("/{malzeme_id}/onarim", response_model=schemas.MalzemeBase)
def add_onarim(
    malzeme_id: UUID4, onarim: schemas.OnarimCreate, db: Session = Depends(get_db)
):
    malzeme = db.query(models.Malzeme).filter(models.Malzeme.id == malzeme_id).first()

    if not malzeme:
        raise HTTPException(status_code=404, detail="Malzeme mevcut değil")

    # Append the new timestamp to the onarimlar list
    if malzeme.onarimlar is None:
        malzeme.onarimlar = [onarim.onarim_timestamp]
    else:
        malzeme.onarimlar.append(onarim.onarim_timestamp)

    db.add(malzeme)
    db.commit()
    db.refresh(malzeme)

    return malzeme


@router.put("/{malzeme_id}/bakim", response_model=schemas.MalzemeBase)
def add_bakim(
    malzeme_id: UUID4, bakim: schemas.BakimCreate, db: Session = Depends(get_db)
):
    malzeme = db.query(models.Malzeme).filter(models.Malzeme.id == malzeme_id).first()

    if not malzeme:
        raise HTTPException(status_code=404, detail="Malzeme mevcut değil")

    # Append the new timestamp to the bakimlar list
    if malzeme.bakimlar is None:
        malzeme.bakimlar = [bakim.bakim_timestamp]
    else:
        malzeme.bakimlar.append(bakim.bakim_timestamp)

    db.add(malzeme)
    db.commit()
    db.refresh(malzeme)

    return malzeme


@router.post("/reg-system", response_model=List[schemas.Malzeme])
def update_malzeme_system_id(
    malzeme_ids: List[UUID4] = Body(..., embed=True),  # Expecting a list from body
    system_id: UUID4 = Body(..., embed=True),  # Expecting system_id from body
    db: Session = Depends(get_db),
):
    malzemeler = []

    if len(malzeme_ids) > 0:
        malzemeler = (
            db.query(models.Malzeme).filter(models.Malzeme.id.in_(malzeme_ids)).all()
        )

        if not malzemeler:
            raise HTTPException(
                status_code=404, detail="Bu ID'lere ait malzemeler bulunamadı"
            )

        for malzeme in malzemeler:
            malzeme.system_id = system_id

        db.commit()

    return malzemeler


@router.get("/free/", response_model=List[schemas.Malzeme])
def get_all_free(db: Session = Depends(get_db)):
    malz = db.query(models.Malzeme).filter(models.Malzeme.system_id == None).all()
    if not malz:
        return []
    return malz


@router.put("/update/{malzeme_id}", response_model=schemas.Malzeme)
def update_malzeme(malzeme_id: UUID4, malzeme: schemas.MalzemeCreate, db: Session = Depends(get_db)):
    db_malzeme = db.query(models.Malzeme).filter(models.Malzeme.id == malzeme_id).first()

    if not db_malzeme:
        raise HTTPException(status_code=404, detail="Malzeme bulunamadı")

    # Malzeme bilgilerini güncelle
    for key, value in malzeme.dict().items():
        setattr(db_malzeme, key, value)

    db.commit()
    db.refresh(db_malzeme)
    return db_malzeme