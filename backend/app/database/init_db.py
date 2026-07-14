from app.database.base import Base
from app.database.session import engine, SessionLocal
from sqlalchemy import text

# Import all models
from app.models import *

from app.seeds.seed import seed_database


def init_db():

    Base.metadata.create_all(bind=engine)

    db = SessionLocal()

    try:
        db.execute(text("ALTER TABLE chat_messages ADD COLUMN IF NOT EXISTS sources JSON;"))
        db.commit()
    except Exception as e:
        print("Migration error (might be SQLite or column already exists):", e)

    seed_database(db)

    db.close()