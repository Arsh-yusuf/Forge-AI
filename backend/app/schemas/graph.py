from pydantic import BaseModel


class GraphNode(BaseModel):
    id: str
    label: str
    count: int
    documents: list[int]


class GraphEdge(BaseModel):
    id: str
    source: str
    target: str
    weight: int


class GraphResponse(BaseModel):
    nodes: list[GraphNode]
    edges: list[GraphEdge]