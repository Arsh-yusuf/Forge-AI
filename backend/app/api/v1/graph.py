from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.schemas.node_details import NodeDetailsResponse

from app.schemas.graph import GraphResponse

from app.services.graph_service import GraphService

router = APIRouter(
    prefix="/graph",
    tags=["Knowledge Graph"],
)


@router.get(
    "",
    response_model=GraphResponse,
)
def get_graph(
    db: Session = Depends(get_db),
):

    return GraphService.get_graph(db)

@router.get(
    "/node/{concept}",
    response_model=NodeDetailsResponse,
)
def get_node_details(
    concept: str,
    db: Session = Depends(get_db),
):

    return GraphService.get_node_details(
        db,
        concept,
    )