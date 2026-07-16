import api from "./api";

export async function runComplianceAudit(documentId: number) {
    const response = await api.post(`/compliance/audit/${documentId}`);
    return response.data;
}
