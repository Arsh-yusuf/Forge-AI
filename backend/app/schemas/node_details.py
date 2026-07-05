from pydantic import BaseModel


class NodeOccurrence(BaseModel):
    document: str
    page: int
    section: str


class NodeDetailsResponse(BaseModel):
    concept: str
    occurrences: list[NodeOccurrence]