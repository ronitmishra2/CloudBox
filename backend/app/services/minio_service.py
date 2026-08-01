from minio import Minio
from app.config import Config

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