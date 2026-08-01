import uuid

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

from app import db
from app.models import File
from app.services.minio_service import client, bucket_name

files_bp = Blueprint("files", __name__)


@files_bp.route("/upload", methods=["POST"])
@jwt_required()
def upload_file():

    if "file" not in request.files:
        return jsonify({
            "error": "No file uploaded."
        }), 400

    file = request.files["file"]

    # Generate a unique object name
    unique_name = f"{uuid.uuid4()}-{file.filename}"

    # Calculate file size
    file.stream.seek(0, 2)          # Move to end of file
    file_size = file.stream.tell()  # Get file size in bytes
    file.stream.seek(0)             # Reset stream position

    # Upload file to MinIO
    client.put_object(
        bucket_name,
        unique_name,
        file.stream,
        length=file_size,
        content_type=file.content_type
    )

    # Save metadata to PostgreSQL
    file_record = File(
        filename=file.filename,
        object_name=unique_name,
        file_size=file_size,
        content_type=file.content_type,
        owner_id=int(get_jwt_identity())
    )

    db.session.add(file_record)
    db.session.commit()

    return jsonify({
        "message": "File uploaded successfully.",
        "file": {
            "id": file_record.id,
            "filename": file_record.filename,
            "object_name": file_record.object_name,
            "file_size": file_record.file_size,
            "content_type": file_record.content_type,
            "uploaded_at": file_record.uploaded_at
        }
    }), 201

@files_bp.route("/", methods=["GET"])
@jwt_required()
def list_files():

    user_id = int(get_jwt_identity())

    files = File.query.filter_by(owner_id=user_id).all()

    response = []

    for file in files:
        response.append({
            "id": file.id,
            "filename": file.filename,
            "content_type": file.content_type,
            "file_size": file.file_size,
            "uploaded_at": file.uploaded_at
        })

    return jsonify(response)