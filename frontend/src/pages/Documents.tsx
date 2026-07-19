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
    LinearProgress,
    Snackbar,
    Alert,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
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
    const [ingesting, setIngesting] = useState(false);
    const [toast, setToast] = useState<{ open: boolean; message: string; severity: "success" | "error" }>({
        open: false,
        message: "",
        severity: "success",
    });
    const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; id: number | null; filename: string }>({
        open: false,
        id: null,
        filename: "",
    });

    async function loadDocuments() {
        const data = await getDocuments();
        setDocuments(data);
    }

    useEffect(() => {
        loadDocuments();
    }, []);

    async function handleUpload() {
        if (!selectedFile) {
            setToast({ open: true, message: "Please choose a file first.", severity: "error" });
            return;
        }

        setIngesting(true);
        try {
            await uploadDocument(selectedFile, documentType);
            setSelectedFile(null);
            await loadDocuments();
            setToast({ open: true, message: "Ingestion complete", severity: "success" });
        } catch (error: any) {
            console.error(error);
            setToast({ open: true, message: error?.response?.data?.detail ?? "Failed to upload document.", severity: "error" });
        } finally {
            setIngesting(false);
        }
    }

    function openDeleteDialog(id: number, filename: string) {
        setDeleteDialog({ open: true, id, filename });
    }

    async function handleDeleteConfirm() {
        if (deleteDialog.id === null) return;

        setDeleteDialog({ open: false, id: null, filename: "" });

        try {
            await deleteDocument(deleteDialog.id);
            await loadDocuments();
            setToast({ open: true, message: "Document deleted successfully.", severity: "success" });
        } catch (error: any) {
            console.error(error);
            setToast({ open: true, message: error?.response?.data?.detail ?? "Failed to delete document.", severity: "error" });
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
                        disabled={ingesting}
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
                        disabled={ingesting}
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
                        {selectedFile ? "Change File" : "Choose File (PDF / Image)"}
                        <input
                            hidden
                            type="file"
                            accept=".pdf,.png,.jpg,.jpeg"
                            disabled={ingesting}
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
                        disabled={!selectedFile || ingesting}
                        sx={{
                            ml: "auto",
                            py: 1.5,
                            px: 4,
                            fontWeight: 700,
                            borderRadius: "24px",
                        }}
                    >
                        {ingesting ? "Ingesting..." : "Ingest File"}
                    </Button>
                </Box>
                {ingesting && (
                    <Box sx={{ width: "100%", mt: 3 }}>
                        <LinearProgress color="secondary" sx={{ borderRadius: 2, height: 6 }} />
                        <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.6)", mt: 1, display: "block", textAlign: "center" }}>
                            Ingesting document and extracting knowledge graph relationships...
                        </Typography>
                    </Box>
                )}
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
                                            onClick={() => openDeleteDialog(doc.id, doc.original_filename)}
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
            <Snackbar
                open={toast.open}
                autoHideDuration={4000}
                onClose={() => setToast((prev) => ({ ...prev, open: false }))}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            >
                <Alert
                    onClose={() => setToast((prev) => ({ ...prev, open: false }))}
                    severity={toast.severity}
                    sx={{ width: "100%", borderRadius: 2 }}
                >
                    {toast.message}
                </Alert>
            </Snackbar>

            <Dialog
                open={deleteDialog.open}
                onClose={() => setDeleteDialog({ open: false, id: null, filename: "" })}
                slotProps={{
                    paper: {
                        sx: {
                            borderRadius: 4,
                            bgcolor: "#1e1e2e",
                            border: "1px solid rgba(255,255,255,0.08)",
                        }
                    }
                }}
            >
                <DialogTitle sx={{ fontWeight: 700, color: "#ffffff" }}>
                    Delete Document
                </DialogTitle>
                <DialogContent>
                    <DialogContentText sx={{ color: "rgba(255,255,255,0.7)" }}>
                        Are you sure you want to delete <strong>{deleteDialog.filename}</strong>?
                        This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ pb: 3, px: 3 }}>
                    <Button
                        onClick={() => setDeleteDialog({ open: false, id: null, filename: "" })}
                        sx={{ color: "rgba(255,255,255,0.6)", borderRadius: 2 }}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleDeleteConfirm}
                        variant="contained"
                        color="error"
                        sx={{ borderRadius: 2, fontWeight: 700 }}
                    >
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </MainLayout>
    );
}