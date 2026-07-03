class TextChunker:

    CHUNK_SIZE = 1000
    OVERLAP = 200

    @staticmethod
    def split(text: str):

        chunks = []

        start = 0
        index = 0

        while start < len(text):

            end = start + TextChunker.CHUNK_SIZE

            chunk = text[start:end]

            chunks.append(
                {
                    "index": index,
                    "text": chunk,
                    "start": start,
                    "end": min(end, len(text)),
                }
            )

            start += (
                TextChunker.CHUNK_SIZE
                - TextChunker.OVERLAP
            )

            index += 1

        return chunks