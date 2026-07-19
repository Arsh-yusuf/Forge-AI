import { useState } from "react";
import {
    Alert,
    Box,
    Button,
    Card,
    Chip,
    CircularProgress,
    Grid,
    LinearProgress,
    TextField,
    Typography,
} from "@mui/material";
import { AlertTriangle, CheckCircle2, Wrench, Zap } from "lucide-react";
import MainLayout from "../components/layout/MainLayout";
import { runRcaDiagnostics } from "../api/maintenance";

interface RcaResult {
    problem_statement: string;
    confidence_score: number;
    five_whys: string[];
    root_cause: string;
    recommendations: string[];
    sources: string[];
}

const EXAMPLE_SYMPTOMS = [
    "Conveyor belt misalignment causing product spillage",
    "Main pump abnormal vibration and noise",
    "Boiler pressure drop during peak operations",
    "Hydraulic press cylinder slow response",
    "Cooling tower fan motor overheating",
];

export default function Maintenance() {
    const [symptom, setSymptom] = useState("");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<RcaResult | null>(null);
    const [errorMsg, setErrorMsg] = useState("");
    const [checkedRecs, setCheckedRecs] = useState<Set<number>>(new Set());

    async function handleRunRca() {
        if (!symptom.trim()) return;
        setLoading(true);
        setErrorMsg("");
        setResult(null);
        setCheckedRecs(new Set());

        try {
            const data = await runRcaDiagnostics(symptom.trim());
            setResult(data);
        } catch (err: any) {
            setErrorMsg(
                err?.response?.data?.detail ?? "RCA analysis failed. Please try again."
            );
        } finally {
            setLoading(false);
        }
    }

    function toggleRec(idx: number) {
        setCheckedRecs(prev => {
            const next = new Set(prev);
            next.has(idx) ? next.delete(idx) : next.add(idx);
            return next;
        });
    }

    const scoreColor = (score: number) =>
        score >= 75 ? "#4ade80" : score >= 50 ? "#fbbf24" : "#f87171";

    const whyColors = [
        "rgba(168, 85, 247, 0.15)",
        "rgba(139, 92, 246, 0.12)",
        "rgba(99, 102, 241, 0.12)",
        "rgba(59, 130, 246, 0.12)",
        "rgba(6, 182, 212, 0.15)",
    ];
    const whyBorders = [
        "#a855f7", "#8b5cf6", "#6366f1", "#3b82f6", "#06b6d4"
    ];

    return (
        <MainLayout>
            {/* Page Header */}
            <Box sx={{ mb: 4 }}>
                <Typography
                    variant="h4"
                    sx={{
                        fontWeight: 800,
                        background: "linear-gradient(135deg, #ffffff 0%, #06b6d4 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        mb: 1,
                    }}
                >
                    Maintenance Intelligence & RCA
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    Describe a failure or symptom. The agent retrieves relevant manuals and incident records from your knowledge base to trace root causes using the 5 Whys methodology.
                </Typography>
            </Box>

            {/* Input Panel */}
            <Card
                elevation={0}
                sx={{
                    p: 3,
                    mb: 4,
                    borderRadius: 4,
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    background: "rgba(17, 25, 40, 0.5)",
                    backdropFilter: "blur(20px)",
                }}
            >
                <TextField
                    fullWidth
                    multiline
                    rows={2}
                    placeholder="Describe the failure or symptom (e.g. 'Main pump abnormal vibration and noise during startup')"
                    value={symptom}
                    onChange={(e) => setSymptom(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleRunRca();
                        }
                    }}
                    sx={{
                        mb: 2,
                        "& .MuiOutlinedInput-root": {
                            borderRadius: 2,
                            fontSize: "0.95rem",
                        }
                    }}
                    slotProps={{
                        inputLabel: { style: { color: "rgba(255,255,255,0.5)" } }
                    }}
                />

                {/* Quick example chips */}
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2.5 }}>
                    {EXAMPLE_SYMPTOMS.map((s) => (
                        <Chip
                            key={s}
                            label={s}
                            size="small"
                            onClick={() => setSymptom(s)}
                            sx={{
                                cursor: "pointer",
                                bgcolor: "rgba(255,255,255,0.04)",
                                border: "1px solid rgba(255,255,255,0.08)",
                                color: "rgba(255,255,255,0.6)",
                                fontSize: "0.75rem",
                                "&:hover": {
                                    bgcolor: "rgba(168, 85, 247, 0.12)",
                                    borderColor: "rgba(168, 85, 247, 0.4)",
                                    color: "#c4b5fd",
                                },
                            }}
                        />
                    ))}
                </Box>

                <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                    <Button
                        variant="contained"
                        disabled={!symptom.trim() || loading}
                        onClick={handleRunRca}
                        startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <Zap size={16} />}
                        sx={{
                            px: 3,
                            py: 1.2,
                            fontWeight: 700,
                            borderRadius: "24px",
                            boxShadow: "0 4px 15px rgba(168, 85, 247, 0.25)",
                            minWidth: 180,
                        }}
                    >
                        {loading ? "Analyzing..." : "Run RCA Diagnostics"}
                    </Button>
                    {result && (
                        <Typography variant="body2" sx={{ color: "text.secondary" }}>
                            Analysis complete — scroll down to view results
                        </Typography>
                    )}
                </Box>

                {errorMsg && (
                    <Alert severity="error" sx={{ mt: 2, borderRadius: 2 }}>
                        {errorMsg}
                    </Alert>
                )}
            </Card>

            {/* Loading State */}
            {loading && (
                <Card
                    elevation={0}
                    sx={{
                        p: 5,
                        borderRadius: 4,
                        border: "1px solid rgba(255, 255, 255, 0.08)",
                        background: "rgba(17, 25, 40, 0.3)",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        textAlign: "center",
                    }}
                >
                    <CircularProgress color="secondary" size={52} sx={{ mb: 3 }} />
                    <Typography variant="h6" sx={{ color: "#fff", fontWeight: 700, mb: 1 }}>
                        Tracing Root Cause
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3, maxWidth: 480 }}>
                        Retrieving relevant maintenance manuals, inspection records, and incident reports from the knowledge base…
                    </Typography>
                    <Box sx={{ width: "60%" }}>
                        <LinearProgress color="secondary" />
                    </Box>
                </Card>
            )}

            {/* Results */}
            {!loading && result && (
                <Grid container spacing={3}>
                    {/* Confidence + Problem */}
                    <Grid size={{ xs: 12 }}>
                        <Card
                            elevation={0}
                            sx={{
                                p: 3,
                                borderRadius: 4,
                                border: "1px solid rgba(255, 255, 255, 0.08)",
                                background: "rgba(17, 25, 40, 0.5)",
                                display: "flex",
                                gap: 3,
                                alignItems: "center",
                                flexWrap: "wrap",
                            }}
                        >
                            <Box sx={{ position: "relative", display: "inline-flex", flexShrink: 0 }}>
                                <CircularProgress
                                    variant="determinate"
                                    value={result.confidence_score}
                                    size={88}
                                    thickness={6}
                                    sx={{ color: scoreColor(result.confidence_score) }}
                                />
                                <Box sx={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    <Typography variant="h6" sx={{ color: "#fff", fontWeight: 800 }}>
                                        {result.confidence_score}%
                                    </Typography>
                                </Box>
                            </Box>
                            <Box sx={{ flex: 1 }}>
                                <Typography variant="caption" sx={{ color: "text.secondary", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                                    Diagnostic Confidence
                                </Typography>
                                <Typography variant="h6" sx={{ color: "#fff", fontWeight: 700, mt: 0.5, mb: 0.5 }}>
                                    Problem Statement
                                </Typography>
                                <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.75)" }}>
                                    {result.problem_statement}
                                </Typography>
                            </Box>
                        </Card>
                    </Grid>

                    {/* 5 Whys Timeline */}
                    <Grid size={{ xs: 12, md: 7 }}>
                        <Card
                            elevation={0}
                            sx={{
                                p: 3,
                                borderRadius: 4,
                                border: "1px solid rgba(255, 255, 255, 0.08)",
                                background: "rgba(17, 25, 40, 0.5)",
                            }}
                        >
                            <Typography variant="h6" sx={{ fontWeight: 700, color: "#fff", mb: 3, display: "flex", alignItems: "center", gap: 1 }}>
                                <AlertTriangle size={18} color="#fbbf24" />
                                5 Whys Root Cause Chain
                            </Typography>

                            <Box sx={{ display: "flex", flexDirection: "column", gap: 0 }}>
                                {result.five_whys.map((why, idx) => (
                                    <Box key={idx} sx={{ display: "flex", alignItems: "stretch" }}>
                                        {/* Connector line column */}
                                        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mr: 2, width: 24, flexShrink: 0 }}>
                                            <Box
                                                sx={{
                                                    width: 24,
                                                    height: 24,
                                                    borderRadius: "50%",
                                                    bgcolor: whyBorders[idx],
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    flexShrink: 0,
                                                    zIndex: 1,
                                                    fontSize: "0.7rem",
                                                    fontWeight: 800,
                                                    color: "#fff",
                                                }}
                                            >
                                                {idx + 1}
                                            </Box>
                                            {idx < 4 && (
                                                <Box
                                                    sx={{
                                                        width: 2,
                                                        flex: 1,
                                                        background: `linear-gradient(to bottom, ${whyBorders[idx]}, ${whyBorders[idx + 1]})`,
                                                        minHeight: 16,
                                                        my: 0.5,
                                                    }}
                                                />
                                            )}
                                        </Box>

                                        {/* Content */}
                                        <Box
                                            sx={{
                                                flex: 1,
                                                mb: idx < 4 ? 0 : 0,
                                                pb: 2,
                                                pt: 0.2,
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    p: 1.5,
                                                    borderRadius: 2,
                                                    bgcolor: whyColors[idx],
                                                    border: `1px solid ${whyBorders[idx]}30`,
                                                    mb: idx < 4 ? 1 : 0,
                                                }}
                                            >
                                                <Typography
                                                    variant="body2"
                                                    sx={{
                                                        color: "rgba(255,255,255,0.85)",
                                                        fontSize: "0.845rem",
                                                        lineHeight: 1.5,
                                                    }}
                                                >
                                                    {why}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Box>
                                ))}
                            </Box>

                            {/* Root cause callout */}
                            <Box
                                sx={{
                                    mt: 1,
                                    p: 2,
                                    borderRadius: 2,
                                    background: "rgba(239, 68, 68, 0.08)",
                                    border: "1px solid rgba(239, 68, 68, 0.25)",
                                }}
                            >
                                <Typography variant="caption" sx={{ color: "#f87171", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em" }}>
                                    ⚠ Root Cause Identified
                                </Typography>
                                <Typography variant="body2" sx={{ color: "#fca5a5", mt: 0.5 }}>
                                    {result.root_cause}
                                </Typography>
                            </Box>
                        </Card>
                    </Grid>

                    {/* Recommendations + Sources */}
                    <Grid size={{ xs: 12, md: 5 }}>
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                            {/* Recommendations */}
                            <Card
                                elevation={0}
                                sx={{
                                    p: 3,
                                    borderRadius: 4,
                                    border: "1px solid rgba(255, 255, 255, 0.08)",
                                    background: "rgba(17, 25, 40, 0.5)",
                                }}
                            >
                                <Typography variant="h6" sx={{ fontWeight: 700, color: "#fff", mb: 2.5, display: "flex", alignItems: "center", gap: 1 }}>
                                    <Wrench size={18} color="#a855f7" />
                                    Action Items
                                </Typography>

                                <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                                    {result.recommendations.map((rec, idx) => (
                                        <Box
                                            key={idx}
                                            onClick={() => toggleRec(idx)}
                                            sx={{
                                                display: "flex",
                                                alignItems: "flex-start",
                                                gap: 1.5,
                                                p: 1.5,
                                                borderRadius: 2,
                                                cursor: "pointer",
                                                bgcolor: checkedRecs.has(idx)
                                                    ? "rgba(34, 197, 94, 0.08)"
                                                    : "rgba(255,255,255,0.03)",
                                                border: checkedRecs.has(idx)
                                                    ? "1px solid rgba(34, 197, 94, 0.25)"
                                                    : "1px solid rgba(255,255,255,0.06)",
                                                transition: "all 0.2s ease",
                                                "&:hover": {
                                                    bgcolor: checkedRecs.has(idx)
                                                        ? "rgba(34, 197, 94, 0.12)"
                                                        : "rgba(255,255,255,0.05)",
                                                },
                                            }}
                                        >
                                            <Box sx={{ flexShrink: 0, mt: 0.3 }}>
                                                <CheckCircle2
                                                    size={18}
                                                    color={checkedRecs.has(idx) ? "#4ade80" : "rgba(255,255,255,0.2)"}
                                                />
                                            </Box>
                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    color: checkedRecs.has(idx)
                                                        ? "rgba(255,255,255,0.45)"
                                                        : "rgba(255,255,255,0.8)",
                                                    textDecoration: checkedRecs.has(idx) ? "line-through" : "none",
                                                    fontSize: "0.845rem",
                                                    transition: "all 0.2s ease",
                                                }}
                                            >
                                                {rec}
                                            </Typography>
                                        </Box>
                                    ))}
                                </Box>
                            </Card>

                            {/* Sources */}
                            {result.sources && result.sources.length > 0 && (
                                <Card
                                    elevation={0}
                                    sx={{
                                        p: 3,
                                        borderRadius: 4,
                                        border: "1px solid rgba(255, 255, 255, 0.08)",
                                        background: "rgba(17, 25, 40, 0.5)",
                                    }}
                                >
                                    <Typography variant="subtitle2" sx={{ color: "rgba(255,255,255,0.5)", mb: 1.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", fontSize: "0.72rem" }}>
                                        Knowledge Base Sources
                                    </Typography>
                                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                                        {result.sources.map((src, idx) => (
                                            <Chip
                                                key={idx}
                                                label={src}
                                                size="small"
                                                sx={{
                                                    bgcolor: "rgba(6, 182, 212, 0.08)",
                                                    border: "1px solid rgba(6, 182, 212, 0.2)",
                                                    color: "#22d3ee",
                                                    fontSize: "0.72rem",
                                                }}
                                            />
                                        ))}
                                    </Box>
                                </Card>
                            )}
                        </Box>
                    </Grid>
                </Grid>
            )}
        </MainLayout>
    );
}
