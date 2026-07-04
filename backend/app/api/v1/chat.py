from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.services.conversation_service import ConversationService

from app.database.session import get_db

from app.schemas.chat import (
    ChatRequest,
    ChatResponse,
)

from app.services.chat_service import ChatService

router = APIRouter(
    prefix="/chat",
    tags=["Chat"],
)


@router.post(
    "",
    response_model=ChatResponse,
)

def chat(
    request: ChatRequest,
    db: Session = Depends(get_db),
):

    return ChatService.chat(
        db=db,
        question=request.question,
        session_id=request.session_id,
    )

@router.get("/sessions")
def get_chat_sessions(
    db: Session = Depends(get_db),
):

    sessions = ConversationService.get_sessions(db)

    return sessions


@router.get("/{session_id}")
def get_chat_history(
    session_id: int,
    db: Session = Depends(get_db),
):

    messages = ConversationService.get_session_messages(
        db,
        session_id,
    )

    return {
        "session_id": session_id,
        "messages": messages,
    }