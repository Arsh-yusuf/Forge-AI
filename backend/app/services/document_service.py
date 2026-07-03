from sqlalchemy.orm import Session

from app.models.document import Document


class DocumentService:

    @staticmethod
    def get_all_documents(db: Session):

        return (
            db.query(Document)
            .order_by(Document.uploaded_at.desc())
            .all()
        )