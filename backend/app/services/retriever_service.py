from app.embeddings.embedder import Embedder
from app.vectorstore.chroma_client import collection


class RetrieverService:

    @staticmethod
    def search(query: str, top_k: int = 3):

        embedding = Embedder.encode(query)

        results = collection.query(
            query_embeddings=[embedding.tolist()],
            n_results=top_k
        )

        retrieved = []

        ids = results["ids"][0]
        docs = results["documents"][0]
        metas = results["metadatas"][0]
        distances = results["distances"][0]

        for doc,meta,distance in zip(
            docs,
            metas,
            distances
        ):

            retrieved.append(
                {
                    "score": round(1 - distance,3),
                    "document_name": meta.get("document_name"),
                    "page_number": meta.get("page_number"),
                    "section": meta.get("section"),
                    "text": doc
                }
            )

        return retrieved