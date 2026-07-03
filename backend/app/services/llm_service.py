from app.core.config import settings
from app.llm.client import client


class LLMService:

    @staticmethod
    def ask(system_prompt: str, user_prompt: str):

        response = client.chat.completions.create(

            model=settings.OPENROUTER_MODEL,

            messages=[

                {
                    "role": "system",
                    "content": system_prompt
                },

                {
                    "role": "user",
                    "content": user_prompt
                }

            ],

            temperature=0.2,

            max_tokens=700

        )

        return response.choices[0].message.content