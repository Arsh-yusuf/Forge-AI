import json
import logging

from sqlalchemy.orm import Session

from app.llm.client import client
from app.core.config import settings
from app.models.document import Document
from app.models.graph_triple import GraphTriple

logger = logging.getLogger(__name__)

EXTRACTION_PROMPT = """You are an industrial knowledge graph extractor.

Given a chunk of text from an industrial document (SOP, manual, maintenance report, etc.), extract all meaningful named entity relationships.

Return ONLY a valid JSON array. Each element must have exactly these keys:
- "from": the source entity name (string, max 3 words, title case)
- "from_type": entity type — one of: EQUIPMENT, MATERIAL, PROCESS, PERSON, LOCATION, STANDARD, OTHER
- "relation": relationship label (snake_case verb phrase, e.g. "connected_to", "requires", "used_for", "part_of", "maintained_by")
- "to": the target entity name (string, max 3 words, title case)  
- "to_type": entity type — one of: EQUIPMENT, MATERIAL, PROCESS, PERSON, LOCATION, STANDARD, OTHER

Rules:
1. Return an empty array [] if no meaningful relationships found
2. Focus ONLY on equipment, materials, processes, standards, safety items
3. Ignore generic words like "page", "section", "document", "figure"
4. Max 15 triples per chunk
5. Return ONLY the JSON array, no explanation, no markdown fences

Text chunk:
\"\"\"
{chunk_text}
\"\"\"
"""


class GraphExtractorService:
    """
    Uses the configured LLM (via OpenRouter) to extract entity–relation–entity
    triples from each document chunk and stores them in the graph_triples table.
    """

    @staticmethod
    def extract_triples_from_text(text: str) -> list[dict]:
        """
        Calls the LLM and returns a list of triple dicts.
        Returns empty list on any failure.
        """
        prompt = EXTRACTION_PROMPT.format(chunk_text=text[:2000])

        try:
            response = client.chat.completions.create(
                model=settings.OPENROUTER_MODEL,
                messages=[
                    {
                        "role": "user",
                        "content": prompt,
                    }
                ],
                temperature=0.1,
                max_tokens=1024,
            )

            raw = response.choices[0].message.content.strip()

            # Strip markdown fences if model wraps in them
            if raw.startswith("```"):
                raw = raw.split("```")[1]
                if raw.startswith("json"):
                    raw = raw[4:]

            triples = json.loads(raw)

            if not isinstance(triples, list):
                return []

            return triples

        except Exception as e:
            logger.warning(
                "Graph extraction failed for chunk: %s", str(e)
            )
            return []

    @staticmethod
    def extract_and_store(
        db: Session,
        document: Document,
        chunks,
    ) -> None:
        """
        Iterates over document chunks, extracts triples via LLM,
        and bulk-stores them in the graph_triples table.
        Deletes any existing triples for this document first (idempotent).
        """
        # Clear old triples for this document
        db.query(GraphTriple).filter(
            GraphTriple.document_id == document.id
        ).delete()
        db.commit()

        all_triples: list[GraphTriple] = []

        for chunk in chunks:
            if not chunk.chunk_text or len(chunk.chunk_text.strip()) < 50:
                continue

            raw_triples = GraphExtractorService.extract_triples_from_text(
                chunk.chunk_text
            )

            for t in raw_triples:
                entity_from = str(t.get("from", "")).strip()
                entity_to = str(t.get("to", "")).strip()
                relation = str(t.get("relation", "related_to")).strip()
                from_type = str(t.get("from_type", "OTHER")).strip().upper()
                to_type = str(t.get("to_type", "OTHER")).strip().upper()

                # Skip garbage entries
                if not entity_from or not entity_to or entity_from == entity_to:
                    continue
                if len(entity_from) < 2 or len(entity_to) < 2:
                    continue

                all_triples.append(
                    GraphTriple(
                        document_id=document.id,
                        entity_from=entity_from,
                        relation=relation,
                        entity_to=entity_to,
                        entity_from_type=from_type,
                        entity_to_type=to_type,
                    )
                )

        if all_triples:
            db.bulk_save_objects(all_triples)
            db.commit()

        logger.info(
            "Stored %d triples for document %d",
            len(all_triples),
            document.id,
        )
