from minio import Minio
from app.config import Config
from datetime import timedelta

client = Minio(
    Config.MINIO_ENDPOINT,
    access_key=Config.MINIO_ACCESS_KEY,
    secret_key=Config.MINIO_SECRET_KEY,
    secure=False
)

bucket_name = Config.MINIO_BUCKET


def create_bucket():
    if not client.bucket_exists(bucket_name):
        client.make_bucket(bucket_name)


create_bucket()

def generate_download_url(object_name):
    return client.presigned_get_object(
        bucket_name,
        object_name,
        expires=timedelta(minutes=15)
    )

def delete_object(object_name):
    client.remove_object(bucket_name, object_name)