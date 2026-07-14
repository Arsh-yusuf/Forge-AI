from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, Text, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base


class ChatMessage(Base):
    __tablename__ = "chat_messages"

    id: Mapped[int] = mapped_column(primary_key=True)

    session_id: Mapped[int] = mapped_column(
        ForeignKey("chat_sessions.id")
    )

    role: Mapped[str] = mapped_column()

    content: Mapped[str] = mapped_column(
        Text
    )

    sources: Mapped[list | None] = mapped_column(
        JSON,
        nullable=True
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow
    )

    session = relationship(
        "ChatSession",
        back_populates="messages"
    )