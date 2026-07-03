from sentence_transformers import SentenceTransformer


class Embedder:
    """
    Singleton embedding model.
    Model is loaded only once.
    """

    _model = None

    @classmethod
    def get_model(cls):
        if cls._model is None:
            print("Loading embedding model...")
            cls._model = SentenceTransformer(
                "BAAI/bge-small-en-v1.5"
            )
        return cls._model

    @classmethod
    def encode(cls, text: str):
        model = cls.get_model()
        return model.encode(text, normalize_embeddings=True)