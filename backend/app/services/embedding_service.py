from app.embeddings.embedder import Embedder
from app.vectorstore.chroma_client import collection

class EmbeddingService:

    @staticmethod
    def index_chunk(chunk):

        embedding = Embedder.encode(chunk.chunk_text)

        collection.add(
            ids=[str(chunk.id)],
            documents=[chunk.chunk_text],
            embeddings=[embedding.tolist()],
            metadatas=[
                {
                    "document_id": chunk.document_id,
                    "chunk_index": chunk.chunk_index,
                    "document_name": chunk.document.original_filename,
                    "page_number": chunk.page_number,
                    "section": chunk.section_title or "Unknown"
                }
            ]
        )