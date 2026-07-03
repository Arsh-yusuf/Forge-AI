from fastapi import APIRouter, Depends, File, Form, UploadFile
from sqlalchemy.orm import Session
from app.services.document_service import DocumentService
from app.schemas.document import DocumentListResponse
from app.core.constants import DocumentType
from app.core.security import get_current_user
from app.database.session import get_db
from app.schemas.document import DocumentUploadResponse
from app.services.upload_service import UploadService

router = APIRouter(
    prefix="/documents",
    tags=["Documents"],
)


@router.post(
    "/upload",
    response_model=DocumentUploadResponse,
)

@router.get(
    "",
    response_model=DocumentListResponse,
)

def list_documents(
    db: Session = Depends(get_db),
):

    documents = DocumentService.get_all_documents(db)

    return {
        "documents": documents
    }


def upload_document(
    document_type: DocumentType = Form(...),
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):

    document = UploadService.upload_document(
        db=db,
        file=file,
        document_type=document_type,
        current_user=current_user,
    )

    return {
        "id": document.id,
        "title": document.title,
        "document_type": document.document_type,
        "status": document.status,
        "uploaded_at": document.uploaded_at,
        "message": "Document uploaded successfully.",
    }