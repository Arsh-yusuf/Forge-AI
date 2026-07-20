import os
from datetime import datetime
from pathlib import Path
from uuid import uuid4

from PIL import Image
from fastapi import HTTPException, UploadFile
from sqlalchemy.orm import Session

from app.services.parser_service import ParserService
from app.core.config import settings
from app.core.constants import DocumentStatus
from app.models.document import Document
from app.models.document_chunk import DocumentChunk
from app.models.user import User
from app.services.graph_extractor import GraphExtractorService

IMAGE_EXTENSIONS = {".png", ".jpg", ".jpeg"}

# Upload validation constants
MAX_FILE_SIZE = 50 * 1024 * 1024  # 50 MB
ALLOWED_MIME_TYPES = {
    "application/pdf",
    "image/png",
    "image/jpeg",
}
ALLOWED_EXTENSIONS = {".pdf", ".png", ".jpg", ".jpeg"}


class UploadService:

    @staticmethod
    def upload_document(
        db: Session,
        file: UploadFile,
        document_type: str,
        current_user: User,
    ):

        # ---- Validation ----
        if not file.filename:
            raise HTTPException(status_code=400, detail="No filename provided")

        extension = Path(file.filename).suffix.lower()
        if extension not in ALLOWED_EXTENSIONS:
            raise HTTPException(
                status_code=400,
                detail=f"File type '{extension}' not allowed. Allowed: {', '.join(sorted(ALLOWED_EXTENSIONS))}",
            )

        if file.content_type not in ALLOWED_MIME_TYPES:
            raise HTTPException(
                status_code=400,
                detail=f"MIME type '{file.content_type}' not allowed. Allowed: {', '.join(sorted(ALLOWED_MIME_TYPES))}",
            )

        # Read file content once, validate size
        content = file.file.read()
        if len(content) > MAX_FILE_SIZE:
            raise HTTPException(
                status_code=400,
                detail=f"File size {len(content)} bytes exceeds maximum {MAX_FILE_SIZE} bytes ({MAX_FILE_SIZE // (1024*1024)} MB)",
            )

        # Reset file pointer for downstream processing
        file.file.seek(0)

        today = datetime.utcnow()

        folder = Path(
            settings.DOCUMENT_STORAGE
        ) / str(today.year) / f"{today.month:02d}"

        folder.mkdir(parents=True, exist_ok=True)

        stored_filename = f"{uuid4()}{extension}"

        file_path = folder / stored_filename

        with open(file_path, "wb") as f:
            f.write(content)

        # Convert image uploads to PDF for downstream parsing
        if extension in IMAGE_EXTENSIONS:
            img = Image.open(file_path)
            img = img.convert("RGB")
            pdf_path = file_path.with_suffix(".pdf")
            img.save(pdf_path, "PDF", resolution=300)
            # Remove original image and update references
            os.remove(file_path)
            file_path = pdf_path
            stored_filename = pdf_path.name

        title = Path(file.filename).stem.replace("_", " ").title()

        document = Document(
            title=title,
            document_type=document_type,
            original_filename=file.filename,
            stored_filename=stored_filename,
            file_path=str(file_path),
            uploaded_by=current_user.id,
            status=DocumentStatus.UPLOADED,
        )

        db.add(document)
        db.commit()
        db.refresh(document)

        document = ParserService.parse_document(
            db,
            document
        )

        chunks = (
            db.query(DocumentChunk)
            .filter(DocumentChunk.document_id == document.id)
            .all()
        )

        GraphExtractorService.extract_and_store(db, document, chunks)

        return document