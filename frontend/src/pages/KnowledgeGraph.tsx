import { useEffect, useState } from "react";

import {
    Box,
    Typography,
    CircularProgress,
} from "@mui/material";

import MainLayout from "../components/layout/MainLayout";

import ReactFlow, {
    Background,
    Controls,
    MiniMap,
    type Node,
    type Edge,
} from "reactflow";

import "reactflow/dist/style.css";

import { getGraph, getNodeDetails } from "../api/graph";

import { getLayoutedElements } from "../utils/graphLayout";

import NodeDrawer from "../components/graph/NodeDrawer";

export default function KnowledgeGraph() {

    const [nodes, setNodes] = useState<Node[]>([]);

    const [edges, setEdges] = useState<Edge[]>([]);

    const [loading, setLoading] = useState(true);

    const [drawerOpen, setDrawerOpen] = useState(false);

    const [nodeDetails, setNodeDetails] = useState<any>(null);

    useEffect(() => {

        loadGraph();

    }, []);

    async function loadGraph() {

        try {

            const data = await getGraph();

            const graphNodes: Node[] = data.nodes.map((node: any) => ({

                id: node.id,

                data: {
                    label: node.label,
                },

                position: {
                    x: 0,
                    y: 0,
                },

                style: {

                    background: "#1976d2",

                    color: "white",

                    borderRadius: 10,

                    border: "none",

                    padding: 8,

                    fontWeight: 600,

                    minWidth: 120,

                    textAlign: "center",

                },

            }));

            const graphEdges: Edge[] = data.edges.map((edge: any) => ({

                id: edge.id,

                source: edge.source,

                target: edge.target,

                animated: false,

            }));

            const layout = getLayoutedElements(

                graphNodes,

                graphEdges

            );

            setNodes(layout.nodes);

            setEdges(layout.edges);

        }

        catch (error) {

            console.error(error);

        }

        finally {

            setLoading(false);

        }

    }

    async function handleNodeClick(

        _: any,

        node: any,

    ) {

        try {

            const data = await getNodeDetails(

                node.id

            );

            setNodeDetails(data);

            setDrawerOpen(true);

        }

        catch (error) {

            console.error(error);

        }

    }

    return (

        <MainLayout>

            <Typography

                variant="h4"

                mb={3}

            >

                Knowledge Graph

            </Typography>

            <Box

                sx={{

                    width: "100%",

                    height: "75vh",

                    bgcolor: "white",

                    borderRadius: 2,

                    border: "1px solid #ddd",

                }}

            >

                {

                    loading

                        ?

                        <Box

                            display="flex"

                            justifyContent="center"

                            alignItems="center"

                            height="100%"

                        >

                            <CircularProgress />

                        </Box>

                        :

                        <ReactFlow

                            nodes={nodes}

                            edges={edges}

                            fitView

                            onNodeClick={handleNodeClick}

                        >

                            <Background />

                            <MiniMap />

                            <Controls />

                        </ReactFlow>

                }

            </Box>

            <NodeDrawer

                open={drawerOpen}

                onClose={() => setDrawerOpen(false)}

                data={nodeDetails}

            />

        </MainLayout>

    );

}