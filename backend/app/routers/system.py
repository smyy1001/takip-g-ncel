from fastapi import FastAPI, HTTPException, Depends, APIRouter, status, File, UploadFile, Form
from sqlalchemy.orm import Session
import app.db.models as models
from app.deps import get_db
import app.schemas as schemas
from pydantic import UUID4
from typing import List, Optional
from minio import Minio
from PIL import Image
from .minio_utils import upload_image_to_minio, delete_folder_from_minio, format_bucket_name, move_files_in_minio
import json
from sqlalchemy.orm.attributes import flag_modified
import os  
from dotenv import load_dotenv
import subprocess
import io

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

@router.post("/add/")
async def create_system(
    system: str = Form(...), 
    folderNames: Optional[List[str]] = Form(None),
    folderImageCounts: Optional[str] = Form(None), 
    images: Optional[List[UploadFile]] = File(None),  
    db: Session = Depends(get_db)
):
    try:
        system_data = json.loads(system)
        system_create = schemas.SystemCreate(**system_data)

        existing_system = (
            db.query(models.System)
            .filter(models.System.name == system_create.name)
            .first()
        )
        if existing_system:
            raise HTTPException(
                status_code=400, detail="Bu isimde bir sistem zaten mevcut."
            )

        if system_create.frequency is None or system_create.frequency == "":
            system_create.frequency = 5
            
        if system_create.ip in ["", "null", "None", None]:
            system_create.ip = None 

        db_system = models.System(
            name=system_create.name,
            type_id=system_create.type_id,
            marka_id=system_create.marka_id,
            mmodel_id=system_create.mmodel_id,
            seri_num=system_create.seri_num,
            ilskili_unsur=system_create.ilskili_unsur,
            depo=system_create.depo,
            mevzi_id=system_create.mevzi_id,
            giris_tarihi=system_create.giris_tarihi,
            description=system_create.description,
            ip=system_create.ip,
            frequency=system_create.frequency,
            state=2 if ping_ip(system_create.ip) else 0
        )

        db.add(db_system)
        db.commit()
        db.refresh(db_system)

        image_urls = []

        if folderNames and folderImageCounts:
            try:
                folder_image_counts = json.loads(folderImageCounts)

                image_index = 0

                for folder_index, folder_name in enumerate(folderNames):
                    if folder_index < len(folder_image_counts):
                        image_count = folder_image_counts[folder_index]
                        if images and len(images) > image_index:
                            folder_images = images[
                                image_index : image_index + image_count
                            ]

                            for image in folder_images:
                                contents = await image.read()
                                bucket_name = format_bucket_name(db_system.name)
                                image_url = upload_image_to_minio(
                                    bucket_name, folder_name, contents, image.filename
                                )
                                image_urls.append(image_url)

                            image_index += image_count
            except (json.JSONDecodeError, IndexError) as err:
                raise HTTPException(
                    status_code=400, detail=f"Geçersiz fotoğraf düzeni: {str(err)}"
                )

        db_system.photos = image_urls
        db.commit()

        return schemas.System.from_orm(db_system)

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Bir hata oluştu: {str(e)}")


@router.delete("/delete/{system_id}", response_model=schemas.System)
def delete_system(system_id: UUID4, db: Session = Depends(get_db)):
    db_system = db.query(models.System).filter(models.System.id == system_id).first()
    if not db_system:
        raise HTTPException(status_code=404, detail="System bulunamadı")

    if db_system.photos:
        bucket_name = format_bucket_name(db_system.name)
        for photo_url in db_system.photos:
            photo_name = photo_url.split("/")[-1]
            try:
                minio_client.remove_object(bucket_name, photo_name)
            except Exception as e:
                raise HTTPException(status_code=500, detail=f"Resim silinirken hata oluştu: {str(e)}")

    db.query(models.Malzeme).filter(models.Malzeme.system_id == system_id).update({models.Malzeme.system_id: None})
    
    db.delete(db_system)
    db.commit()

    return db_system


@router.get("/all/", response_model=List[schemas.System])
def get_all_systems(db: Session = Depends(get_db)):
    systems = db.query(models.System).all()
    # for s in systems:
    #     s.state = 2 if ping_ip(s.ip) else 0
    return systems

@router.get("/get/{id}", response_model=schemas.System)
def get_system_by_id(id: UUID4, db: Session = Depends(get_db)):
    system = db.query(models.System).filter(models.System.id == id).first()
    if not system:
        raise HTTPException(status_code=404, detail="Sistem bulunamadı")
    # system.state = 2 if ping_ip(system.ip) else 0
    return system


