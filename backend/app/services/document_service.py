from sqlalchemy.orm import Session
from app.models.document_chunk import DocumentChunk
from app.vectorstore.chroma_client import collection
from app.models.document import Document


class DocumentService:

    @staticmethod
    def get_all_documents(db: Session):

        return (
            db.query(Document)
            .order_by(Document.uploaded_at.desc())
            .all()
        )
    
    @staticmethod
    def delete_document(
        db: Session,
        document_id: int,
    ):

        document = (
            db.query(Document)
            .filter(Document.id == document_id)
            .first()
        )

        if document is None:
            return False

        # Delete vectors from Chroma
        collection.delete(
            where={
                "document_id": document_id
            }
        )

        # Delete chunks
        (
            db.query(DocumentChunk)
            .filter(
                DocumentChunk.document_id == document_id
            )
            .delete()
        )

        # Delete document
        db.delete(document)

        db.commit()

        return True