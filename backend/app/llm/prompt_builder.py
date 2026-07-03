def build_prompt(
    question: str,
    chunks: list[dict],
    history: list = None,
) -> str:

    history_text = ""

    if history:

        for message in history:

            history_text += f"""
{message.role.upper()}:

{message.content}

"""

    context = ""

    for i, chunk in enumerate(chunks, start=1):

        context += f"""
===================================

SOURCE {i}

Document:
{chunk.get("document_name")}

Page:
{chunk.get("page_number")}

Section:
{chunk.get("section")}

Content:

{chunk["text"]}

"""

    return f"""
Previous Conversation

{history_text}

-----------------------------------

Current Question

{question}

-----------------------------------

Reference Documents

{context}

-----------------------------------

Instructions

Use ONLY the reference documents.

If previous conversation helps understand the
question, use it.

Do not invent information.

Return

## Summary

## Evidence

## Recommendation

## Sources
"""