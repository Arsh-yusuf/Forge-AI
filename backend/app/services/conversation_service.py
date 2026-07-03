from sqlalchemy.orm import Session

from app.models.chat_session import ChatSession
from app.models.chat_message import ChatMessage


class ConversationService:

    @staticmethod
    def create_session(db: Session) -> ChatSession:
        session = ChatSession()

        db.add(session)
        db.commit()
        db.refresh(session)

        return session

    @staticmethod
    def add_message(
        db: Session,
        session_id: int,
        role: str,
        content: str,
    ):

        message = ChatMessage(
            session_id=session_id,
            role=role,
            content=content,
        )

        db.add(message)
        db.commit()

    @staticmethod
    def get_history(
        db: Session,
        session_id: int,
        limit: int = 10,
    ):

        messages = (
            db.query(ChatMessage)
            .filter(ChatMessage.session_id == session_id)
            .order_by(ChatMessage.created_at.asc())
            .limit(limit)
            .all()
        )

        return messages