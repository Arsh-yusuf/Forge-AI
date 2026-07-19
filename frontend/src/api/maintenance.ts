import api from "./api";

export async function runRcaDiagnostics(symptom: string) {
    const response = await api.post("/maintenance/rca", { symptom });
    return response.data;
}
