from pydantic import BaseModel


class ChatRequest(BaseModel):

    session_id: int | None = None

    question: str


class SourceResponse(BaseModel):

    document_name: str | None

    page_number: int | None

    section: str | None

    score: float


class ChatResponse(BaseModel):

    session_id: int

    answer: str

    sources: list[SourceResponse]

    response_time_ms: int | None = None

    search_strategy: str | None = None

    entities_extracted: list[str] | None = None