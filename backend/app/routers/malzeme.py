from fastapi import FastAPI, HTTPException, Depends, APIRouter, Body,status, File, UploadFile, Form
from sqlalchemy.orm import Session, selectinload
import app.db.models as models
from app.deps import get_db
import app.schemas as schemas
from pydantic import UUID4
from typing import Dict
from pydantic import BaseModel
from typing import List, Optional
import subprocess
import io
from minio import Minio
from PIL import Image
from .minio_utils import upload_image_to_minio, delete_folder_from_minio, format_bucket_name, move_files_in_minio
import json
from sqlalchemy.orm.attributes import flag_modified
import os  
from dotenv import load_dotenv

load_dotenv()

minio_client = Minio(
    f"{os.getenv('MINIO_CONTAINER_NAME')}:{os.getenv('MINIO_DOCKER_INTERNAL_PORT')}",
    access_key=os.getenv('MINIO_ROOT_USER'),
    secret_key=os.getenv('MINIO_ROOT_PASSWORD'),
    secure=False
)

router = APIRouter()



def ping_ip(ip: str) -> bool:
    try:
        result = subprocess.run(
        ["ping", "-c", "1", "-W", "0.5", ip],
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        )
        return result.returncode == 0 
    except Exception as e:
        return False


@router.post("/add/", response_model=schemas.Malzeme)
async def create_malzeme(
    malzeme: str = Form(...),
    folderNames: Optional[List[str]] = Form(None),
    folderImageCounts: Optional[str] = Form(None), 
    images: Optional[List[UploadFile]] = File(None), 
    db: Session = Depends(get_db)
):
    try:
        malzeme_data = json.loads(malzeme)
        malzeme_create = schemas.MalzemeCreate(**malzeme_data)

        db_malzeme = (
            db.query(models.Malzeme)
            .filter(models.Malzeme.system_id == malzeme_create.system_id)
            .filter(models.Malzeme.name == malzeme_create.name)
            .first()
        )
        if db_malzeme:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Bu malzeme zaten bu sistemde mevcut"
            )
        if malzeme_create.frequency is None or malzeme_create.frequency == "":
            malzeme_create.frequency = 5

        if malzeme_create.ip in ["", "null", "None", None]:
            malzeme_create.ip = None 
            
        db_malzeme = models.Malzeme(
            name=malzeme_create.name,
            description=malzeme_create.description,
            type_id=malzeme_create.type_id,
            marka_id=malzeme_create.marka_id,
            mmodel_id=malzeme_create.mmodel_id,
            seri_num=malzeme_create.seri_num,
            ip=malzeme_create.ip,
            frequency=malzeme_create.frequency,
            system_id=malzeme_create.system_id,
            depo=malzeme_create.depo,
            mevzi_id=malzeme_create.mevzi_id,
            giris_tarihi=malzeme_create.giris_tarihi,
            bakimlar=malzeme_create.bakimlar,
            arizalar=malzeme_create.arizalar,
            onarimlar=malzeme_create.onarimlar,
            state=2 if ping_ip(malzeme_create.ip) else 0
        )
        db.add(db_malzeme)
        db.commit()
        db.refresh(db_malzeme)

        image_urls = []

        if folderImageCounts and folderNames and images:
            folder_image_counts = json.loads(folderImageCounts)
            
            image_index = 0
            for folder_index, folder_name in enumerate(folderNames):
                image_count = folder_image_counts[folder_index]
                folder_images = images[image_index:image_index + image_count]

                for image in folder_images:
                    contents = await image.read() 
                    bucket_name = format_bucket_name(db_malzeme.name)
                    image_url = upload_image_to_minio(bucket_name, folder_name, contents, image.filename)
                    image_urls.append(image_url)

                image_index += image_count

        db_malzeme.photos = image_urls
        db.commit()

        return db_malzeme

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Bir hata oluştu: {str(e)}")


