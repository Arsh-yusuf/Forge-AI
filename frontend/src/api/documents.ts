import api from "./api";

export async function getDocuments() {
    const response = await api.get("/documents");
    return response.data.documents;
}

export async function uploadDocument(
    file: File,
    documentType: string
) {
    const form = new FormData();

    form.append("file", file);
    form.append("document_type", documentType);

    const response = await api.post(
        "/documents/upload",
        form
    );

    return response.data;
}

export async function deleteDocument(id: number) {

    await api.delete(`/documents/${id}`);

}