@router.put("/update/{system_id}", response_model=schemas.System)
async def update_system(
    system_id: UUID4, 
    system: Optional[str] = Form(None), 
    folderNames: Optional[List[str]] = Form(None),
    oldFolderNames: Optional[List[str]] = Form(None),
    folderImageCounts: Optional[str] = Form(None), 
    images: Optional[List[UploadFile]] = File(None),
    deletedImagesData: Optional[str] = Form(None),
    db: Session = Depends(get_db)
):
    try:
        db_system = db.query(models.System).filter(models.System.id == system_id).first()
        if system:
            updated_system_data = json.loads(system) if system else {}
            system_update = schemas.SystemCreate(**updated_system_data)

            if not db_system:
                raise HTTPException(status_code=404, detail="Sistem bulunamadı")

            if system_update.frequency is None or system_update.frequency == "":
                system_update.frequency = 5

            if system_update.ip in ["", "null", "None", None]:
                system_update.ip = None 

            for field, value in system_update.dict().items():
                if field == "photos" and value is None:
                    continue

                setattr(db_system, field, value)

            if system_update.ip is None or system_update.ip == "":
                db_system.state = 1
            else:
                db_system.state = 2 if ping_ip(system_update.ip) else 0

        image_urls = db_system.photos if db_system.photos is not None else []

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
                        format_bucket_name(db_system.name),
                        old_folder_name,
                        new_folder_name
                    )

        if folderNames and folder_image_counts:
            for folder_index, folder_name in enumerate(folderNames):
                image_count = folder_image_counts[folder_index]
                folder_images = images[image_index:image_index + image_count] if images else []

                for image in folder_images:
                    contents = await image.read()
                    bucket_name = format_bucket_name(db_system.name)
                    image_url = upload_image_to_minio(bucket_name, folder_name, contents, image.filename)
                    image_urls.append(image_url)

                image_index += image_count

        if deletedImagesData:
            try:
                deleted_images = json.loads(deletedImagesData)  # Silinmiş resim verisini çözümle
            except json.JSONDecodeError:
                raise HTTPException(status_code=400, detail="Invalid JSON format for deletedImagesData")

            for folder in deleted_images:
                folder_name = folder.get("folderName")  # 'folderName' varsa al, yoksa None
                deleted_images_list = folder.get("deletedImages")  # 'deletedImages' varsa al, yoksa None

                if folder_name and deleted_images_list:
                    for image_name in deleted_images_list:
                        file_path = f"{folder_name}/{image_name}"
                        bucket_name = format_bucket_name(db_system.name)

                        try:
                            minio_client.remove_object(bucket_name, file_path)
                        except Exception as e:
                            raise HTTPException(status_code=500, detail=f"Resim silinirken hata oluştu: {str(e)}")

                        image_urls = [photo for photo in image_urls if f"{bucket_name}/{file_path}" not in photo]

        db_system.photos = image_urls
        flag_modified(db_system, "photos")


        db.commit()
        db.refresh(db_system)

        return db_system

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Bir hata oluştu: {str(e)}")


@router.get("/all/{mevzi_id}", response_model=List[schemas.System])
def get_systems_by_mevzi_id(mevzi_id: UUID4, db: Session = Depends(get_db)):
    systems = db.query(models.System).filter(models.System.mevzi_id == mevzi_id).all()
    return systems


@router.get("/{system_name}/photos", response_model=List[str])
def get_system_photos(system_name: str, db: Session = Depends(get_db)):
    system = db.query(models.System).filter(models.System.name == system_name).first()
    
    if not system:
        raise HTTPException(status_code=404, detail="Sistem bulunamadı")
    
    if not system.photos:
        raise HTTPException(status_code=404, detail="Sisteme ait fotoğraf bulunamadı")
    
    return system.photos


@router.get("/get-id-by-name/{name}", response_model=UUID4)
async def get_system_id_by_name(name: str, db: Session = Depends(get_db)):
    system = db.query(models.System).filter(models.System.name == name).first()
    if not system:
        raise HTTPException(status_code=404, detail="Sistem bulunamadı")
    return system.id


@router.get("/update-state/{id}", response_model=schemas.System)
async def update_system_state(
    id: UUID4,
    db: Session = Depends(get_db)
):
    db_system = db.query(models.System).filter(models.System.id == id).first()
    if not db_system:
        raise HTTPException(status_code=404, detail="Sistem bulunamadı")

    if db_system.ip == '':
        db_system.state = 0
    else:
        state = 2 if ping_ip(db_system.ip) else 0
    db_system.state = state
    db.commit()
    db.refresh(db_system)

    return db_system
