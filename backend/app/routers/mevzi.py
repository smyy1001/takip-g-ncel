from fastapi import FastAPI, HTTPException, Depends, APIRouter, UploadFile, File, Form, status, Response
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
from .minio_utils import upload_image_to_minio, delete_folder_from_minio, format_bucket_name,  move_files_in_minio
import json
from sqlalchemy.orm.attributes import flag_modified
from openpyxl import Workbook
from io import BytesIO
import os  
from dotenv import load_dotenv
import subprocess

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
        
        if mevzi_create.frequency is None or mevzi_create.frequency == "":
            mevzi_create.frequency = 5

        if mevzi_create.ip in ["", "null", "None", None]:
            mevzi_create.ip = None 

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
            ip=mevzi_create.ip,
            frequency=mevzi_create.frequency,
            state=2 if ping_ip(mevzi_create.ip) else 0
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
                raise HTTPException(status_code=500, detail=f"Resim silinirken hata oluştu: {str(e)}")

    db.query(models.System).filter(models.System.mevzi_id == mevzi_id).update({models.System.depo: 0})
    db.query(models.System).filter(models.System.mevzi_id == mevzi_id).update({models.System.mevzi_id: None})
    db.query(models.Malzeme).filter(models.Malzeme.mevzi_id == mevzi_id).update({models.Malzeme.depo: 0})
    db.query(models.Malzeme).filter(models.Malzeme.mevzi_id == mevzi_id).update({models.Malzeme.mevzi_id: None})
  

    db.delete(db_mevzi)
    db.commit()

    return db_mevzi


@router.get("/all/", response_model=List[schemas.Mevzi])
def get_all_mevzi(db: Session = Depends(get_db)):
    systems = db.query(models.Mevzi).all()
    # for s in systems:
    #     s.state = 2 if ping_ip(s.ip) else 0
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
    mevzi:Optional[str] = Form(None), 
    folderNames: Optional[List[str]] = Form(None),
    oldFolderNames: Optional[List[str]] = Form(None),
    folderImageCounts: Optional[str] = Form(None), 
    images: Optional[List[UploadFile]] = File(None),
    deletedImagesData: Optional[str] = Form(None),
    db: Session = Depends(get_db)
):
    try:

        db_mevzi = db.query(models.Mevzi).filter(models.Mevzi.id == mevzi_id).first()

        if mevzi:
            updated_mevzi_data = json.loads(mevzi)
            mevzi_update = schemas.MevziCreate(**updated_mevzi_data)

            if not db_mevzi:
                raise HTTPException(status_code=404, detail="Mevzi bulunamadı")


            if mevzi_update.frequency is None or mevzi_update.frequency == "":
                mevzi_update.frequency = 5


            if mevzi_update.ip in ["", "null", "None", None]:
                mevzi_update.ip = None 
                
            for key, value in mevzi_update.dict().items():
                if key == "photos" and value is None:
                    continue

                setattr(db_mevzi, key, value)

            if mevzi_update.ip is None or mevzi_update.ip == "":
                db_mevzi.state = 1
            else:
                db_mevzi.state = 2 if ping_ip(mevzi_update.ip) else 0


        image_urls = db_mevzi.photos if db_mevzi.photos is not None else []

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
                        format_bucket_name(db_mevzi.name),
                        old_folder_name,
                        new_folder_name
                    )

        if folderNames and folder_image_counts:
            for folder_index, folder_name in enumerate(folderNames):
                image_count = folder_image_counts[folder_index]
                folder_images = images[image_index:image_index + image_count] if images else []

                for image in folder_images:
                    contents = await image.read()
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
                        except Exception as e:
                            raise HTTPException(status_code=500, detail=f"Resim silinirken hata oluştu: {str(e)}")

                        image_urls = [photo for photo in image_urls if f"{bucket_name}/{file_path}" not in photo]

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


@router.get("/get-id-by-name/{name}", response_model=UUID4)
async def get_mevzi_id_by_name(name: str, db: Session = Depends(get_db)):
    mevzi_ = db.query(models.Mevzi).filter(models.Mevzi.name == name).first()
    if not mevzi_:
        raise HTTPException(status_code=404, detail="Mevzi bulunamadı")
    return mevzi_.id


@router.post("/export/{mevzi_id}", response_class=Response)
async def export_malzeme_by_mevzi(mevzi_id: UUID4, db: Session = Depends(get_db)):
    # Query for Malzeme objects with the provided mevzi_id
    malzeme_list = (
        db.query(models.Malzeme).filter(models.Malzeme.mevzi_id == mevzi_id).all()
    )

    # Create an Excel workbook and sheet
    wb = Workbook()
    ws = wb.active
    ws.title = "Malzeme List"

    # Excel headers
    ws.append(["ID", "Name", "Seri Numarası"])

    # Populate the sheet with Malzeme data if available
    for item in malzeme_list:
        ws.append([str(item.id), item.name, item.seri_num])

    # Save the workbook to a binary stream
    stream = BytesIO()
    wb.save(stream)
    stream.seek(0)

    # Set the response content type and headers for file download
    response = Response(
        stream.read(),
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    )
    response.headers["Content-Disposition"] = (
        f"attachment; filename=malzeme_list_{mevzi_id}.xlsx"
    )

    return response


@router.get("/mevzi/get/{id}", response_model=schemas.Mevzi)
def get_mevzi_by_id(id: UUID4, db: Session = Depends(get_db)):
    mevzi = db.query(models.Mevzi).filter(models.Mevzi.id == id).first()
    if not mevzi:
        raise HTTPException(status_code=404, detail="Mevzi bulunamadı")
    # mevzi.state = 2 if ping_ip(mevzi.ip) else 0
    return mevzi


@router.get("/update-state/{id}", response_model=schemas.Mevzi)
async def update_system_state(
    id: UUID4,
    db: Session = Depends(get_db)
):
    db_system = db.query(models.Mevzi).filter(models.Mevzi.id == id).first()
    if not db_system:
        raise HTTPException(status_code=404, detail="Mevzi bulunamadı")

    if db_system.ip == '':
        db_system.state = 0
    else:
        state = 2 if ping_ip(db_system.ip) else 0
    db_system.state = state
    db.commit()
    db.refresh(db_system)

    return db_system
