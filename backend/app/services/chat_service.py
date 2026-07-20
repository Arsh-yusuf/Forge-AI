import json
import time
from concurrent.futures import ThreadPoolExecutor, as_completed

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
    def _classify_query(question: str) -> bool:
        prompt = (
            f'Does this query ask to summarize, list, compare, or describe '
            f'details/causes for multiple different incidents, entities, or '
            f'equipment tags? '
            f'Answer with JSON only: {{"is_multi": true/false}}\n\nQuery: {question}'
        )
        try:
            response = LLMService.ask("", prompt)
            result = json.loads(response.strip().strip("`").strip())
            return bool(result.get("is_multi"))
        except (json.JSONDecodeError, Exception):
            return False

    @staticmethod
    def _extract_entities(question: str, context_text: str) -> list[str]:
        prompt = (
            f"Based on the following query and retrieved document content, "
            f"extract a list of unique names of incidents, machines, companies, "
            f"or equipment tags being asked about.\n\n"
            f"Query: {question}\n\n"
            f"Retrieved content:\n{context_text[:2000]}\n\n"
            f"Return ONLY a JSON array of strings, e.g. [\"Entity1\", \"Entity2\"]. "
            f"If none found, return []."
        )
        try:
            response = LLMService.ask("", prompt)
            entities = json.loads(response.strip().strip("`").strip())
            return entities if isinstance(entities, list) else []
        except (json.JSONDecodeError, Exception):
            return []

    @staticmethod
    def _multi_entity_search(question: str, search_query: str) -> tuple[list[dict], list[str]]:

        prelim = RetrieverService.search(search_query, top_k=5)
        prelim_text = "\n\n".join(c["text"] for c in prelim)

        entities = ChatService._extract_entities(question, prelim_text)
        entities = entities[:10]

        print(f"Multi-entity query detected. Extracted entities: {entities}")

        if not entities:
            return prelim, []

        all_chunks = list(prelim)

        with ThreadPoolExecutor(max_workers=5) as executor:
            futures = {
                executor.submit(
                    RetrieverService.search, f"{entity} {question}", 2
                ): entity
                for entity in entities
            }
            for future in as_completed(futures):
                entity = futures[future]
                try:
                    sub_chunks = future.result()
                    print(f"Sub-query search for {entity}: {len(sub_chunks)} chunks")
                    all_chunks.extend(sub_chunks)
                except Exception as e:
                    print(f"Sub-query search failed for {entity}: {e}")

        seen = set()
        unique = []
        for chunk in all_chunks:
            key = (
                chunk["document_name"],
                chunk["page_number"],
                chunk["section"],
            )
            if key not in seen:
                seen.add(key)
                unique.append(chunk)

        unique.sort(key=lambda x: x["score"], reverse=True)

        return unique, entities

    @staticmethod
    def chat(
        db: Session,
        question: str,
        session_id: int | None,
    ):

        start_time = time.perf_counter()

        if session_id is None:

            session = ConversationService.create_session(db)
            session.title = question[:60]
            db.commit()
            db.refresh(session)
            session_id = session.id

        else:
            session = (
                db.query(ChatSession)
                .filter(ChatSession.id == session_id)
                .first()
            )

        history = ConversationService.get_history(
            db,
            session_id,
        )

        search_query = QueryRewriter.rewrite(
            history,
            question,
        )
        print("=" * 60)
        print("Original Question :", question)
        print("Rewritten Query   :", search_query)
        print("=" * 60)

        is_multi = ChatService._classify_query(question)

        entities_extracted = []
        if is_multi:
            print(f"[MULTI-ENTITY] Routing to expanded search")
            chunks, entities_extracted = ChatService._multi_entity_search(question, search_query)
            search_strategy = "multi_entity"
        else:
            chunks = RetrieverService.search(
                search_query,
                top_k=8,
            )
            search_strategy = "single"

        prompt = build_prompt(
            question,
            chunks,
            history,
        )

        answer = LLMService.ask(
            SYSTEM_PROMPT,
            prompt,
        )

        elapsed_ms = int((time.perf_counter() - start_time) * 1000)

        source_list = [
            {
                "document_name": chunk["document_name"],
                "page_number": chunk["page_number"],
                "section": chunk["section"],
                "score": round(chunk["score"], 4),
            }
            for chunk in chunks
        ]

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
            sources=source_list,
        )

        return {
            "session_id": session_id,
            "answer": answer,
            "sources": source_list,
            "response_time_ms": elapsed_ms,
            "search_strategy": search_strategy,
            "entities_extracted": entities_extracted if entities_extracted else None,
        }