@router.delete("/delete/{malzeme_id}", response_model=schemas.Malzeme)
def delete_malzeme(malzeme_id: UUID4, db: Session = Depends(get_db)):
    db_malzeme = db.query(models.Malzeme).filter(models.Malzeme.id == malzeme_id).first()
    if not db_malzeme:
        raise HTTPException(status_code=404, detail="Malzeme bulunamadı")

    if db_malzeme.photos:
        bucket_name = format_bucket_name(db_malzeme.name)
        for photo_url in db_malzeme.photos:
            photo_name = photo_url.split("/")[-1]
            try:
                minio_client.remove_object(bucket_name, photo_name)
            except Exception as e:
                raise HTTPException(status_code=500, detail=f"Resim silinirken hata oluştu: {str(e)}")

    
    db.delete(db_malzeme)
    db.commit()

    return db_malzeme


@router.get("/all/", response_model=List[schemas.Malzeme])
def get_all_malzeme(db: Session = Depends(get_db)):
    malzemeler = db.query(models.Malzeme).all()
    return malzemeler


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
async def update_malzeme(
    malzeme_id: UUID4, 
    malzeme: Optional[str] = Form(None), 
    folderNames: Optional[List[str]] = Form(None),
    oldFolderNames: Optional[List[str]] = Form(None),
    folderImageCounts: Optional[str] = Form(None), 
    images: Optional[List[UploadFile]] = File(None),
    deletedImagesData: Optional[str] = Form(None),
    db: Session = Depends(get_db)
):
    try:
        db_malzeme = db.query(models.Malzeme).filter(models.Malzeme.id == malzeme_id).first()
        if malzeme:
            updated_malzeme_data = json.loads(malzeme)
            malzeme_update = schemas.MalzemeCreate(**updated_malzeme_data)

            if not db_malzeme:
                raise HTTPException(status_code=404, detail="Malzeme bulunamadı")


            if malzeme_update.frequency is None or malzeme_update.frequency == "":
                malzeme_update.frequency = 5
            
            if malzeme_update.ip in ["", "null", "None", None]:
                malzeme_update.ip = None 

            for field, value in malzeme_update.dict().items():
                if field == "photos" and value is None:
                    continue
                
                setattr(db_malzeme, field, value)

            if malzeme_update.ip is None or malzeme_update.ip == "":
                db_malzeme.state = 1
            else:
                db_malzeme.state = 2 if ping_ip(malzeme_update.ip) else 0

        image_urls = db_malzeme.photos if db_malzeme.photos is not None else []

        folder_image_counts = json.loads(folderImageCounts) if folderImageCounts not in [None, "null", ""] else []
        image_index = 0


        if oldFolderNames and folderNames and len(oldFolderNames) == len(folderNames):
            for index, old_folder_name in enumerate(oldFolderNames):
             
                if old_folder_name != "null" and folderNames[index]:
                    new_folder_name = folderNames[index] 
                    image_urls = [
                    photo.replace(f"/{old_folder_name}/", f"/{new_folder_name}/")
                    for photo in image_urls
                    ]
                   
                    await move_files_in_minio(
                        format_bucket_name(db_malzeme.name),
                        old_folder_name,
                        new_folder_name
                    )


        if folderNames and folder_image_counts:
            for folder_index, folder_name in enumerate(folderNames):
                image_count = folder_image_counts[folder_index]
                folder_images = images[image_index:image_index + image_count] if images else []

                for image in folder_images:
                    contents = await image.read()
                    bucket_name = format_bucket_name(db_malzeme.name)
                    image_url = upload_image_to_minio(bucket_name, folder_name, contents, image.filename)
                    image_urls.append(image_url)

                image_index += image_count

        if deletedImagesData:
            try:
                deleted_images = json.loads(deletedImagesData) 
            except json.JSONDecodeError:
                raise HTTPException(status_code=400, detail="Invalid JSON format for deletedImagesData")

            for folder in deleted_images:
                folder_name = folder.get("folderName")
                deleted_images_list = folder.get("deletedImages")

                if folder_name and deleted_images_list:
                    for image_name in deleted_images_list:
                        file_path = f"{folder_name}/{image_name}"
                        bucket_name = format_bucket_name(db_malzeme.name)

                        try:
                            minio_client.remove_object(bucket_name, file_path)
                        except Exception as e:
                            raise HTTPException(status_code=500, detail=f"Resim silinirken hata oluştu: {str(e)}")
                            
                        image_urls = [photo for photo in image_urls if f"{bucket_name}/{file_path}" not in photo]

        db_malzeme.photos = image_urls
        flag_modified(db_malzeme, "photos")

        db.commit()
        db.refresh(db_malzeme)

        return db_malzeme

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Bir hata oluştu: {str(e)}")


