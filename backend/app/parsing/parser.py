import fitz
from PIL import Image

from app.parsing.models import ParsedDocument, PageData
from app.parsing.ocr_service import OCRService
from app.parsing.vision_service import VisionService


class PDFParser:

    @staticmethod
    def parse(pdf_path: str) -> ParsedDocument:

        pdf = fitz.open(pdf_path)

        parsed = ParsedDocument()

        for index, page in enumerate(pdf):

            # Tier 1: Native text extraction
            text = page.get_text("text").strip()

            used_ocr = False
            used_vision = False

            if len(text) < 30:

                # Tier 2: Improved Tesseract OCR
                print(f"OCR: Page {index + 1}")

                ocr_text = OCRService.extract_text(page)

                if len(ocr_text.strip()) >= 20:
                    text = ocr_text
                    used_ocr = True

                else:
                    # Tier 3: LLM vision as final fallback
                    print(f"[VISION] Page {index + 1}")

                    matrix = fitz.Matrix(4, 4)
                    pix = page.get_pixmap(matrix=matrix, alpha=False)
                    image = Image.frombytes(
                        "RGB", [pix.width, pix.height], pix.samples
                    )

                    vision_text = VisionService.extract_from_image(image)

                    if vision_text and vision_text != "NO_TEXT_FOUND":
                        text = vision_text
                        used_vision = True
                    else:
                        print(f"Warning: All extraction methods failed on page {index+1}")

            parsed.pages.append(
                PageData(
                    page_number=index + 1,
                    text=text,
                )
            )

            print(
                f"Page {index+1} | "
                f"OCR={used_ocr} | "
                f"VISION={used_vision} | "
                f"Characters={len(text)}"
            )

        pdf.close()

        return parsed