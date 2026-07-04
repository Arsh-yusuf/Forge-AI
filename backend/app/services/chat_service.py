from sqlalchemy.orm import Session
from app.llm.query_rewriter import QueryRewriter
from app.llm.prompt_builder import build_prompt
from app.llm.prompts import SYSTEM_PROMPT
from app.services.conversation_service import ConversationService
from app.services.llm_service import LLMService
from app.services.retriever_service import RetrieverService
from app.models.chat_session import ChatSession


class ChatService:

    @staticmethod
    def chat(
        db: Session,
        question: str,
        session_id: int | None,
    ):

        if session_id is None:

            session = ConversationService.create_session(db)
            session.title = question[:60]
            db.commit()
            db.refresh(session)
            session_id=session.id
        
        else:
            session=(
                db.query(ChatSession)
                .filter(ChatSession.id==session_id)
                .first()
            )
           

        history = ConversationService.get_history(
            db,
            session_id,
        )

        search_query=QueryRewriter.rewrite(
            history,
            question,
        )
        print("=" * 60)
        print("Original Question :", question)
        print("Rewritten Query   :", search_query)
        print("=" * 60)

        chunks = RetrieverService.search(
            search_query,
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
            "sources": [
            {
                "document_name": chunk["document_name"],
                "page_number": chunk["page_number"],
                "section": chunk["section"],
                "score": chunk["score"],

            }
            for chunk in chunks
            ],
        }