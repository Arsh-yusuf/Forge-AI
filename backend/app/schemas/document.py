from datetime import datetime

from pydantic import BaseModel

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