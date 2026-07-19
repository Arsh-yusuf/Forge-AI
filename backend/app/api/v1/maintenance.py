import json
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.services.retriever_service import RetrieverService
from app.services.llm_service import LLMService

router = APIRouter(
    prefix="/maintenance",
    tags=["Maintenance"]
)

SYSTEM_RCA_PROMPT = """You are a senior industrial maintenance engineer and Root Cause Analysis expert specializing in steel plants, heavy machinery, and process equipment.

You will receive a symptom or failure description from an operations team, along with excerpts from relevant maintenance manuals, inspection records, and historical incident reports retrieved from the plant's knowledge base.

Your task is to perform a structured Root Cause Analysis (RCA) using the 5 Whys methodology.

Reply with a valid JSON object ONLY. Do NOT include markdown fencing (no ```json), no intro text, no suffix text.

The output JSON must follow this exact structure:
{
  "problem_statement": "Clear 1-2 sentence summary of the stated problem",
  "confidence_score": 82,
  "five_whys": [
    "Why 1: Observed symptom — explanation",
    "Why 2: Reason for Why 1",
    "Why 3: Reason for Why 2",
    "Why 4: Reason for Why 3",
    "Why 5: Fundamental root cause"
  ],
  "root_cause": "Single clear sentence identifying the fundamental root cause",
  "recommendations": [
    "Immediate corrective action step",
    "Short-term preventive measure",
    "Long-term systemic improvement"
  ],
  "sources": [
    "document_name_1.pdf",
    "document_name_2.pdf"
  ]
}

Base confidence_score on richness of retrieved context (0-100). If context is thin, score lower.
Ensure five_whys contains exactly 5 progressive causal steps from symptom to root cause.
"""


class RcaRequest(BaseModel):
    symptom: str


@router.post("/rca")
def run_rca(request: RcaRequest):
    if not request.symptom.strip():
        raise HTTPException(status_code=400, detail="Symptom description cannot be empty.")

    # Retrieve relevant context from vector store
    results = RetrieverService.search(query=request.symptom, top_k=6)

    if not results:
        context_block = "No relevant documents were found in the knowledge base. Perform RCA based on general industrial maintenance knowledge."
    else:
        # Build a rich context from chunks
        context_parts = []
        for chunk in results:
            context_parts.append(
                f"[Source: {chunk['document_name']} | Page: {chunk['page_number']} | Section: {chunk['section']}]\n{chunk['text']}"
            )
        context_block = "\n\n---\n\n".join(context_parts)

    user_prompt = (
        f"Reported Symptom / Failure: {request.symptom}\n\n"
        f"Retrieved Plant Knowledge Base Context:\n{context_block}"
    )

    raw_response = LLMService.ask(SYSTEM_RCA_PROMPT, user_prompt)

    # Sanitize potential markdown wrapping from LLM
    cleaned = raw_response.strip()
    if cleaned.startswith("```"):
        lines = cleaned.splitlines()
        if lines[0].startswith("```"):
            lines = lines[1:]
        if lines and lines[-1].startswith("```"):
            lines = lines[:-1]
        cleaned = "\n".join(lines).strip()

    try:
        rca_result = json.loads(cleaned)
    except Exception as e:
        print("RCA JSON parse error. Raw response:", raw_response)
        rca_result = {
            "problem_statement": request.symptom,
            "confidence_score": 30,
            "five_whys": [
                "Why 1: Unable to parse LLM structured response.",
                "Why 2: Model may have returned non-JSON output.",
                "Why 3: Prompt format may need adjustment.",
                "Why 4: Insufficient context retrieved from knowledge base.",
                "Why 5: Root documentation may not be ingested yet."
            ],
            "root_cause": f"Parse error — {str(e)}. Please retry or upload relevant maintenance manuals.",
            "recommendations": [
                "Re-run the RCA after uploading relevant equipment manuals.",
                "Ensure the relevant SOP or incident record is ingested via the Documents page.",
                "Contact your maintenance knowledge administrator."
            ],
            "sources": []
        }

    return rca_result
