from fastapi import FastAPI, HTTPException, Depends, APIRouter
from sqlalchemy.orm import Session
import app.db.models as models
from app.deps import get_db
import app.schemas as schemas
from pydantic import UUID4
from typing import List
from fastapi import Query
from typing import Optional


router = APIRouter()


@router.post("/add/", response_model=schemas.AltY)
def create_type(sistem: schemas.AltYCreate, db: Session = Depends(get_db)):
    db_type = models.AltY(**sistem.dict())
    db.add(db_type)
    db.commit()
    db.refresh(db_type)
    return db_type


@router.delete("/delete/{type_id}", response_model=schemas.AltY)
def delete_type(type_id: int, db: Session = Depends(get_db)):
    db_type = db.query(models.AltY).filter(models.AltY.id == type_id).first()
    if not db_type:
        raise HTTPException(status_code=404, detail="Model bulunamadı")
    db.delete(db_type)
    db.commit()
    return db_type


@router.get("/all/", response_model=List[schemas.AltY])
def get_all_type(db: Session = Depends(get_db)):
    types = db.query(models.AltY).all()
    return types


@router.get("/{type_id}", response_model=schemas.AltY)
def get_type(type_id: int, db: Session = Depends(get_db)):
    db_type = db.query(models.AltY).filter(models.AltY.id == type_id).first()
    if not db_type:
        raise HTTPException(status_code=404, detail="Model bulunamadı")
    return db_type


@router.post("/kabin/add/", response_model=schemas.Kabin)
def create_ktype(sistem: schemas.KabinCreate, db: Session = Depends(get_db)):
    db_type = models.Kabin(**sistem.dict())
    db.add(db_type)
    db.commit()
    db.refresh(db_type)
    return db_type


@router.delete("/kabin/delete/{type_id}", response_model=schemas.Kabin)
def delete_ktype(type_id: int, db: Session = Depends(get_db)):
    db_type = db.query(models.Kabin).filter(models.Kabin.id == type_id).first()
    if not db_type:
        raise HTTPException(status_code=404, detail="Model bulunamadı")
    db.delete(db_type)
    db.commit()
    return db_type


@router.get("/kabin/all/", response_model=List[schemas.Kabin])
def get_all_ktype(db: Session = Depends(get_db)):
    types = db.query(models.Kabin).all()
    return types


@router.get("/kabin/{type_id}", response_model=schemas.Kabin)
def get_type(type_id: int, db: Session = Depends(get_db)):
    db_type = db.query(models.Kabin).filter(models.Kabin.id == type_id).first()
    if not db_type:
        raise HTTPException(status_code=404, detail="Model bulunamadı")
    return db_type


@router.post("/iklim/add/", response_model=schemas.Iklim)
def create_itype(sistem: schemas.IklimCreate, db: Session = Depends(get_db)):
    db_type = models.Iklim(**sistem.dict())
    db.add(db_type)
    db.commit()
    db.refresh(db_type)
    return db_type


@router.delete("/iklim/delete/{type_id}", response_model=schemas.Iklim)
def delete_itype(type_id: int, db: Session = Depends(get_db)):
    db_type = db.query(models.Iklim).filter(models.Iklim.id == type_id).first()
    if not db_type:
        raise HTTPException(status_code=404, detail="Model bulunamadı")
    db.delete(db_type)
    db.commit()
    return db_type


@router.get("/iklim/all/", response_model=List[schemas.Iklim])
def get_all_iklim(db: Session = Depends(get_db)):
    types = db.query(models.Iklim).all()
    return types


@router.get("/iklim/{type_id}", response_model=schemas.Iklim)
def get_type(type_id: int, db: Session = Depends(get_db)):
    db_type = db.query(models.Iklim).filter(models.Iklim.id == type_id).first()
    if not db_type:
        raise HTTPException(status_code=404, detail="İklim bulunamadı")
    return db_type


@router.post("/iklim/klima/add/", response_model=schemas.Klima)
def create_sistem(sistem: schemas.KlimaCreate, db: Session = Depends(get_db)):
    # check if the namw is unique
    db_sistem = db.query(models.Klima).filter(models.Klima.name == sistem.name).first()
    if db_sistem:
        raise HTTPException(status_code=400, detail="Bu isimde bir klima zaten var")
    db_sistem = models.Klima(**sistem.dict())
    db.add(db_sistem)
    db.commit()
    db.refresh(db_sistem)
    return db_sistem


@router.delete("/iklim/klima/delete/{sistem_id}", response_model=schemas.Klima)
def delete_sistem(sistem_id: int, db: Session = Depends(get_db)):
    db_sistem = db.query(models.Klima).filter(models.Klima.id == sistem_id).first()
    if not db_sistem:
        raise HTTPException(status_code=404, detail="Klima bulunamadı")
    db.delete(db_sistem)
    db.commit()
    return db_sistem


