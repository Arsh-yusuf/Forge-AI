import dagre from "@dagrejs/dagre";
import { type Node, type Edge } from "reactflow";

const NODE_WIDTH = 160;
const NODE_HEIGHT = 48;

/**
 * Uses Dagre with LR (left-right) direction and looser spacing
 * to produce a more organic graph layout for knowledge graphs.
 */
export function getLayoutedElements(nodes: Node[], edges: Edge[]) {
    const dagreGraph = new dagre.graphlib.Graph();
    dagreGraph.setDefaultEdgeLabel(() => ({}));

    dagreGraph.setGraph({
        rankdir: "LR",      // Left-right feels more natural for knowledge graphs
        ranksep: 120,        // More horizontal breathing room
        nodesep: 55,         // Vertical spacing between nodes on the same rank
        edgesep: 20,
        marginx: 40,
        marginy: 40,
    });

    nodes.forEach((node) => {
        dagreGraph.setNode(node.id, {
            width: NODE_WIDTH,
            height: NODE_HEIGHT,
        });
    });

    edges.forEach((edge) => {
        dagreGraph.setEdge(edge.source, edge.target);
    });

    dagre.layout(dagreGraph);

    const layoutedNodes = nodes.map((node) => {
        const position = dagreGraph.node(node.id);
        return {
            ...node,
            position: {
                x: position.x - NODE_WIDTH / 2,
                y: position.y - NODE_HEIGHT / 2,
            },
        };
    });

    return { nodes: layoutedNodes, edges };
}