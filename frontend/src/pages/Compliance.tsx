import { useEffect, useState } from "react";
import {
    Alert,
    Box,
    Button,
    Card,
    CircularProgress,
    FormControl,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    Chip,
    Grid,
    LinearProgress,
} from "@mui/material";
import MainLayout from "../components/layout/MainLayout";
import { getDocuments } from "../api/documents";
import { runComplianceAudit } from "../api/compliance";
import { ShieldCheck, ShieldAlert, ShieldX, Play } from "lucide-react";

interface Checkpoint {
    category: string;
    requirement: string;
    status: "COMPLIANT" | "GAP" | "CRITICAL_MISSING";
    findings: string;
    remediation: string;
}

interface AuditResult {
    compliance_score: number;
    summary: string;
    checkpoints: Checkpoint[];
}

export default function Compliance() {
    const [documents, setDocuments] = useState<any[]>([]);
    const [selectedDocId, setSelectedDocId] = useState<number | string>("");
    const [auditLoading, setAuditLoading] = useState(false);
    const [auditResult, setAuditResult] = useState<AuditResult | null>(null);
    const [errorMsg, setErrorMsg] = useState("");

    async function loadDocuments() {
        try {
            const data = await getDocuments();
            setDocuments(data);
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        loadDocuments();
    }, []);

    async function handleStartAudit() {
        if (!selectedDocId) return;
        setAuditLoading(true);
        setErrorMsg("");
        setAuditResult(null);

        try {
            const result = await runComplianceAudit(Number(selectedDocId));
            setAuditResult(result);
        } catch (error: any) {
            console.error(error);
            setErrorMsg(
                error?.response?.data?.detail ?? 
                "An error occurred during the compliance audit. Please verify the document has readable text."
            );
        } finally {
            setAuditLoading(false);
        }
    }

    const getStatusChip = (status: Checkpoint["status"]) => {
        switch (status) {
            case "COMPLIANT":
                return (
                    <Chip
                        icon={<ShieldCheck size={14} color="#22d3ee" />}
                        label="COMPLIANT"
                        size="small"
                        sx={{
                            bgcolor: "rgba(34, 197, 94, 0.15)",
                            color: "#4ade80",
                            border: "1px solid rgba(34, 197, 94, 0.3)",
                            fontWeight: 600,
                            fontSize: "0.72rem"
                        }}
                    />
                );
            case "GAP":
                return (
                    <Chip
                        icon={<ShieldAlert size={14} color="#fbbf24" />}
                        label="GAP DETECTED"
                        size="small"
                        sx={{
                            bgcolor: "rgba(245, 158, 11, 0.15)",
                            color: "#fbbf24",
                            border: "1px solid rgba(245, 158, 11, 0.3)",
                            fontWeight: 600,
                            fontSize: "0.72rem"
                        }}
                    />
                );
            case "CRITICAL_MISSING":
                return (
                    <Chip
                        icon={<ShieldX size={14} color="#f87171" />}
                        label="CRITICAL MISSING"
                        size="small"
                        sx={{
                            bgcolor: "rgba(239, 68, 68, 0.15)",
                            color: "#f87171",
                            border: "1px solid rgba(239, 68, 68, 0.3)",
                            fontWeight: 600,
                            fontSize: "0.72rem"
                        }}
                    />
                );
        }
    };

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
                        mb: 1
                    }}
                >
                    Compliance & Safety Auditor
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    Select an operating procedure or safety policy to run a fully automated compliance audit against industrial standards.
                </Typography>
            </Box>

            <Grid container spacing={4}>
                {/* Select Card */}
                <Grid size={{ xs: 12, md: 4 }}>
                    <Card
                        elevation={0}
                        sx={{
                            p: 3,
                            borderRadius: 4,
                            border: "1px solid rgba(255, 255, 255, 0.08)",
                            background: "rgba(17, 25, 40, 0.5)",
                            backdropFilter: "blur(20px)",
                        }}
                    >
                        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: "#fff" }}>
                            Document Auditor
                        </Typography>

                        <FormControl fullWidth size="small" sx={{ mb: 3 }}>
                            <InputLabel id="audit-doc-select-label" sx={{ color: "rgba(255,255,255,0.5)" }}>
                                Select Document
                            </InputLabel>
                            <Select
                                labelId="audit-doc-select-label"
                                value={selectedDocId}
                                label="Select Document"
                                onChange={(e) => setSelectedDocId(e.target.value)}
                                sx={{
                                    color: "#fff",
                                    "& .MuiOutlinedInput-notchedOutline": {
                                        borderColor: "rgba(255, 255, 255, 0.15)",
                                    },
                                    "&:hover .MuiOutlinedInput-notchedOutline": {
                                        borderColor: "rgba(255, 255, 255, 0.3)",
                                    },
                                }}
                            >
                                {documents.length === 0 ? (
                                    <MenuItem disabled value="">
                                        No documents uploaded yet
                                    </MenuItem>
                                ) : (
                                    documents.map((doc) => (
                                        <MenuItem key={doc.id} value={doc.id}>
                                            [{doc.document_type}] {doc.title}
                                        </MenuItem>
                                    ))
                                )}
                            </Select>
                        </FormControl>

                        <Button
                            fullWidth
                            variant="contained"
                            disabled={!selectedDocId || auditLoading}
                            onClick={handleStartAudit}
                            startIcon={auditLoading ? <CircularProgress size={18} color="inherit" /> : <Play size={16} />}
                            sx={{
                                py: 1.2,
                                fontWeight: 700,
                                borderRadius: "24px",
                                boxShadow: "0 4px 15px rgba(168, 85, 247, 0.25)"
                            }}
                        >
                            {auditLoading ? "Auditing..." : "Run Safety Audit"}
                        </Button>

                        {errorMsg && (
                            <Alert severity="error" sx={{ mt: 3, borderRadius: 2, fontSize: "0.825rem" }}>
                                {errorMsg}
                            </Alert>
                        )}
                    </Card>
                </Grid>

                {/* Audit View Panel */}
                <Grid size={{ xs: 12, md: 8 }}>
                    {auditLoading && (
                        <Card
                            elevation={0}
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                height: 320,
                                borderRadius: 4,
                                border: "1px solid rgba(255, 255, 255, 0.08)",
                                background: "rgba(17, 25, 40, 0.3)",
                                p: 4,
                                textAlign: "center"
                            }}
                        >
                            <CircularProgress color="secondary" size={48} sx={{ mb: 3 }} />
                            <Typography variant="h6" sx={{ color: "#fff", mb: 1, fontWeight: 600 }}>
                                Compiling Asset Regulations
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 400 }}>
                                Analyzing document structures, safety checklists, emergency LOTO guides, and cross-referencing national industrial safety logs.
                            </Typography>
                            <Box sx={{ width: "80%", mt: 3 }}>
                                <LinearProgress color="secondary" />
                            </Box>
                        </Card>
                    )}

                    {!auditLoading && !auditResult && (
                        <Card
                            elevation={0}
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                height: 320,
                                borderRadius: 4,
                                border: "1px solid rgba(255, 255, 255, 0.08)",
                                background: "rgba(17, 25, 40, 0.3)",
                                p: 4,
                                color: "text.secondary",
                                textAlign: "center"
                            }}
                        >
                            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: "rgba(255,255,255,0.7)" }}>
                                Awaiting Safety Audit
                            </Typography>
                            <Typography variant="body2" sx={{ maxWidth: 400 }}>
                                Choose a standard operating procedure or incident sheet from the panel on the left to verify safety and regulatory compliance guidelines.
                            </Typography>
                        </Card>
                    )}

                    {!auditLoading && auditResult && (
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                            {/* Score & Summary Card */}
                            <Card
                                elevation={0}
                                sx={{
                                    p: 3,
                                    borderRadius: 4,
                                    border: "1px solid rgba(255, 255, 255, 0.08)",
                                    background: "rgba(17, 25, 40, 0.5)",
                                    backdropFilter: "blur(20px)",
                                }}
                            >
                                <Grid container spacing={3} sx={{ alignItems: "center" }}>
                                    <Grid size={{ xs: 12, sm: 3 }} sx={{ display: "flex", justifyContent: "center" }}>
                                        <Box sx={{ position: "relative", display: "inline-flex" }}>
                                            <CircularProgress
                                                variant="determinate"
                                                value={auditResult.compliance_score}
                                                size={96}
                                                thickness={6}
                                                color={auditResult.compliance_score >= 80 ? "success" : auditResult.compliance_score >= 50 ? "warning" : "error"}
                                            />
                                            <Box
                                                sx={{
                                                    top: 0,
                                                    left: 0,
                                                    bottom: 0,
                                                    right: 0,
                                                    position: "absolute",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                }}
                                            >
                                                <Typography variant="h5" component="div" sx={{ color: "#fff", fontWeight: 800 }}>
                                                    {auditResult.compliance_score}%
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 9 }}>
                                        <Typography variant="h6" sx={{ color: "#fff", fontWeight: 700, mb: 1 }}>
                                            Compliance Score
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: "text.secondary" }}>
                                            {auditResult.summary}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Card>

                            {/* Checklist Table */}
                            <TableContainer
                                component={Paper}
                                elevation={0}
                                sx={{
                                    borderRadius: 4,
                                    border: "1px solid rgba(255, 255, 255, 0.08)",
                                    background: "rgba(17, 25, 40, 0.5)",
                                }}
                            >
                                <Table>
                                    <TableHead sx={{ bgcolor: "rgba(255,255,255,0.02)" }}>
                                        <TableRow>
                                            <TableCell sx={{ color: "#fff", fontWeight: 700 }}>Requirement</TableCell>
                                            <TableCell sx={{ color: "#fff", fontWeight: 700 }}>Category</TableCell>
                                            <TableCell sx={{ color: "#fff", fontWeight: 700 }}>Status</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {auditResult.checkpoints.map((cp, idx) => (
                                            <TableRow key={idx} sx={{ "&:hover": { bgcolor: "rgba(255,255,255,0.01)" } }}>
                                                <TableCell>
                                                    <Typography sx={{ color: "#fff", fontWeight: 600, fontSize: "0.875rem" }}>
                                                        {cp.requirement}
                                                    </Typography>
                                                    <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.5, fontSize: "0.8rem" }}>
                                                        <strong>Findings:</strong> {cp.findings}
                                                    </Typography>
                                                    {cp.remediation && (
                                                        <Typography variant="body2" sx={{ color: "#fbbf24", mt: 0.5, fontSize: "0.8rem", bgcolor: "rgba(245, 158, 11, 0.06)", p: 1, borderRadius: 1.5, border: "1px dashed rgba(245, 158, 11, 0.2)" }}>
                                                            <strong>Remediation:</strong> {cp.remediation}
                                                        </Typography>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    <Chip label={cp.category} size="small" variant="outlined" sx={{ color: "rgba(255,255,255,0.6)", borderColor: "rgba(255,255,255,0.15)", fontSize: "0.72rem" }} />
                                                </TableCell>
                                                <TableCell sx={{ verticalAlign: "top", pt: 2 }}>
                                                    {getStatusChip(cp.status)}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Box>
                    )}
                </Grid>
            </Grid>
        </MainLayout>
    );
}
