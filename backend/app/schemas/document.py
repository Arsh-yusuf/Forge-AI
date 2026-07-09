from datetime import datetime
from pydantic import BaseModel,ConfigDict
from app.core.constants import DocumentStatus, DocumentType


class DocumentUploadResponse(BaseModel):
    id: int
    title: str
    document_type: DocumentType
    status: DocumentStatus
    uploaded_at: datetime
    message: str

    class Config:
        from_attributes = True

class DocumentResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    original_filename: str
    document_type: DocumentType
    uploaded_at: datetime


class DocumentListResponse(BaseModel):
    documents: list[DocumentResponse]