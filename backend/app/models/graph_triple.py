from sqlalchemy import ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base


class GraphTriple(Base):
    __tablename__ = "graph_triples"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True,
    )

    document_id: Mapped[int] = mapped_column(
        ForeignKey("documents.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    entity_from: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    relation: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    entity_to: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    entity_from_type: Mapped[str] = mapped_column(
        String(100),
        default="UNKNOWN",
    )

    entity_to_type: Mapped[str] = mapped_column(
        String(100),
        default="UNKNOWN",
    )

    document = relationship("Document")
