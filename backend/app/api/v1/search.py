from fastapi import APIRouter

from app.schemas.search import (
    SearchRequest,
    SearchResponse,
)
from app.services.retriever_service import RetrieverService

router = APIRouter(
    prefix="/search",
    tags=["Search"],
)


@router.post(
    "",
    response_model=SearchResponse,
)
def search(request: SearchRequest):

    chunks = RetrieverService.search(
        request.query,
        request.top_k,
    )

    return {
        "chunks": chunks
    }