from sqlalchemy.orm import Session

from app.models.document import Document
from app.models.document_chunk import DocumentChunk

from app.parsing.models import ParsedDocument

from app.services.embedding_service import EmbeddingService

from app.utils.text_chunker import TextChunker


class ChunkService:

    @staticmethod
    def create_chunks(
        db: Session,
        document: Document,
        parsed_document: ParsedDocument,
    ):

        # Delete existing chunks if document is reprocessed
        (
            db.query(DocumentChunk)
            .filter(
                DocumentChunk.document_id == document.id
            )
            .delete()
        )

        chunks = TextChunker.split_pages(
            parsed_document
        )

        created_chunks = []

        for chunk in chunks:

            db_chunk = DocumentChunk(

                document_id=document.id,

                chunk_index=chunk["index"],

                chunk_text=chunk["text"],

                start_char=chunk["start"],

                end_char=chunk["end"],

                page_number=chunk["page_number"],

                section_title=chunk["section"],

            )

            db.add(db_chunk)

            created_chunks.append(db_chunk)

        db.commit()

        for chunk in created_chunks:

            db.refresh(chunk)

        # Index into Chroma AFTER IDs exist
        for chunk in created_chunks:

            EmbeddingService.index_chunk(chunk)

        return len(created_chunks)