import json
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.models.document import Document
from app.models.document_chunk import DocumentChunk
from app.services.llm_service import LLMService

router = APIRouter(
    prefix="/compliance",
    tags=["Compliance"]
)

SYSTEM_AUDIT_PROMPT = """You are an expert industrial safety auditor specializing in steel plants, heavy machinery, operations, and regulatory standards (OSHA, ISO 45001, Factory Act).
Your task is to analyze the provided standard operating procedure (SOP) or safety policy document and evaluate its compliance with safety regulations.

You must reply with a valid JSON object ONLY. Do not include markdown wraps (like ```json) or any conversational prefix/suffix.

The output JSON structure must be exactly:
{
  "compliance_score": 75,
  "summary": "Short overall audit summary here...",
  "checkpoints": [
    {
      "category": "PPE" | "Emergency Protocols" | "LOTO (Lockout/Tagout)" | "Hazard Communication" | "Training" | "Ventilation & Emissions",
      "requirement": "Name of the requirement (e.g., Eye and Face Protection)",
      "status": "COMPLIANT" | "GAP" | "CRITICAL_MISSING",
      "findings": "What did you find in the text? Quote/reference if possible.",
      "remediation": "Remediation step if GAP or CRITICAL_MISSING, otherwise empty."
    }
  ]
}
Ensure you output exactly 4 to 6 checkpoints covering critical aspects of industrial safety.
"""

@router.post("/audit/{document_id}")
def audit_document(
    document_id: int,
    db: Session = Depends(get_db)
):
    doc = db.query(Document).filter(Document.id == document_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")

    # Fetch document chunks
    chunks = (
        db.query(DocumentChunk)
        .filter(DocumentChunk.document_id == document_id)
        .order_by(DocumentChunk.chunk_index.asc())
        .all()
    )

    if not chunks:
        raise HTTPException(status_code=400, detail="Document has no text content parsed yet.")

    # Combine text up to ~12000 chars for analysis
    doc_text = ""
    for chunk in chunks:
        if len(doc_text) + len(chunk.chunk_text) < 15000:
            doc_text += f"\n[Section: {chunk.section_title}, Page: {chunk.page_number}]\n{chunk.chunk_text}"
        else:
            break

    user_prompt = f"Document Title: {doc.title}\nCategory: {doc.document_type}\n\nContent:\n{doc_text}"

    raw_response = LLMService.ask(SYSTEM_AUDIT_PROMPT, user_prompt)

    # Sanitize model response for json parsing
    cleaned = raw_response.strip()
    if cleaned.startswith("```"):
        # Remove first line of code block
        lines = cleaned.splitlines()
        if lines[0].startswith("```"):
            lines = lines[1:]
        if lines[-1].startswith("```"):
            lines = lines[:-1]
        cleaned = "\n".join(lines).strip()

    try:
        audit_result = json.loads(cleaned)
    except Exception as e:
        # Fallback parse error structure
        print("Audit LLM JSON parse failed. Raw response:", raw_response)
        audit_result = {
            "compliance_score": 50,
            "summary": "Error parsing model audit results. Please retry.",
            "checkpoints": [
                {
                    "category": "System",
                    "requirement": "Compliance Parse Check",
                    "status": "GAP",
                    "findings": f"LLM reply could not be parsed: {str(e)}",
                    "remediation": "Re-run the audit to trigger a cleaner format."
                }
            ]
        }

    return audit_result
