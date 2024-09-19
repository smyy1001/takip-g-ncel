from fastapi import FastAPI, HTTPException, Depends, APIRouter, UploadFile, File, Form, status
from fastapi.responses import JSONResponse
from sqlalchemy import or_
from sqlalchemy.orm import Session
import app.db.models as models
import io
import os
from app.deps import get_db
import app.schemas as schemas
from pydantic import UUID4
from typing import List,  Optional
from typing import List, Optional
import io
from minio import Minio
from PIL import Image
from .minio_utils import upload_image_to_minio, delete_folder_from_minio, format_bucket_name
import json
from sqlalchemy.orm.attributes import flag_modified

router = APIRouter()

minio_client = Minio(
    "minio:9000",
    access_key="user_minio",
    secret_key="password_minio",
    secure=False
)


@router.post("/add/", response_model=schemas.Mevzi)
async def create_mevzi(
    mevzi: str = Form(...),
    folderNames: Optional[List[str]] = Form(None),
    folderImageCounts: Optional[str] = Form(None), 
    images: Optional[List[UploadFile]] = File(None),  
    db: Session = Depends(get_db)
):
    try:
        mevzi_data = json.loads(mevzi)
        mevzi_create = schemas.MevziCreate(**mevzi_data)

        db_mevzi = db.query(models.Mevzi).filter(models.Mevzi.name == mevzi_create.name).first()
        if db_mevzi:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Bu isimde bir mevzi zaten var")

        db_mevzi = models.Mevzi(
            name=mevzi_create.name,
            isim=mevzi_create.isim,
            yurt_i=mevzi_create.yurt_i,
            lokasyon=mevzi_create.lokasyon,
            kesif_tarihi=mevzi_create.kesif_tarihi,
            kurulum_tarihi=mevzi_create.kurulum_tarihi,
            ulasim=mevzi_create.ulasim,
            kordinat=mevzi_create.kordinat,
            rakim=mevzi_create.rakim,
            bakim_sorumlusu_id=mevzi_create.bakim_sorumlusu_id,
            sube_id=mevzi_create.sube_id,
            d_sistemler=mevzi_create.d_sistemler,
            alt_y_id=mevzi_create.alt_y_id,
            y_sistemler=mevzi_create.y_sistemler,
        )
        db.add(db_mevzi)
        db.commit()
        db.refresh(db_mevzi)

        image_urls = []

        folder_image_counts = json.loads(folderImageCounts) if folderImageCounts else []
        image_index = 0

        if folderNames and folder_image_counts and images:
            for folder_index, folder_name in enumerate(folderNames):
                image_count = folder_image_counts[folder_index]
                folder_images = images[image_index:image_index + image_count]

                for image in folder_images:
                    contents = await image.read()
                    print(f"Yüklenecek dosya: {image.filename} (Klasör: {folder_name})")

                    bucket_name = format_bucket_name(db_mevzi.name)
                    image_url = upload_image_to_minio(bucket_name, folder_name, contents, image.filename)
                    image_urls.append(image_url)

                image_index += image_count

        db_mevzi.photos = image_urls
        db.commit()

        return db_mevzi

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Bir hata oluştu: {str(e)}")



@router.delete("/delete/{mevzi_id}", response_model=schemas.Mevzi)
def delete_mevzi(mevzi_id: UUID4, db: Session = Depends(get_db)):
    db_mevzi = db.query(models.Mevzi).filter(models.Mevzi.id == mevzi_id).first()
    if not db_mevzi:
        raise HTTPException(status_code=404, detail="Mevzi bulunamadı")

    if db_mevzi.photos:
        bucket_name = format_bucket_name(db_mevzi.name)
        for photo_url in db_mevzi.photos:
            photo_name = photo_url.split("/")[-1]
            try:
                minio_client.remove_object(bucket_name, photo_name)
            except Exception as e:
                print(f"Resim silinirken hata oluştu: {str(e)}")

    db.query(models.System).filter(models.System.mevzi_id == mevzi_id).update({models.System.mevzi_id: None})
    db.query(models.Malzeme).filter(models.Malzeme.mevzi_id == mevzi_id).update({models.Malzeme.mevzi_id: None})
    db.query(models.MalzMatch).filter(models.MalzMatch.mevzi_id == mevzi_id).update({models.MalzMatch.mevzi_id: None})

    db.delete(db_mevzi)
    db.commit()

    return db_mevzi





