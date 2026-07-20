import base64
import io

from PIL import Image

from app.llm.client import client
from app.core.config import settings


class VisionService:

    @staticmethod
    def _encode_image(image: Image.Image) -> str:
        buffer = io.BytesIO()
        image.save(buffer, format="PNG")
        return base64.b64encode(buffer.getvalue()).decode("utf-8")

    @classmethod
    def extract_from_image(cls, image: Image.Image) -> str:
        base64_image = cls._encode_image(image)

        prompt = (
            "You are analyzing an engineering P&ID (Piping and Instrumentation Diagram) "
            "or technical drawing. Extract ALL of the following:\n"
            "1. Equipment tags (e.g., T-101, P-201, V-301, C-401)\n"
            "2. Process parameters (pressures, temperatures, flow rates)\n"
            "3. Valve labels and types\n"
            "4. Line specifications (pipe sizes, materials)\n"
            "5. Any readable text, labels, or annotations\n\n"
            "Return everything you find as plain text, one item per line. "
            "Prefix each category with [TAG], [PARAM], [VALVE], [LINE], or [NOTE]. "
            "If you cannot read anything clearly, return 'NO_TEXT_FOUND'."
        )

        response = client.chat.completions.create(
            model=settings.VISION_MODEL,
            messages=[
                {
                    "role": "user",
                    "content": [
                        {"type": "text", "text": prompt},
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": f"data:image/png;base64,{base64_image}"
                            },
                        },
                    ],
                }
            ],
            max_tokens=1024,
        )

        return response.choices[0].message.content.strip()
