from sqlalchemy.orm import Session

from app.llm.prompt_builder import build_prompt
from app.llm.prompts import SYSTEM_PROMPT

from app.services.conversation_service import ConversationService
from app.services.llm_service import LLMService
from app.services.retriever_service import RetrieverService


class ChatService:

    @staticmethod
    def chat(
        db: Session,
        question: str,
        session_id: int | None,
    ):

        if session_id is None:

            session = ConversationService.create_session(db)

            session_id = session.id

        history = ConversationService.get_history(
            db,
            session_id,
        )

        chunks = RetrieverService.search(
            question,
            top_k=5,
        )

        prompt = build_prompt(
            question,
            chunks,
            history,
        )

        answer = LLMService.ask(
            SYSTEM_PROMPT,
            prompt,
        )

        ConversationService.add_message(
            db,
            session_id,
            "user",
            question,
        )

        ConversationService.add_message(
            db,
            session_id,
            "assistant",
            answer,
        )

        return {
            "session_id": session_id,
            "answer": answer,
        }