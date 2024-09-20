from fastapi import FastAPI, HTTPException, Depends, APIRouter, status, File, UploadFile, Form
from sqlalchemy.orm import Session
import app.db.models as models
from app.deps import get_db
import app.schemas as schemas
from pydantic import UUID4
from typing import List, Optional
import io
from minio import Minio
from PIL import Image
from .minio_utils import upload_image_to_minio, delete_folder_from_minio, format_bucket_name, move_files_in_minio
import json
from sqlalchemy.orm.attributes import flag_modified

router = APIRouter()


minio_client = Minio(
    "minio:9000", 
    access_key="user_minio",
    secret_key="password_minio",
    secure=False 
)


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
            description=system_create.description
        )
        db.add(db_system)
        db.commit()
        db.refresh(db_system)

        image_urls = []

        folder_image_counts = json.loads(folderImageCounts)

        image_index = 0
        for folder_index, folder_name in enumerate(folderNames):
    
            image_count = folder_image_counts[folder_index]
            folder_images = images[image_index:image_index + image_count]

            for image in folder_images:
                contents = await image.read()
                print(f"Yüklenecek dosya: {image.filename} (Klasör: {folder_name})")

                bucket_name = format_bucket_name(db_system.name)
                image_url = upload_image_to_minio(bucket_name, folder_name, contents, image.filename)
                image_urls.append(image_url)

            image_index += image_count

        db_system.photos = image_urls
        db.commit()

        return db_system

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
                print(f"Resim silinirken hata oluştu: {str(e)}")

    db.query(models.Malzeme).filter(models.Malzeme.system_id == system_id).update({models.Malzeme.system_id: None})
    
    db.delete(db_system)
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
async def update_system(
    system_id: UUID4, 
    system: str = Form(...), 
    folderNames: Optional[List[str]] = Form(None),
    oldFolderNames: Optional[List[str]] = Form(None),
    folderImageCounts: Optional[str] = Form(None), 
    images: Optional[List[UploadFile]] = File(None),
    deletedImagesData: Optional[str] = Form(None),
    db: Session = Depends(get_db)
):
    try:
        updated_system_data = json.loads(system)
        system_update = schemas.SystemCreate(**updated_system_data)

        db_system = db.query(models.System).filter(models.System.id == system_id).first()

        if not db_system:
            raise HTTPException(status_code=404, detail="Sistem bulunamadı")

        for field, value in system_update.dict().items():
            if field == "photos" and value is None:
                continue
            if value is None:
                continue
            setattr(db_system, field, value)

        image_urls = db_system.photos if db_system.photos is not None else []

        folder_image_counts = json.loads(folderImageCounts) if folderImageCounts not in [None, "null", ""] else []

        image_index = 0

        if oldFolderNames and folderNames and len(oldFolderNames) == len(folderNames):
                for index, old_folder_name in enumerate(oldFolderNames):
             
                    if old_folder_name and folderNames[index]:
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
                    print(f"Yüklenecek dosya: {image.filename} (Klasör: {folder_name})")

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
                            print(f"Silinen dosya: {file_path}")
                        except Exception as e:
                            print(f"Resim silinirken hata oluştu: {str(e)}")

                        # Photos listesinden URL'yi sil
                        image_urls = [photo for photo in image_urls if f"{bucket_name}/{file_path}" not in photo]
                else:
                    print(f"Geçersiz veri: folder_name: {folder_name}, deleted_images_list: {deleted_images_list}")


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
