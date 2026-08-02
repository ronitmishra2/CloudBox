from flask import Blueprint, jsonify, redirect
from flask_jwt_extended import jwt_required, get_jwt_identity

from app import db
from app.models import File, SharedFile
from app.services.minio_service import generate_download_url

share_bp = Blueprint("share", __name__)


@share_bp.route("/<int:file_id>", methods=["POST"])
@jwt_required()
def create_share_link(file_id):

    user_id = int(get_jwt_identity())

    file = File.query.filter_by(
        id=file_id,
        owner_id=user_id
    ).first()

    if not file:
        return jsonify({"error": "File not found."}), 404

    shared = SharedFile(file_id=file.id)

    db.session.add(shared)
    db.session.commit()

    return jsonify({
        "message": "Share link created successfully.",
        "share_url": f"http://127.0.0.1:5000/api/share/{shared.token}"
    }), 201


@share_bp.route("/<string:token>", methods=["GET"])
def access_shared_file(token):

    shared = SharedFile.query.filter_by(token=token).first()

    if not shared:
        return jsonify({
            "error": "Invalid share link."
        }), 404

    file = File.query.get(shared.file_id)

    if not file:
        return jsonify({
            "error": "File no longer exists."
        }), 404

    download_url = generate_download_url(file.object_name)

    from flask import redirect
    return redirect(download_url)