@router.get("/all/", response_model=List[schemas.Mevzi])
def get_all_mevzi(db: Session = Depends(get_db)):
    systems = db.query(models.Mevzi).all()
    return systems

@router.get("/search/{key}", response_model=List[schemas.Mevzi])
def search_mevzi(key: str, db: Session = Depends(get_db)):
    search_query = db.query(models.Mevzi).filter(
        or_(
            models.Mevzi.name.ilike(f'%{key}%'),
            models.Mevzi.isim.ilike(f'%{key}%'),
            models.Mevzi.lokasyon.ilike(f'%{key}%'),
            models.Mevzi.kordinat.ilike(f'%{key}%'),
            models.Mevzi.ulasim.ilike(f'%{key}%')
        )
    ).all()
    return search_query

@router.put("/update/{mevzi_id}", response_model=schemas.Mevzi)
async def update_mevzi(
    mevzi_id: UUID4, 
    mevzi: str = Form(...), 
    folderNames: Optional[List[str]] = Form(None),
    folderImageCounts: Optional[str] = Form(None), 
    images: Optional[List[UploadFile]] = File(None),
    deletedImagesData: Optional[str] = Form(None),
    db: Session = Depends(get_db)
):
    try:
        updated_mevzi_data = json.loads(mevzi)
        mevzi_update = schemas.MevziCreate(**updated_mevzi_data)

        db_mevzi = db.query(models.Mevzi).filter(models.Mevzi.id == mevzi_id).first()

        if not db_mevzi:
            raise HTTPException(status_code=404, detail="Mevzi bulunamadı")

        for key, value in mevzi_update.dict().items():
            if key == "photos" and value is None:
                continue
            if value is None:
                continue
            setattr(db_mevzi, key, value)

        image_urls = db_mevzi.photos if db_mevzi.photos is not None else []

        folder_image_counts = json.loads(folderImageCounts) if folderImageCounts not in [None, "null", ""] else []
        image_index = 0

        if folderNames and folder_image_counts:
            for folder_index, folder_name in enumerate(folderNames):
                image_count = folder_image_counts[folder_index]
                folder_images = images[image_index:image_index + image_count] if images else []

                for image in folder_images:
                    contents = await image.read()
                    print(f"Yüklenecek dosya: {image.filename} (Klasör: {folder_name})")

                    bucket_name = format_bucket_name(db_mevzi.name)
                    image_url = upload_image_to_minio(bucket_name, folder_name, contents, image.filename)
                    image_urls.append(image_url)

                image_index += image_count

        if deletedImagesData:
            try:
                deleted_images = json.loads(deletedImagesData)
            except json.JSONDecodeError:
                raise HTTPException(status_code=400, detail="Geçersiz JSON formatı")

            for folder in deleted_images:
                folder_name = folder.get("folderName")
                deleted_images_list = folder.get("deletedImages")

                if folder_name and deleted_images_list:
                    for image_name in deleted_images_list:
                        file_path = f"{folder_name}/{image_name}"
                        bucket_name = format_bucket_name(db_mevzi.name)

                        try:
                            minio_client.remove_object(bucket_name, file_path)
                            print(f"Silinen dosya: {file_path}")
                        except Exception as e:
                            print(f"Resim silinirken hata oluştu: {str(e)}")

                        image_urls = [photo for photo in image_urls if f"{bucket_name}/{file_path}" not in photo]
                else:
                    print(f"Geçersiz veri: folder_name: {folder_name}, deleted_images_list: {deleted_images_list}")

        db_mevzi.photos = image_urls
        flag_modified(db_mevzi, "photos")

        db.commit()
        db.refresh(db_mevzi)

        return db_mevzi

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Bir hata oluştu: {str(e)}")


@router.get("/{mevzi_name}/photos", response_model=List[str])
def get_mevzi_photos(mevzi_name: str, db: Session = Depends(get_db)):
    mevzi = db.query(models.Mevzi).filter(models.Mevzi.name == mevzi_name).first()

    if not mevzi:
        raise HTTPException(status_code=404, detail="Mevzi bulunamadı")
    
    if not mevzi.photos:
        raise HTTPException(status_code=404, detail="Mevziye ait fotoğraf bulunamadı")

    return mevzi.photos
