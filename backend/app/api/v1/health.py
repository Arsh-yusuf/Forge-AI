from fastapi import APIRouter

router = APIRouter(tags=["Health"])


@router.get("/")
def health():
    return {
        "status": "healthy",
        "service": "ForgeAI Backend"
    }