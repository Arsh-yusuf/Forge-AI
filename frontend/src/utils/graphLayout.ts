import dagre from "@dagrejs/dagre";
import { type Node, type Edge } from "reactflow";

const dagreGraph = new dagre.graphlib.Graph();

dagreGraph.setDefaultEdgeLabel(() => ({}));

const NODE_WIDTH = 180;
const NODE_HEIGHT = 60;

export function getLayoutedElements(
    nodes: Node[],
    edges: Edge[]
) {

    dagreGraph.setGraph({

        rankdir: "TB",

        ranksep: 80,

        nodesep: 60,

    });

    nodes.forEach((node) => {

        dagreGraph.setNode(node.id, {

            width: NODE_WIDTH,

            height: NODE_HEIGHT,

        });

    });

    edges.forEach((edge) => {

        dagreGraph.setEdge(

            edge.source,

            edge.target

        );

    });

    dagre.layout(dagreGraph);

    const layoutedNodes = nodes.map((node) => {

        const position = dagreGraph.node(node.id);

        node.position = {

            x: position.x - NODE_WIDTH / 2,

            y: position.y - NODE_HEIGHT / 2,

        };

        return node;

    });

    return {

        nodes: layoutedNodes,

        edges,

    };

}