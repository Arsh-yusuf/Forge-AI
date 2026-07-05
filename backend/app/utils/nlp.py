import spacy

nlp = spacy.load("en_core_web_sm")


def extract_concepts(text: str) -> list[str]:
    """
    Extract meaningful concepts from text.

    Returns only nouns/proper nouns,
    removes stop words,
    converts everything to lowercase lemma.
    """

    doc = nlp(text)

    concepts = []

    for token in doc:

        if (
            token.pos_ in ("NOUN", "PROPN")
            and token.is_alpha
            and not token.is_stop
            and len(token.text) > 2
        ):

            concepts.append(token.lemma_.lower())

    return concepts