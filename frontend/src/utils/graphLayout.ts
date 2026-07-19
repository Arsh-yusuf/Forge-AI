import dagre from "@dagrejs/dagre";
import { type Node, type Edge } from "reactflow";

const NODE_WIDTH = 160;
const NODE_HEIGHT = 48;

function runDagreLayout(nodes: Node[], edges: Edge[]) {
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

/**
 * Uses Dagre to layout connected nodes LR, and places unconnected/isolated nodes 
 * in a neat vertical wrapping grid to the right of the main graph to respect widescreen aspect ratios.
 */
export function getLayoutedElements(nodes: Node[], edges: Edge[], hideIsolated = true) {
    const connectedNodeIds = new Set(edges.flatMap((e) => [e.source, e.target]));

    if (hideIsolated) {
        // Filter out isolated nodes completely
        const filteredNodes = nodes.filter((n) => connectedNodeIds.has(n.id));
        return runDagreLayout(filteredNodes, edges);
    }

    // Split nodes into connected and isolated
    const connectedNodes = nodes.filter((n) => connectedNodeIds.has(n.id));
    const unconnectedNodes = nodes.filter((n) => !connectedNodeIds.has(n.id));

    // Layout the connected nodes first
    const { nodes: layoutedConnected } = runDagreLayout(connectedNodes, edges);

    // Calculate bounding box of connected graph to place unconnected grid to the right of it
    let maxX = 100;
    layoutedConnected.forEach((n) => {
        if (n.position.x > maxX) {
            maxX = n.position.x;
        }
    });

    const startX = maxX + 220; // Place grid 220px to the right of the rightmost node
    const rows = 6;            // Limit vertical stack size to 6 nodes per column
    const gridSpacingX = 200;
    const gridSpacingY = 70;

    const layoutedUnconnected = unconnectedNodes.map((node, index) => {
        const col = Math.floor(index / rows);
        const row = index % rows;
        return {
            ...node,
            position: {
                x: startX + col * gridSpacingX,
                y: row * gridSpacingY + 40,
            },
        };
    });

    return {
        nodes: [...layoutedConnected, ...layoutedUnconnected],
        edges,
    };
}