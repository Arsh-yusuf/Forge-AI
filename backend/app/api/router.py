from fastapi import APIRouter

from app.api.v1 import health,auth,users,documents,search,chat,dashboard
from app.api.v1.graph import router as graph_router

api_router = APIRouter()

api_router.include_router(
    health.router,
    prefix="/health"
)

api_router.include_router(auth.router)
api_router.include_router(users.router)
api_router.include_router(documents.router)
api_router.include_router(search.router)
api_router.include_router(chat.router)
api_router.include_router(dashboard.router)
api_router.include_router(graph_router)