@router.get("/iklim/klima/all/", response_model=List[schemas.Klima])
def get_all_sistems(db: Session = Depends(get_db)):
    systems = db.query(models.Klima).all()
    return systems


@router.get("/iklim/klima/", response_model=List[schemas.Klima])
def get_klima(ids: Optional[str] = None, db: Session = Depends(get_db)):
    if ids is None or len(ids) == 0:
        return []
    id_list = [int(id) for id in ids.split(",")]
    klima_records = db.query(models.Klima).filter(models.Klima.id.in_(id_list)).all()

    if not klima_records:
        raise HTTPException(status_code=404, detail="Klima bulunamadı")

    return klima_records


@router.post("/haber/add/", response_model=schemas.Haber)
def create_hype(sistem: schemas.HaberCreate, db: Session = Depends(get_db)):
    db_type = models.Haber(**sistem.dict())
    db.add(db_type)
    db.commit()
    db.refresh(db_type)
    return db_type


@router.delete("/haber/delete/{type_id}", response_model=schemas.Haber)
def delete_ihtype(type_id: int, db: Session = Depends(get_db)):
    db_type = db.query(models.Haber).filter(models.Haber.id == type_id).first()
    if not db_type:
        raise HTTPException(status_code=404, detail="Model bulunamadı")
    db.delete(db_type)
    db.commit()
    return db_type


@router.get("/haber/all/", response_model=List[schemas.Haber])
def get_all_haber(db: Session = Depends(get_db)):
    types = db.query(models.Haber).all()
    return types

@router.get("/haber/{type_id}", response_model=schemas.Haber)
def get_type(type_id: int, db: Session = Depends(get_db)):
    db_type = db.query(models.Haber).filter(models.Haber.id == type_id).first()
    if not db_type:
        raise HTTPException(status_code=404, detail="Model bulunamadı")
    return db_type


@router.post("/k_alan/add/", response_model=schemas.KAlan)
def create_halde(sistem: schemas.KAlanCreate, db: Session = Depends(get_db)):
    db_type = models.KAlan(**sistem.dict())
    db.add(db_type)
    db.commit()
    db.refresh(db_type)
    return db_type


@router.delete("/k_alan/delete/{type_id}", response_model=schemas.KAlan)
def delete_ikalanpe(type_id: int, db: Session = Depends(get_db)):
    db_type = db.query(models.KAlan).filter(models.KAlan.id == type_id).first()
    if not db_type:
        raise HTTPException(status_code=404, detail="Model bulunamadı")
    db.delete(db_type)
    db.commit()
    return db_type


@router.get("/k_alan/all/", response_model=List[schemas.KAlan])
def get_all_kalan(db: Session = Depends(get_db)):
    types = db.query(models.KAlan).all()
    return types


@router.get("/k_alan/{type_id}", response_model=schemas.KAlan)
def get_type(type_id: int, db: Session = Depends(get_db)):
    db_type = db.query(models.KAlan).filter(models.KAlan.id == type_id).first()
    if not db_type:
        raise HTTPException(status_code=404, detail="Model bulunamadı")
    return db_type


@router.post("/enerji/guck/add/", response_model=schemas.EnerjiMinor)
def create_sistem(sistem: schemas.EnerjiMinorCreate, db: Session = Depends(get_db)):
    # check if the namw is unique
    db_sistem = db.query(models.GucK).filter(models.GucK.name == sistem.name).first()
    if db_sistem:
        raise HTTPException(status_code=400, detail="Bu isimde bir Güç Kaynağı zaten var")
    db_sistem = models.GucK(**sistem.dict())
    db.add(db_sistem)
    db.commit()
    db.refresh(db_sistem)
    return db_sistem


@router.delete("/enerji/guck/delete/{sistem_id}", response_model=schemas.EnerjiMinor)
def delete_sistem(sistem_id: int, db: Session = Depends(get_db)):
    db_sistem = db.query(models.GucK).filter(models.GucK.id == sistem_id).first()
    if not db_sistem:
        raise HTTPException(status_code=404, detail="Güç Kaynağı bulunamadı")
    db.delete(db_sistem)
    db.commit()
    return db_sistem


@router.get("/enerji/guck/all/", response_model=List[schemas.EnerjiMinor])
def get_all_sistems(db: Session = Depends(get_db)):
    systems = db.query(models.GucK).all()
    return systems


@router.get("/enerji/guck/", response_model=List[schemas.EnerjiMinor])
def get_guck(ids: Optional[str] = None, db: Session = Depends(get_db)):
    if ids is None or len(ids) == 0:
        return []
    id_list = [int(id) for id in ids.split(",")]
    guck_records = db.query(models.GucK).filter(models.GucK.id.in_(id_list)).all()

    if not guck_records:
        raise HTTPException(status_code=404, detail="Güç Kaynağı bulunamadı")

    return guck_records


