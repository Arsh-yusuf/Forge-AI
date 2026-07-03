from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # -----------------------------
    # Application
    # -----------------------------
    APP_NAME: str = "ForgeAI"
    DEBUG: bool = True
    HOST: str = "0.0.0.0"
    PORT: int = 8000

    # -----------------------------
    # Database
    # -----------------------------
    DATABASE_URL: str

    # -----------------------------
    # JWT
    # -----------------------------
    JWT_SECRET_KEY: str
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60

    model_config = SettingsConfigDict(
        env_file=".env",
        case_sensitive=True
    )

    DOCUMENT_STORAGE:str="storage/documents"

    OPENROUTER_API_KEY: str
    OPENROUTER_BASE_URL: str 
    OPENROUTER_MODEL: str 


@lru_cache
def get_settings():
    return Settings()


settings = get_settings()