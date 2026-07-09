import { useEffect, useState, useCallback } from "react";

import {
    Box,
    Typography,
    CircularProgress,
    Chip,
} from "@mui/material";

import MainLayout from "../components/layout/MainLayout";

import ReactFlow, {
    Background,
    Controls,
    MiniMap,
    MarkerType,
    EdgeLabelRenderer,
    BaseEdge,
    getStraightPath,
    type Node,
    type Edge,
    type EdgeTypes,
    type EdgeProps,
} from "reactflow";

import "reactflow/dist/style.css";

import { getGraph, getNodeDetails } from "../api/graph";
import { getLayoutedElements } from "../utils/graphLayout";
import NodeDrawer from "../components/graph/NodeDrawer";

// ─── Entity type colour palette ───────────────────────────────────────────────
const ENTITY_COLORS: Record<string, { bg: string; border: string; text: string }> = {
    EQUIPMENT: { bg: "rgba(6, 182, 212, 0.18)", border: "rgba(6, 182, 212, 0.7)", text: "#22d3ee" },
    MATERIAL:  { bg: "rgba(34, 197, 94, 0.18)",  border: "rgba(34, 197, 94, 0.7)",  text: "#4ade80" },
    PROCESS:   { bg: "rgba(168, 85, 247, 0.18)", border: "rgba(168, 85, 247, 0.7)", text: "#c084fc" },
    PERSON:    { bg: "rgba(251, 191, 36, 0.18)", border: "rgba(251, 191, 36, 0.7)", text: "#fbbf24" },
    LOCATION:  { bg: "rgba(249, 115, 22, 0.18)", border: "rgba(249, 115, 22, 0.7)", text: "#fb923c" },
    STANDARD:  { bg: "rgba(99, 102, 241, 0.18)", border: "rgba(99, 102, 241, 0.7)", text: "#818cf8" },
    OTHER:     { bg: "rgba(100, 116, 139, 0.18)",border: "rgba(100, 116, 139, 0.5)",text: "#94a3b8" },
};

function getEntityColor(type: string) {
    return ENTITY_COLORS[type?.toUpperCase()] ?? ENTITY_COLORS.OTHER;
}

// ─── Custom labelled edge ──────────────────────────────────────────────────────
function LabelledEdge({
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    data,
    markerEnd,
    style,
}: EdgeProps) {
    const [edgePath, labelX, labelY] = getStraightPath({
        sourceX,
        sourceY,
        targetX,
        targetY,
    });

    return (
        <>
            <BaseEdge
                id={id}
                path={edgePath}
                markerEnd={markerEnd}
                style={style}
            />
            <EdgeLabelRenderer>
                <Box
                    style={{
                        position: "absolute",
                        transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
                        pointerEvents: "all",
                    }}
                    className="nodrag nopan"
                >
                    <Typography
                        sx={{
                            fontSize: "0.65rem",
                            fontWeight: 600,
                            color: "rgba(255,255,255,0.55)",
                            background: "rgba(9, 13, 22, 0.85)",
                            border: "1px solid rgba(255,255,255,0.08)",
                            borderRadius: "6px",
                            px: 0.8,
                            py: 0.2,
                            whiteSpace: "nowrap",
                            backdropFilter: "blur(4px)",
                        }}
                    >
                        {data?.relation}
                    </Typography>
                </Box>
            </EdgeLabelRenderer>
        </>
    );
}

const edgeTypes: EdgeTypes = { labelled: LabelledEdge };

// ─── Legend ───────────────────────────────────────────────────────────────────
const LEGEND_ITEMS = [
    { label: "Equipment", type: "EQUIPMENT" },
    { label: "Material",  type: "MATERIAL"  },
    { label: "Process",   type: "PROCESS"   },
    { label: "Standard",  type: "STANDARD"  },
    { label: "Location",  type: "LOCATION"  },
    { label: "Other",     type: "OTHER"     },
];

