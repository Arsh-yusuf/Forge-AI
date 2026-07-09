from pydantic import BaseModel


class GraphNode(BaseModel):
    id: str
    label: str
    entity_type: str
    count: int
    documents: list[int]


class GraphEdge(BaseModel):
    id: str
    source: str
    target: str
    relation: str
    weight: int


class GraphResponse(BaseModel):
    nodes: list[GraphNode]
    edges: list[GraphEdge]