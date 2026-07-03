from sqlalchemy.orm import Session
from app.services.embedding_service import EmbeddingService
from app.models.document import Document
from app.models.document_chunk import DocumentChunk
from app.utils.text_chunker import TextChunker


class ChunkService:

    @staticmethod
    def create_chunks(
        db: Session,
        document: Document,
    ):

        chunks = TextChunker.split(
            document.extracted_text
        )

        for chunk in chunks:

            db.add(
                DocumentChunk(
                    document_id=document.id,
                    chunk_index=chunk["index"],
                    chunk_text=chunk["text"],
                    start_char=chunk["start"],
                    end_char=chunk["end"],
                )
            )

        db.commit()
        for chunk in db.query(DocumentChunk).filter(
            DocumentChunk.document_id == document.id
        ).all():
            EmbeddingService.index_chunk(chunk)

        return len(chunks)