// ─── Page component ───────────────────────────────────────────────────────────
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

            const graphNodes: Node[] = data.nodes.map((node: any) => {
                const colors = getEntityColor(node.entity_type);
                return {
                    id: node.id,
                    data: {
                        label: node.label,
                        entity_type: node.entity_type,
                    },
                    position: { x: 0, y: 0 },
                    style: {
                        background: colors.bg,
                        color: colors.text,
                        borderRadius: "10px",
                        border: `1px solid ${colors.border}`,
                        padding: "8px 14px",
                        fontWeight: 600,
                        minWidth: 120,
                        textAlign: "center",
                        boxShadow: `0 0 12px ${colors.border}55`,
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                        fontSize: "0.82rem",
                        cursor: "pointer",
                    },
                };
            });

            const graphEdges: Edge[] = data.edges.map((edge: any) => ({
                id: edge.id,
                source: edge.source,
                target: edge.target,
                type: "labelled",
                animated: false,
                data: { relation: edge.relation },
                style: {
                    stroke: "rgba(168, 85, 247, 0.35)",
                    strokeWidth: 1.5,
                },
                markerEnd: {
                    type: MarkerType.ArrowClosed,
                    color: "rgba(168, 85, 247, 0.5)",
                    width: 12,
                    height: 12,
                },
            }));

            const layout = getLayoutedElements(graphNodes, graphEdges);
            setNodes(layout.nodes);
            setEdges(layout.edges);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    const handleNodeClick = useCallback(async (_: any, node: any) => {
        try {
            const data = await getNodeDetails(node.id);
            setNodeDetails(data);
            setDrawerOpen(true);
        } catch (error) {
            console.error(error);
        }
    }, []);

    return (
        <MainLayout>
            <Box sx={{ mb: 4 }}>
                <Typography
                    variant="h4"
                    sx={{
                        fontWeight: 800,
                        background: "linear-gradient(135deg, #ffffff 0%, #a855f7 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        mb: 1,
                    }}
                >
                    Knowledge Graph
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary", mb: 3 }}>
                    LLM-extracted entity relationships from your documents. Click any node for details.
                </Typography>

                {/* Legend */}
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                    {LEGEND_ITEMS.map((item) => {
                        const colors = getEntityColor(item.type);
                        return (
                            <Chip
                                key={item.type}
                                label={item.label}
                                size="small"
                                sx={{
                                    bgcolor: colors.bg,
                                    color: colors.text,
                                    border: `1px solid ${colors.border}`,
                                    fontWeight: 600,
                                    fontSize: "0.72rem",
                                }}
                            />
                        );
                    })}
                </Box>
            </Box>

            <Box
                sx={{
                    width: "100%",
                    height: "68vh",
                    bgcolor: "rgba(9, 13, 22, 0.25)",
                    borderRadius: 4,
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    overflow: "hidden",
                    position: "relative",
                }}
            >
                {loading ? (
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                            height: "100%",
                            gap: 2,
                        }}
                    >
                        <CircularProgress color="primary" />
                        <Typography variant="body2" color="text.secondary">
                            Building knowledge graph…
                        </Typography>
                    </Box>
                ) : nodes.length === 0 ? (
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                            height: "100%",
                            gap: 1,
                        }}
                    >
                        <Typography variant="h6" color="text.secondary">
                            No graph data yet
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Upload documents to automatically extract relationships.
                        </Typography>
                    </Box>
                ) : (
                    <ReactFlow
                        nodes={nodes}
                        edges={edges}
                        edgeTypes={edgeTypes}
                        fitView
                        fitViewOptions={{ padding: 0.15 }}
                        onNodeClick={handleNodeClick}
                        style={{ background: "transparent" }}
                        minZoom={0.3}
                    >
                        <Background
                            color="rgba(255, 255, 255, 0.04)"
                            gap={24}
                        />
                        <MiniMap
                            style={{
                                background: "rgba(17, 25, 40, 0.9)",
                                border: "1px solid rgba(255, 255, 255, 0.08)",
                                borderRadius: "8px",
                            }}
                            maskColor="rgba(0, 0, 0, 0.5)"
                            nodeColor={(node) => {
                                const colors = getEntityColor(node.data?.entity_type);
                                return colors.border;
                            }}
                        />
                        <Controls
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "4px",
                                background: "rgba(17, 25, 40, 0.9)",
                                border: "1px solid rgba(255, 255, 255, 0.08)",
                                borderRadius: "8px",
                                padding: "4px",
                            }}
                        />
                    </ReactFlow>
                )}
            </Box>

            <NodeDrawer
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                data={nodeDetails}
            />
        </MainLayout>
    );
}