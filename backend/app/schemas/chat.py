from pydantic import BaseModel


class ChatRequest(BaseModel):

    session_id: int | None = None

    question: str


class ChatResponse(BaseModel):

    session_id: int

    answer: str