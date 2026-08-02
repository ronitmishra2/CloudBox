import uuid

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

from app import db
from app.models import File

from app.utils.file_utils import format_size

from app.services.minio_service import (
    client,
    bucket_name,
    generate_download_url,
    delete_object
)

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

    search = request.args.get("search")

    query = File.query.filter_by(owner_id=user_id)

    if search:
        query = query.filter(File.filename.ilike(f"%{search}%"))

    files = query.order_by(File.uploaded_at.desc()).all()

    response = []

    for file in files:
        response.append({
            "id": file.id,
            "filename": file.filename,
            "content_type": file.content_type,
            "file_size": file.file_size,
            "uploaded_at": file.uploaded_at
        })

    return jsonify(response), 200


@files_bp.route("/download/<int:file_id>", methods=["GET"])
@jwt_required()
def download_file(file_id):

    user_id = int(get_jwt_identity())

    file = File.query.filter_by(
        id=file_id,
        owner_id=user_id
    ).first()

    if not file:
        return jsonify({
            "error": "File not found."
        }), 404

    download_url = generate_download_url(file.object_name)

    return jsonify({
        "download_url": download_url
    })

@files_bp.route("/<int:file_id>", methods=["DELETE"])
@jwt_required()
def delete_file(file_id):

    user_id = int(get_jwt_identity())

    file = File.query.filter_by(
        id=file_id,
        owner_id=user_id
    ).first()

    if not file:
        return jsonify({
            "error": "File not found."
        }), 404

    # Delete object from MinIO
    delete_object(file.object_name)

    # Delete metadata from PostgreSQL
    db.session.delete(file)
    db.session.commit()

    return jsonify({
        "message": "File deleted successfully."
    }), 200

@files_bp.route("/<int:file_id>", methods=["PATCH"])
@jwt_required()
def rename_file(file_id):

    user_id = int(get_jwt_identity())

    file = File.query.filter_by(
        id=file_id,
        owner_id=user_id
    ).first()

    if not file:
        return jsonify({
            "error": "File not found."
        }), 404

    data = request.get_json()

    new_filename = data.get("filename")

    if not new_filename:
        return jsonify({
            "error": "Filename is required."
        }), 400

    # Update only the display filename
    file.filename = new_filename

    db.session.commit()

    return jsonify({
        "message": "File renamed successfully.",
        "file": {
            "id": file.id,
            "filename": file.filename,
            "content_type": file.content_type,
            "file_size": file.file_size,
            "uploaded_at": file.uploaded_at
        }
    }), 200

@files_bp.route("/stats", methods=["GET"])
@jwt_required()
def file_stats():

    user_id = int(get_jwt_identity())

    files = File.query.filter_by(owner_id=user_id).all()

    total_files = len(files)

    storage_used = sum(file.file_size or 0 for file in files)

    pdf_files = sum(
        1 for file in files
        if file.content_type == "application/pdf"
    )

    image_files = sum(
        1 for file in files
        if file.content_type.startswith("image/")
    )

    text_files = sum(
        1 for file in files
        if file.content_type.startswith("text/")
    )

    return jsonify({
        "total_files": total_files,
        "storage_used_bytes": storage_used,
        "storage_used": format_size(storage_used),
        "pdf_files": pdf_files,
        "image_files": image_files,
        "text_files": text_files
    })