from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.schemas.dashboard import DashboardStatsResponse
from app.services.dashboard_service import DashboardService
from app.core.security import get_current_user

router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"],
)


@router.get(
    "/stats",
    response_model=DashboardStatsResponse,
)
def dashboard_stats(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):

    return DashboardService.get_stats(db)