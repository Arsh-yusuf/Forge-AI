import re


class TextChunker:
    """
    Page-aware semantic chunker.

    Instead of cutting every N characters blindly,
    it chunks paragraph by paragraph while keeping
    page information.
    """

    CHUNK_SIZE = 1000
    OVERLAP = 150

    @staticmethod
    def extract_section(paragraph: str, current_section: str) -> str:
        """
        Try to detect a heading.

        Examples:

        PULLEY LAGGING

        4.3 Belt Tracking

        6 Maintenance

        SAFETY PRECAUTIONS
        """

        line = paragraph.split("\n")[0].strip()

        if len(line) > 80:
            return current_section

        if re.match(r"^\d+(\.\d+)*\s+", line):
            return line

        if line.isupper() and len(line) > 3:
            return line.title()

        if (
            len(line.split()) <= 8
            and line.endswith(":") is False
            and line[-1:].isalnum()
        ):
            return line

        return current_section

    @staticmethod
    def split_pages(parsed_document):
        """
        Input:
            ParsedDocument

        Output:

        [
            {
                page_number,
                section,
                index,
                text,
                start,
                end
            }
        ]
        """

        chunks = []

        chunk_index = 0

        current_section = "Unknown"

        for page in parsed_document.pages:

            page_text = page.text.strip()

            if not page_text:
                continue

            paragraphs = [

                p.strip()

                for p in re.split(r"\n\s*\n", page_text)

                if p.strip()

            ]

            current_chunk = ""

            start_char = 0

            for paragraph in paragraphs:

                current_section = TextChunker.extract_section(
                    paragraph,
                    current_section,
                )

                if len(current_chunk) + len(paragraph) > TextChunker.CHUNK_SIZE:

                    chunks.append(
                        {
                            "index": chunk_index,
                            "text": current_chunk.strip(),
                            "page_number": page.page_number,
                            "section": current_section,
                            "start": start_char,
                            "end": start_char + len(current_chunk),
                        }
                    )

                    chunk_index += 1

                    overlap = current_chunk[
                        -TextChunker.OVERLAP:
                    ]

                    current_chunk = overlap + "\n\n" + paragraph

                    start_char += (
                        len(current_chunk)
                        - TextChunker.OVERLAP
                    )

                else:

                    current_chunk += "\n\n" + paragraph

            if current_chunk.strip():

                chunks.append(
                    {
                        "index": chunk_index,
                        "text": current_chunk.strip(),
                        "page_number": page.page_number,
                        "section": current_section,
                        "start": start_char,
                        "end": start_char + len(current_chunk),
                    }
                )

                chunk_index += 1

        return chunks