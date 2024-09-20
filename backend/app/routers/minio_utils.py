from minio import Minio
import io
from PIL import Image
from minio.error import S3Error
import os  
import re
import json
from minio.commonconfig import CopySource
minio_client = Minio(
    "minio:9000", 
    access_key="user_minio",
    secret_key="password_minio",
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
        print(f"Bucket '{bucket_name}' public yapıldı.")
    except S3Error as e:
        print(f"Policy ayarlanırken hata oluştu: {e}")
        raise e


def upload_image_to_minio(bucket_name: str, folder_name: str, image_file: bytes, image_name: str):
    try:
        print(f"Bucket kontrol ediliyor: {bucket_name}")
        found = minio_client.bucket_exists(bucket_name)
        if not found:
            print(f"Bucket oluşturuluyor: {bucket_name}")
            minio_client.make_bucket(bucket_name)
           
            set_bucket_public_policy(bucket_name)

       
        base_image_name = os.path.splitext(image_name)[0]  
        object_name = f"{folder_name}/{base_image_name}.png"  

        print(f"Resim yükleniyor: {object_name}")
        
        # Resim dosyasını PNG formatına dönüştür
        image = Image.open(io.BytesIO(image_file))
        png_image = io.BytesIO()
        image.save(png_image, format="PNG")
        png_image.seek(0)
        
        # Resmi MinIO'ya yükle
        minio_client.put_object(
            bucket_name=bucket_name,
            object_name=object_name,
            data=png_image,
            length=png_image.getbuffer().nbytes,
            content_type="image/png"
        )
        
        print(f"Resim yüklendi: {object_name}")
        return f"http://localhost:9010/{bucket_name}/{object_name}"
    except S3Error as e:
        print(f"MinIO Hatası: {e}")
        raise e


def delete_folder_from_minio(bucket_name: str, folder_name: str):
    objects = minio_client.list_objects(bucket_name, prefix=folder_name, recursive=True)
    for obj in objects:
        try:
            minio_client.remove_object(bucket_name, obj.object_name)
            print(f"Silinen dosya: {obj.object_name}")
        except Exception as e:
            print(f"Dosya silinirken hata oluştu: {str(e)}")



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
        print(f"MinIO Hatası: {e}")
        raise e