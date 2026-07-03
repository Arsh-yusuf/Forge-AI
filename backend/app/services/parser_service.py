from sqlalchemy.orm import Session
from app.services.chunk_service import ChunkService
from app.core.constants import DocumentStatus
from app.models.document import Document
from app.parsing.parser import PDFParser


class ParserService:

    @staticmethod
    def parse_document(
        db: Session,
        document: Document
    ):
        parsed = PDFParser.parse(document.file_path)
        document.extracted_text = parsed.full_text
        document.page_count = parsed.page_count
        document.status = DocumentStatus.PROCESSED
        ChunkService.create_chunks(
            db,
            document
        )

        db.commit()

        db.refresh(document)

        return document