@router.put("/update-ip-frequency/{malzeme_id}", response_model=schemas.Malzeme)
async def update_malzeme_ip_and_frequency(
    malzeme_id: UUID4,
    ip: str = Form(...),  
    frequency:  Optional[float] = Form(None), 
    db: Session = Depends(get_db)
):

    db_malzeme = db.query(models.Malzeme).filter(models.Malzeme.id == malzeme_id).first()
    
    if not db_malzeme:
        raise HTTPException(status_code=404, detail="Malzeme bulunamadı")
    
    db_malzeme.ip = ip if ip not in ["", "null", "None", None] else None
    db_malzeme.frequency = frequency if frequency is not None else 5

    db.commit()
    db.refresh(db_malzeme)

    return db_malzeme

@router.get("/{malzeme_name}/photos", response_model=List[str])
def get_malzeme_photos(malzeme_name: str, db: Session = Depends(get_db)):
    malzeme = db.query(models.Malzeme).filter(models.Malzeme.name == malzeme_name).first()

    if not malzeme:
        raise HTTPException(status_code=404, detail="Malzeme bulunamadı")
    
    if not malzeme.photos:
        raise HTTPException(status_code=404, detail="Malzemeye ait fotoğraf bulunamadı")

    return malzeme.photos


@router.put("/unset-system/{malzeme_id}", response_model=schemas.Malzeme)
async def unset_system_id_for_malzeme(malzeme_id: UUID4, db: Session = Depends(get_db)):
    db_malzeme = db.query(models.Malzeme).filter(models.Malzeme.id == malzeme_id).first()

    if not db_malzeme:
        raise HTTPException(status_code=404, detail="Malzeme bulunamadı")

    db_malzeme.system_id = None
    db_malzeme.ip= None
    db_malzeme.frequency= 5

    db.commit()
    db.refresh(db_malzeme)

    return db_malzeme


@router.get("/get-id-by-name/{name}", response_model=UUID4)
async def get_malzeme_id_by_name(name: str, db: Session = Depends(get_db)):
    malzeme = db.query(models.Malzeme).filter(models.Malzeme.name == name).first()
    if not malzeme:
        raise HTTPException(status_code=404, detail="Malzeme bulunamadı")
    return malzeme.id


@router.get("/malzeme/get/{id}", response_model=schemas.Malzeme)
def get_malzeme_by_id(id: UUID4, db: Session = Depends(get_db)):
    malzeme = db.query(models.Malzeme).filter(models.Malzeme.id == id).first()
    if not malzeme:
        raise HTTPException(status_code=404, detail="Malzeme bulunamadı")
    return malzeme


@router.get("/update-state/{id}", response_model=schemas.Malzeme)
async def update_malzeme_state(
    id: UUID4,
    db: Session = Depends(get_db)
):
    db_malzeme= db.query(models.Malzeme).filter(models.Malzeme.id == id).first()
    if not db_malzeme:
        raise HTTPException(status_code=404, detail="Malzeme bulunamadı")

    if db_malzeme.ip == '':
        db_malzeme.state = 0
    else:
        state = 2 if ping_ip(db_malzeme.ip) else 0
    db_malzeme.state = state
    db.commit()
    db.refresh(db_malzeme)

    return db_malzeme