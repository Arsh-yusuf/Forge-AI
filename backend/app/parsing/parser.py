import fitz

from app.parsing.models import ParsedDocument, PageData


class PDFParser:

    @staticmethod
    def parse(pdf_path: str) -> ParsedDocument:

        pdf = fitz.open(pdf_path)

        parsed = ParsedDocument()

        for index, page in enumerate(pdf):

            text = page.get_text("text").strip()

            parsed.pages.append(
                PageData(
                    page_number=index + 1,
                    text=text
                )
            )

        pdf.close()

        return parsed