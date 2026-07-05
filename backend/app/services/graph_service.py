from collections import Counter, defaultdict
from itertools import combinations

from sqlalchemy.orm import Session

from app.models.document_chunk import DocumentChunk
from app.utils.nlp import extract_concepts


class GraphService:
    """
    Builds a knowledge graph using concept co-occurrence.

    Pipeline:
        1. Extract concepts from every chunk
        2. Count concept frequency
        3. Keep only important concepts
        4. Build concept co-occurrence graph
        5. Keep strongest relationships
    """

    MAX_NODES = 30
    MAX_EDGES = 50
    MIN_FREQUENCY = 3
    MAX_NEIGHBORS = 5

    @staticmethod
    def _extract_chunk_concepts(chunks):

        chunk_concepts = []
        concept_counter = Counter()

        for chunk in chunks:

            concepts = extract_concepts(chunk.chunk_text)

            concepts = list(dict.fromkeys(concepts))

            chunk_concepts.append(
                {
                    "chunk": chunk,
                    "concepts": concepts,
                }
            )

            concept_counter.update(concepts)

        return chunk_concepts, concept_counter

    @staticmethod
    def _select_top_concepts(counter):

        frequent = [

            (concept, count)

            for concept, count in counter.items()

            if count >= GraphService.MIN_FREQUENCY

        ]

        frequent.sort(
            key=lambda x: x[1],
            reverse=True,
        )

        selected = frequent[: GraphService.MAX_NODES]

        return {

            concept: count

            for concept, count in selected

        }

    @staticmethod
    def _build_nodes(chunk_concepts, selected):

        nodes = {}

        for item in chunk_concepts:

            chunk = item["chunk"]

            concepts = item["concepts"]

            for concept in concepts:

                if concept not in selected:

                    continue

                if concept not in nodes:

                    nodes[concept] = {

                        "id": concept,

                        "label": concept.title(),

                        "count": selected[concept],

                        "documents": set(),

                    }

                nodes[concept]["documents"].add(
                    chunk.document_id
                )

        return nodes

    @staticmethod
    def _build_edge_weights(chunk_concepts, selected):

        edge_counter = Counter()

        for item in chunk_concepts:

            concepts = [

                c

                for c in item["concepts"]

                if c in selected

            ]

            concepts = sorted(set(concepts))

            for source, target in combinations(
                concepts,
                2,
            ):

                edge_counter[(source, target)] += 1

        return edge_counter

    @staticmethod
    def _build_edges(edge_counter):

        sorted_edges = sorted(
            edge_counter.items(),
            key=lambda x: x[1],
            reverse=True,
        )

        neighbour_count = defaultdict(int)
        edges = []

        for (source, target), weight in sorted_edges:

            if len(edges) >= GraphService.MAX_EDGES:
                break

            if (
                neighbour_count[source]
                >= GraphService.MAX_NEIGHBORS
            ):
                continue

            if (
                neighbour_count[target]
                >= GraphService.MAX_NEIGHBORS
            ):
                continue

            neighbour_count[source] += 1
            neighbour_count[target] += 1

            edges.append(
                {
                    "id": f"{source}-{target}",
                    "source": source,
                    "target": target,
                    "weight": weight,
                }
            )

        return edges

    @staticmethod
    def get_graph(db: Session):

        chunks = db.query(DocumentChunk).all()

        if not chunks:
            return {"nodes": [], "edges": []}

        # Step 1
        chunk_concepts, concept_counter = (
            GraphService._extract_chunk_concepts(chunks)
        )

        # Step 2
        selected = GraphService._select_top_concepts(concept_counter)

        # Step 3
        nodes = GraphService._build_nodes(chunk_concepts, selected)

        # Step 4
        edge_counter = (
            GraphService._build_edge_weights(chunk_concepts, selected)
        )

        # Step 5
        edges = GraphService._build_edges(edge_counter)

        # Step 6
        final_nodes = []
        for node in nodes.values():
            node["documents"] = sorted(list(node["documents"]))
            final_nodes.append(node)

        # Step 7
        final_nodes.sort(key=lambda x: x["count"], reverse=True)

        return {"nodes": final_nodes, "edges": edges} 

    @staticmethod
    def get_node_details(
        db: Session,
        concept: str,
    ):

        chunks = db.query(DocumentChunk).all()

        occurrences = []

        concept = concept.lower()

        for chunk in chunks:

            concepts = extract_concepts(
                chunk.chunk_text
            )

            if concept not in concepts:
                continue

            occurrences.append(
                {
                    "document": chunk.document.title,
                    "page": chunk.page_number,
                    "section": chunk.section_title,
                }
            )

        return {

            "concept": concept.title(),

            "occurrences": occurrences,

        }  