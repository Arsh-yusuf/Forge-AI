from app.embeddings.embedder import Embedder
from app.vectorstore.chroma_client import collection


class RetrieverService:

    @staticmethod
    def search(query: str, top_k: int = 5):

        embedding = Embedder.encode(query)

        results = collection.query(
            query_embeddings=[embedding.tolist()],
            n_results=top_k,
        )

        ids = results["ids"][0]
        docs = results["documents"][0]
        metas = results["metadatas"][0]
        distances = results["distances"][0]

        grouped = {}

        for doc, meta, distance in zip(
            docs,
            metas,
            distances,
        ):

            score = round(1 - distance, 3)

            key = (
                meta.get("document_name"),
                meta.get("page_number"),
                meta.get("section"),
            )

            if key not in grouped:

                grouped[key] = {
                    "document_name": meta.get("document_name"),
                    "page_number": meta.get("page_number"),
                    "section": meta.get("section"),
                    "score": score,
                    "texts": [doc],
                }

            else:

                grouped[key]["texts"].append(doc)

                if score > grouped[key]["score"]:
                    grouped[key]["score"] = score

        retrieved = []

        for value in grouped.values():

            retrieved.append(
                {
                    "document_name": value["document_name"],
                    "page_number": value["page_number"],
                    "section": value["section"],
                    "score": value["score"],
                    "text": "\n\n".join(value["texts"]),
                }
            )

        retrieved.sort(
            key=lambda x: x["score"],
            reverse=True,
        )

        return retrieved