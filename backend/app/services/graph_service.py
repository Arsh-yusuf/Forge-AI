from collections import Counter, defaultdict

from sqlalchemy.orm import Session

from app.models.graph_triple import GraphTriple


class GraphService:
    """
    Builds a knowledge graph from LLM-extracted entity-relation triples
    stored in the graph_triples table.
    """

    @staticmethod
    def get_graph(db: Session):
        triples = db.query(GraphTriple).all()

        if not triples:
            return {"nodes": [], "edges": []}

        # Build node registry: id -> node dict
        node_map: dict[str, dict] = {}
        edge_counter: Counter = Counter()

        for triple in triples:
            src = triple.entity_from.strip()
            tgt = triple.entity_to.strip()
            rel = triple.relation.strip()

            if not src or not tgt:
                continue

            # Register source node
            if src not in node_map:
                node_map[src] = {
                    "id": src,
                    "label": src,
                    "entity_type": triple.entity_from_type or "OTHER",
                    "count": 0,
                    "documents": set(),
                }
            node_map[src]["count"] += 1
            node_map[src]["documents"].add(triple.document_id)

            # Register target node
            if tgt not in node_map:
                node_map[tgt] = {
                    "id": tgt,
                    "label": tgt,
                    "entity_type": triple.entity_to_type or "OTHER",
                    "count": 0,
                    "documents": set(),
                }
            node_map[tgt]["count"] += 1
            node_map[tgt]["documents"].add(triple.document_id)

            # Accumulate edge weight
            edge_key = (src, rel, tgt)
            edge_counter[edge_key] += 1

        # Finalise nodes
        final_nodes = []
        for node in node_map.values():
            node["documents"] = sorted(list(node["documents"]))
            final_nodes.append(node)

        final_nodes.sort(key=lambda n: n["count"], reverse=True)

        # Build edges (top 60 by weight)
        sorted_edges = sorted(
            edge_counter.items(),
            key=lambda x: x[1],
            reverse=True,
        )[:60]

        final_edges = []
        for (src, rel, tgt), weight in sorted_edges:
            final_edges.append(
                {
                    "id": f"{src}--{rel}--{tgt}",
                    "source": src,
                    "target": tgt,
                    "relation": rel.replace("_", " "),
                    "weight": weight,
                }
            )

        return {"nodes": final_nodes, "edges": final_edges}

    @staticmethod
    def get_node_details(db: Session, concept: str):
        """
        Returns all triples that mention this entity (as source or target),
        along with document info.
        """
        concept_clean = concept.strip()

        triples = (
            db.query(GraphTriple)
            .filter(
                (GraphTriple.entity_from == concept_clean)
                | (GraphTriple.entity_to == concept_clean)
            )
            .all()
        )

        occurrences = []
        seen = set()

        for triple in triples:
            doc = triple.document
            if not doc:
                continue

            key = (doc.title, triple.relation, triple.entity_from, triple.entity_to)
            if key in seen:
                continue
            seen.add(key)

            occurrences.append(
                {
                    "document": doc.title,
                    "page": 1,
                    "section": f"{triple.entity_from} → {triple.relation.replace('_', ' ')} → {triple.entity_to}",
                }
            )

        return {
            "concept": concept_clean,
            "occurrences": occurrences,
        }