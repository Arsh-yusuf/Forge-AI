from app.database.base import Base
from app.database.session import engine, SessionLocal

# Import all models
from app.models import *

from app.seeds.seed import seed_database


def init_db():

    Base.metadata.create_all(bind=engine)

    db = SessionLocal()

    seed_database(db)

    db.close()