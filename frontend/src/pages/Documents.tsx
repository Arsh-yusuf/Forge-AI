import {
    Box,
    Button,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Typography,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Chip,
} from "@mui/material";

import { useEffect, useState } from "react";

import MainLayout from "../components/layout/MainLayout";

import {
    getDocuments,
    uploadDocument,
    deleteDocument,
} from "../api/documents";

import { UploadCloud, Trash2, FileText } from "lucide-react";

const documentTypes = [
    "SOP",
    "MANUAL",
    "INCIDENT_REPORT",
    "MAINTENANCE_REPORT",
    "INSPECTION_REPORT",
    "WORK_ORDER",
    "SAFETY_POLICY",
    "OTHER",
];

export default function Documents() {
    const [documents, setDocuments] = useState<any[]>([]);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [documentType, setDocumentType] = useState("MANUAL");

    async function loadDocuments() {
        const data = await getDocuments();
        setDocuments(data);
    }

    useEffect(() => {
        loadDocuments();
    }, []);

    async function handleUpload() {
        if (!selectedFile) {
            alert("Please choose a PDF first.");
            return;
        }

        try {
            await uploadDocument(selectedFile, documentType);
            setSelectedFile(null);
            await loadDocuments();
            alert("Document uploaded successfully.");
        } catch (error) {
            console.error(error);
            alert("Failed to upload document.");
        }
    }

    async function handleDelete(id: number) {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this document?"
        );
        if (!confirmDelete) return;

        try {
            await deleteDocument(id);
            await loadDocuments();
        } catch (error) {
            console.error(error);
            alert("Failed to delete document.");
        }
    }

    return (
        <MainLayout>
            <Box sx={{ mb: 5 }}>
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
                    Knowledge Base Documents
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    Upload standard operating procedures, manuals, work orders, or reports to feed the AI assistant.
                </Typography>
            </Box>

            <Paper
                elevation={0}
                sx={{
                    p: 4,
                    mb: 4,
                    borderRadius: 4,
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                }}
            >
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 3, color: "#ffffff" }}>
                    Ingest New Document
                </Typography>

                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3, alignItems: "center" }}>
                    <FormControl
                        sx={{ minWidth: 260 }}
                    >
                        <InputLabel id="doc-type-label" sx={{ color: "rgba(255, 255, 255, 0.5)" }}>
                            Document Category
                        </InputLabel>
                        <Select
                            labelId="doc-type-label"
                            value={documentType}
                            label="Document Category"
                            onChange={(e) => setDocumentType(e.target.value)}
                        >
                            {documentTypes.map((type) => (
                                <MenuItem key={type} value={type}>
                                    {type.replaceAll("_", " ")}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <Button
                        variant="outlined"
                        component="label"
                        startIcon={<UploadCloud size={20} />}
                        sx={{
                            borderStyle: "dashed",
                            borderWidth: "1.5px",
                            py: 1.5,
                            px: 3,
                            borderColor: selectedFile ? "#06b6d4" : "rgba(255,255,255,0.2)",
                            background: selectedFile ? "rgba(6, 182, 212, 0.08)" : "transparent",
                            "&:hover": {
                                borderStyle: "dashed",
                                borderWidth: "1.5px",
                                borderColor: "#a855f7",
                                background: "rgba(168, 85, 247, 0.08)"
                            }
                        }}
                    >
                        {selectedFile ? "Change PDF File" : "Choose PDF File"}
                        <input
                            hidden
                            type="file"
                            accept=".pdf"
                            onChange={(e) => {
                                if (e.target.files && e.target.files.length > 0) {
                                    setSelectedFile(e.target.files[0]);
                                }
                            }}
                        />
                    </Button>

                    {selectedFile && (
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <FileText size={18} color="#a855f7" />
                            <Typography variant="body2" sx={{ fontWeight: 600, color: "rgba(255,255,255,0.9)" }}>
                                {selectedFile.name}
                            </Typography>
                            <Typography variant="caption" sx={{ color: "text.secondary" }}>
                                ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                            </Typography>
                        </Box>
                    )}

                    <Button
                        variant="contained"
                        onClick={handleUpload}
                        disabled={!selectedFile}
                        sx={{
                            ml: "auto",
                            py: 1.5,
                            px: 4,
                            fontWeight: 700,
                            borderRadius: "24px",
                        }}
                    >
                        Ingest File
                    </Button>
                </Box>
            </Paper>

            <Paper
                elevation={0}
                sx={{
                    borderRadius: 4,
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    overflow: "hidden"
                }}
            >
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>File Name</TableCell>
                            <TableCell>Category</TableCell>
                            <TableCell>Uploaded At</TableCell>
                            <TableCell align="right">Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {documents.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} align="center" sx={{ py: 6 }}>
                                    <Typography color="text.secondary" variant="body1">
                                        No documents uploaded yet.
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            documents.map((doc) => (
                                <TableRow
                                    key={doc.id}
                                    sx={{
                                        "&:hover": {
                                            backgroundColor: "rgba(255, 255, 255, 0.02)"
                                        }
                                    }}
                                >
                                    <TableCell sx={{ fontWeight: 500 }}>
                                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                                            <FileText size={18} style={{ color: "#a855f7" }} />
                                            {doc.original_filename}
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            label={doc.document_type || "OTHER"}
                                            size="small"
                                            sx={{
                                                fontWeight: 600,
                                                fontSize: "0.75rem",
                                                bgcolor: "rgba(6, 182, 212, 0.1)",
                                                color: "#22d3ee",
                                                border: "1px solid rgba(6, 182, 212, 0.2)"
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell sx={{ color: "text.secondary", fontSize: "0.875rem" }}>
                                        {new Date(doc.uploaded_at).toLocaleString()}
                                    </TableCell>
                                    <TableCell align="right">
                                        <Button
                                            color="error"
                                            variant="outlined"
                                            size="small"
                                            startIcon={<Trash2 size={14} />}
                                            onClick={() => handleDelete(doc.id)}
                                            sx={{
                                                borderRadius: "16px",
                                                borderColor: "rgba(239, 68, 68, 0.3)",
                                                color: "#f87171",
                                                "&:hover": {
                                                    borderColor: "#ef4444",
                                                    background: "rgba(239, 68, 68, 0.08)"
                                                }
                                            }}
                                        >
                                            Delete
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </Paper>
        </MainLayout>
    );
}