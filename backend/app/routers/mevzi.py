from fastapi import FastAPI, HTTPException, Depends, APIRouter, UploadFile, File, Form
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
import app.db.models as models
import io
import os
from app.deps import get_db
import app.schemas as schemas
from pydantic import UUID4
from typing import List
from minio import Minio
from minio.error import S3Error
from PIL import Image

router = APIRouter()


@router.post("/add/", response_model=schemas.Mevzi)
def create_mevzi(mevzi: schemas.MevziCreate, db: Session = Depends(get_db)):
    db_mevzi = db.query(models.Mevzi).filter(models.Mevzi.name == mevzi.name).first()
    if db_mevzi:
        raise HTTPException(status_code=400, detail="Bu isimde bir mevzi zaten var")
    db_mevzi = models.Mevzi(**mevzi.dict())
    db.add(db_mevzi)
    db.commit()
    db.refresh(db_mevzi)
    return db_mevzi


@router.delete("/delete/{mevzi_id}", response_model=schemas.Mevzi)
def delete_mevzi(mevzi_id: UUID4, db: Session = Depends(get_db)):
    db_mevzi = db.query(models.Mevzi).filter(models.Mevzi.id == mevzi_id).first()
    if not db_mevzi:
        raise HTTPException(status_code=404, detail="Mevzi bulunamadı")
    db.delete(db_mevzi)
    db.commit()
    return db_mevzi


@router.get("/all/", response_model=List[schemas.Mevzi])
def get_all_mevzi(db: Session = Depends(get_db)):
    systems = db.query(models.Mevzi).all()
    return systems


@router.post("/upload/{bucket_name}")
async def upload_files(
    bucket_name: str,
    names: List[str] = Form(...),  # Receive folder names as a list
    files: List[UploadFile] = File(..., alias="files"),  # Receive image files
):
    # Initialize MinIO client
    minio_client = Minio(
        "192.168.1.20:9010",
        access_key="user_minio",
        secret_key="password_minio",
        secure=False,
    )

    # Validate that we have an equal number of names and files
    if len(names) != len(files):
        raise HTTPException(
            status_code=400, detail="The number of names and files must match."
        )

    for name, file in zip(names, files):
        print(f"Received file: {file.filename} for folder: {name}")

        bucket_name = bucket_name
        object_name = f"{name}/{file.filename}"  # Use folder name and file name to construct the object path

        try:
            # Upload the file directly to MinIO
            minio_client.put_object(
                bucket_name=bucket_name,
                object_name=object_name,
                data=file.file,  # Directly pass the file-like object to MinIO
                length=-1,  # Set to -1 to stream data without specifying length
                part_size=10 * 1024 * 1024,  # Define part size if needed
                content_type=file.content_type,
            )
            print(f"Uploaded {file.filename} to {bucket_name}/{object_name}")

        except S3Error as e:
            print(f"Failed to upload {file.filename}: {str(e)}")
            raise HTTPException(status_code=500, detail=f"MinIO error: {str(e)}")
        except Exception as e:
            print(f"Unexpected error: {str(e)}")
            raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")

    return {"message": "Files uploaded successfully"}