@router.post("/enerji/regulator/add/", response_model=schemas.EnerjiMinor)
def create_sistem(sistem: schemas.EnerjiMinorCreate, db: Session = Depends(get_db)):
    # check if the namw is unique
    db_sistem = (
        db.query(models.Regulator).filter(models.Regulator.name == sistem.name).first()
    )
    if db_sistem:
        raise HTTPException(status_code=400, detail="Bu isimde bir Regülator zaten var")
    db_sistem = models.Regulator(**sistem.dict())
    db.add(db_sistem)
    db.commit()
    db.refresh(db_sistem)
    return db_sistem


@router.delete(
    "/enerji/regulator/delete/{sistem_id}", response_model=schemas.EnerjiMinor
)
def delete_sistem(sistem_id: int, db: Session = Depends(get_db)):
    db_sistem = (
        db.query(models.Regulator).filter(models.Regulator.id == sistem_id).first()
    )
    if not db_sistem:
        raise HTTPException(status_code=404, detail="Regülatör bulunamadı")
    db.delete(db_sistem)
    db.commit()
    return db_sistem


@router.get("/enerji/regulator/all/", response_model=List[schemas.EnerjiMinor])
def get_all_sistems(db: Session = Depends(get_db)):
    systems = db.query(models.Regulator).all()
    return systems


@router.get("/enerji/regulator/", response_model=List[schemas.EnerjiMinor])
def get_regulator(ids: Optional[str] = None, db: Session = Depends(get_db)):
    if ids is None or len(ids) == 0:
        return []
    id_list = [int(id) for id in ids.split(",")]
    regulator_records = db.query(models.Regulator).filter(models.Regulator.id.in_(id_list)).all()

    if not regulator_records:
        raise HTTPException(status_code=404, detail="Regulator bulunamadı")

    return regulator_records


@router.post("/enerji/jenerator/add/", response_model=schemas.EnerjiMinor)
def create_sistem(sistem: schemas.EnerjiMinorCreate, db: Session = Depends(get_db)):
    # check if the namw is unique
    db_sistem = (
        db.query(models.Regulator).filter(models.Jenerator.name == sistem.name).first()
    )
    if db_sistem:
        raise HTTPException(status_code=400, detail="Bu isimde bir Jeneratör zaten var")
    db_sistem = models.Jenerator(**sistem.dict())
    db.add(db_sistem)
    db.commit()
    db.refresh(db_sistem)
    return db_sistem


@router.delete(
    "/enerji/jenerator/delete/{sistem_id}", response_model=schemas.EnerjiMinor
)
def delete_sistem(sistem_id: int, db: Session = Depends(get_db)):
    db_sistem = (
        db.query(models.Jenerator).filter(models.Jenerator.id == sistem_id).first()
    )
    if not db_sistem:
        raise HTTPException(status_code=404, detail="Jeneratör bulunamadı")
    db.delete(db_sistem)
    db.commit()
    return db_sistem


@router.get("/enerji/jenerator/all/", response_model=List[schemas.EnerjiMinor])
def get_all_sistems(db: Session = Depends(get_db)):
    systems = db.query(models.Jenerator).all()
    return systems


@router.get("/enerji/jenerator/", response_model=List[schemas.EnerjiMinor])
def get_jenerator(ids: Optional[str] = None, db: Session = Depends(get_db)):
    if ids is None or len(ids) == 0:
        return []
    id_list = [int(id) for id in ids.split(",")]
    jenerator_records = db.query(models.Jenerator).filter(models.Jenerator.id.in_(id_list)).all()

    if not jenerator_records:
        raise HTTPException(status_code=404, detail="Jenerator bulunamadı")

    return jenerator_records


@router.post("/enerji/add/", response_model=schemas.Enerji)
def create_halde(sistem: schemas.EnerjiCreate, db: Session = Depends(get_db)):
    db_type = models.Enerji(**sistem.dict())
    db.add(db_type)
    db.commit()
    db.refresh(db_type)
    return db_type


@router.delete("/enerji/delete/{type_id}", response_model=schemas.Enerji)
def delete_ikalanpe(type_id: int, db: Session = Depends(get_db)):
    db_type = db.query(models.Enerji).filter(models.Enerji.id == type_id).first()
    if not db_type:
        raise HTTPException(status_code=404, detail="Model bulunamadı")
    db.delete(db_type)
    db.commit()
    return db_type


@router.get("/enerji/all/", response_model=List[schemas.Enerji])
def get_all_kalan(db: Session = Depends(get_db)):
    types = db.query(models.Enerji).all()
    return types


@router.get("/enerji/{type_id}", response_model=schemas.Enerji)
def get_type(type_id: int, db: Session = Depends(get_db)):
    db_type = db.query(models.Enerji).filter(models.Enerji.id == type_id).first()
    if not db_type:
        raise HTTPException(status_code=404, detail="Model bulunamadı")
    return db_type
