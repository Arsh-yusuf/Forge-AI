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
} from "@mui/material";

import { useEffect, useState } from "react";

import MainLayout from "../components/layout/MainLayout";

import {
    getDocuments,
    uploadDocument,
    deleteDocument,
} from "../api/documents";

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

        await uploadDocument(
            selectedFile,
            documentType
        );

        setSelectedFile(null);

        await loadDocuments();

        alert("Document uploaded successfully.");

    }

    async function handleDelete(id: number) {

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this document?"
        );

        if (!confirmDelete) return;

        await deleteDocument(id);

        await loadDocuments();

    }

    return (

        <MainLayout>

            <Typography
                variant="h4"
                mb={3}
            >

                Documents

            </Typography>

            <Paper
                sx={{
                    p: 3,
                    mb: 4,
                }}
            >

                <Typography
                    variant="h6"
                    mb={2}
                >

                    Upload New Document

                </Typography>

                <FormControl
                    fullWidth
                    sx={{ mb: 2 }}
                >

                    <InputLabel>

                        Document Type

                    </InputLabel>

                    <Select
                        value={documentType}
                        label="Document Type"
                        onChange={(e) =>
                            setDocumentType(
                                e.target.value
                            )
                        }
                    >

                        {

                            documentTypes.map((type) => (

                                <MenuItem
                                    key={type}
                                    value={type}
                                >

                                    {type.replaceAll("_", " ")}

                                </MenuItem>

                            ))

                        }

                    </Select>

                </FormControl>

                <Button
                    variant="outlined"
                    component="label"
                    sx={{ mb: 2 }}
                >

                    Choose PDF

                    <input
                        hidden
                        type="file"
                        accept=".pdf"
                        onChange={(e) => {

                            if (
                                e.target.files &&
                                e.target.files.length > 0
                            ) {

                                setSelectedFile(
                                    e.target.files[0]
                                );

                            }

                        }}
                    />

                </Button>

                {

                    selectedFile && (

                        <Typography
                            mb={2}
                        >

                            Selected File:

                            <strong>

                                {" "}
                                {selectedFile.name}

                            </strong>

                        </Typography>

                    )

                }

                <Button
                    variant="contained"
                    onClick={handleUpload}
                    disabled={!selectedFile}
                >

                    Upload

                </Button>

            </Paper>

            <Paper>

                <Table>

                    <TableHead>

                        <TableRow>

                            <TableCell>

                                File Name

                            </TableCell>

                            <TableCell>

                                Uploaded At

                            </TableCell>

                            <TableCell>

                                Action

                            </TableCell>

                        </TableRow>

                    </TableHead>

                    <TableBody>

                        {

                            documents.map((doc) => (

                                <TableRow
                                    key={doc.id}
                                >

                                    <TableCell>

                                        {doc.original_filename}

                                    </TableCell>

                                    <TableCell>

                                        {
                                            new Date(
                                                doc.uploaded_at
                                            ).toLocaleString()
                                        }

                                    </TableCell>

                                    <TableCell>

                                        <Button
                                            color="error"
                                            variant="outlined"
                                            onClick={() =>
                                                handleDelete(
                                                    doc.id
                                                )
                                            }
                                        >

                                            Delete

                                        </Button>

                                    </TableCell>

                                </TableRow>

                            ))

                        }

                    </TableBody>

                </Table>

            </Paper>

        </MainLayout>

    );

}