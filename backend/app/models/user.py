from sqlalchemy import ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)

    full_name: Mapped[str] = mapped_column(
        String(100)
    )

    email: Mapped[str] = mapped_column(
        String(120),
        unique=True,
        index=True
    )

    password_hash: Mapped[str] = mapped_column(
        String(255)
    )

    role_id: Mapped[int] = mapped_column(
        ForeignKey("roles.id")
    )

    department_id: Mapped[int] = mapped_column(
        ForeignKey("departments.id")
    )

    role = relationship("Role")

    department = relationship("Department")