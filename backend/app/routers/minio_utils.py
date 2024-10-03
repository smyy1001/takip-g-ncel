from minio import Minio
import io
from PIL import Image
from minio.error import S3Error
import os  
import re
import json
from fastapi import HTTPException
from minio.commonconfig import CopySource
from dotenv import load_dotenv

load_dotenv()

minio_host=os.getenv('MINIO_HOST')
minio_port=os.getenv('MINIO_PORT')

minio_client = Minio(
    f"{os.getenv('MINIO_CONTAINER_NAME')}:{os.getenv('MINIO_DOCKER_INTERNAL_PORT')}",
    access_key=os.getenv('MINIO_ROOT_USER'),
    secret_key=os.getenv('MINIO_ROOT_PASSWORD'),
    secure=False
)

def set_bucket_public_policy(bucket_name: str):
    policy = {
        "Version": "2012-10-17",
        "Statement": [{
            "Effect": "Allow",
            "Principal": {"AWS": ["*"]},
            "Action": ["s3:GetObject"],
            "Resource": [f"arn:aws:s3:::{bucket_name}/*"]
        }]
    }


    try:
        minio_client.set_bucket_policy(bucket_name, json.dumps(policy))
    except S3Error as e:
        raise HTTPException(status_code=500, detail=f"Policy ayarlanırken hata oluştu: {str(e)}")


def upload_image_to_minio(bucket_name: str, folder_name: str, image_file: bytes, image_name: str):
    try:
        found = minio_client.bucket_exists(bucket_name)
        if not found:
            minio_client.make_bucket(bucket_name)
           
            set_bucket_public_policy(bucket_name)

       
        base_image_name = os.path.splitext(image_name)[0]  
        object_name = f"{folder_name}/{base_image_name}.png"  
        image = Image.open(io.BytesIO(image_file))
        png_image = io.BytesIO()
        image.save(png_image, format="PNG")
        png_image.seek(0)
        
        minio_client.put_object(
            bucket_name=bucket_name,
            object_name=object_name,
            data=png_image,
            length=png_image.getbuffer().nbytes,
            content_type="image/png"
        )
        
        return f"{minio_host}:{minio_port}/{bucket_name}/{object_name}"
    except S3Error as e:
        raise HTTPException(status_code=500, detail=f"MinIO Hatası: {str(e)}")


def delete_folder_from_minio(bucket_name: str, folder_name: str):
    objects = minio_client.list_objects(bucket_name, prefix=folder_name, recursive=True)
    for obj in objects:
        try:
            minio_client.remove_object(bucket_name, obj.object_name)
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Dosya silinirken hata oluştu: {str(e)}")



def format_bucket_name(bucket_name: str) -> str:
    bucket_name = bucket_name.lower()

    bucket_name = bucket_name.replace(" ", "-").replace("_", "-")

    bucket_name = re.sub(r'[^a-z0-9\-]', '', bucket_name)

    bucket_name = bucket_name.strip('-')

    if len(bucket_name) < 3:
        bucket_name = bucket_name.ljust(3, 'a') 
    elif len(bucket_name) > 63:
        bucket_name = bucket_name[:63] 

    return bucket_name



async def move_files_in_minio(bucket_name: str, old_folder: str, new_folder: str):
    try:
        
        objects = minio_client.list_objects(bucket_name, prefix=old_folder, recursive=True)
        for obj in objects:
            old_object_name = obj.object_name
            new_object_name = old_object_name.replace(old_folder, new_folder, 1)

            copy_source = CopySource(bucket_name, old_object_name)
            
        
            minio_client.copy_object(
                bucket_name,     
                new_object_name,   
                copy_source        
            )

        delete_folder_from_minio(bucket_name, old_folder)
        
    except S3Error as e:
        raise HTTPException(status_code=500, detail=f"MinIO Hatası: {str(e)}")