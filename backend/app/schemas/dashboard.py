from pydantic import BaseModel


class DashboardStatsResponse(BaseModel):
    documents: int
    chunks: int
    chat_sessions: int
    questions: int