from app.llm.client import client
from app.core.config import settings


class QueryRewriter:

    @staticmethod
    def rewrite(history: list, question: str) -> str:

        if not history:
            return question

        conversation = ""

        for message in history:
            conversation += f"{message.role}: {message.content}\n"

        prompt = f"""
You are an assistant that rewrites follow-up questions.

Your task:

Convert the user's latest question into a standalone question.

Rules:

- Do NOT answer the question.
- Do NOT explain anything.
- Return ONLY the rewritten question.
- If the question is already standalone, return it unchanged.

Conversation:

{conversation}

Latest Question:

{question}
"""

        response = client.chat.completions.create(

            model=settings.OPENROUTER_MODEL,

            temperature=0,

            max_tokens=80,

            messages=[
                {
                    "role": "user",
                    "content": prompt
                }
            ]
        )

        return response.choices[0].message.content.strip()