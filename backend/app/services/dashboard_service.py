from sqlalchemy.orm import Session
from sqlalchemy import func

from app.models.document import Document
from app.models.document_chunk import DocumentChunk
from app.models.chat_session import ChatSession
from app.models.chat_message import ChatMessage


class DashboardService:

    @staticmethod
    def get_stats(db: Session):

        documents = db.query(Document).count()

        chunks = db.query(DocumentChunk).count()

        chat_sessions = db.query(ChatSession).count()

        questions = (
            db.query(ChatMessage)
            .filter(ChatMessage.role == "user")
            .count()
        )

        return {
            "documents": documents,
            "chunks": chunks,
            "chat_sessions": chat_sessions,
            "questions": questions,
        }