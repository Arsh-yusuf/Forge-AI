from pydantic import BaseModel


class SearchRequest(BaseModel):
    query: str
    top_k: int = 3


class RetrievedChunk(BaseModel):
    document_id: int
    chunk_index: int
    score: float
    text: str


class SearchResponse(BaseModel):
    chunks: list[RetrievedChunk]