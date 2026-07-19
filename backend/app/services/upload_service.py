import os
from datetime import datetime
from pathlib import Path
from uuid import uuid4

from PIL import Image

from app.services.parser_service import ParserService
from fastapi import UploadFile
from sqlalchemy.orm import Session
from app.core.config import settings
from app.core.constants import DocumentStatus
from app.models.document import Document
from app.models.document_chunk import DocumentChunk
from app.models.user import User
from app.services.graph_extractor import GraphExtractorService

IMAGE_EXTENSIONS = {".png", ".jpg", ".jpeg"}


class UploadService:

    @staticmethod
    def upload_document(
        db: Session,
        file: UploadFile,
        document_type: str,
        current_user: User,
    ):

        today = datetime.utcnow()

        folder = Path(
            settings.DOCUMENT_STORAGE
        ) / str(today.year) / f"{today.month:02d}"

        folder.mkdir(parents=True, exist_ok=True)

        extension = Path(file.filename).suffix.lower()

        stored_filename = f"{uuid4()}{extension}"

        file_path = folder / stored_filename

        with open(file_path, "wb") as f:
            f.write(file.file.read())

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