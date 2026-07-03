from fastapi import FastAPI
from app.api.router import api_router
from app.core.config import settings
from contextlib import asynccontextmanager
from app.database.init_db import init_db


@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    yield


app = FastAPI(
    title=settings.APP_NAME,
    lifespan=lifespan
)
app.include_router(api_router)