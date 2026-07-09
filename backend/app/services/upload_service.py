import os
from datetime import datetime
from pathlib import Path
from uuid import uuid4
from app.services.parser_service import ParserService
from fastapi import UploadFile
from sqlalchemy.orm import Session
from app.core.config import settings
from app.core.constants import DocumentStatus
from app.models.document import Document
from app.models.document_chunk import DocumentChunk
from app.models.user import User
from app.services.graph_extractor import GraphExtractorService


class UploadService:

    @staticmethod
    def upload_document(
        db: Session,
        file: UploadFile,
        document_type: str,
        current_user: User,
    ):

        # Create folder based on year/month
        today = datetime.utcnow()

        folder = Path(
            settings.DOCUMENT_STORAGE
        ) / str(today.year) / f"{today.month:02d}"

        folder.mkdir(parents=True, exist_ok=True)

        # Generate unique filename
        extension = Path(file.filename).suffix

        stored_filename = f"{uuid4()}{extension}"

        file_path = folder / stored_filename

        # Save file
        with open(file_path, "wb") as f:
            f.write(file.file.read())

        # Auto-generate title
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

        # Fetch the persisted chunks and run LLM graph extraction
        chunks = (
            db.query(DocumentChunk)
            .filter(DocumentChunk.document_id == document.id)
            .all()
        )

        GraphExtractorService.extract_and_store(db, document, chunks)

        return document