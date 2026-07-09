import fitz

from app.parsing.models import ParsedDocument, PageData
from app.parsing.ocr_service import OCRService


class PDFParser:

    @staticmethod
    def parse(pdf_path: str) -> ParsedDocument:

        pdf = fitz.open(pdf_path)

        parsed = ParsedDocument()

        for index, page in enumerate(pdf):

            # First try normal text extraction
            text = page.get_text("text").strip()

            used_ocr = False

            # If page contains almost no text,
            # assume it is scanned
            if len(text) < 30:

                print(
                    f"OCR: Page {index + 1}"
                )

                ocr_text = OCRService.extract_text(
                    page
                )

                if len(ocr_text.strip()) >=20:

                    text = ocr_text

                    used_ocr = True
                
                else:
                    print(
                        f"Warning :OCR failed on page {index+1}" 
                    )

            parsed.pages.append(

                PageData(

                    page_number=index + 1,

                    text=text,

                )

            )

            print(

                f"Page {index+1} | "

                f"OCR={used_ocr} | "

                f"Characters={len(text)}"

            )

        pdf.close()

        return parsed