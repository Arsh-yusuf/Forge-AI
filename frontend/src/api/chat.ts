import api from "./api";

export async function askQuestion(
    sessionId: number | null,
    question: string
) {
    const response = await api.post("/chat", {
        session_id: sessionId,
        question,
    });

    return response.data;
}

export async function getChatSessions() {
    const response = await api.get("/chat/sessions");
    return response.data;
}

export async function getChatHistory(id: number) {
    const response = await api.get(`/chat/${id}`);
    return response.data;
}

export async function deleteChatSession(id: number) {
    const response = await api.delete(`/chat/${id}`);
    return response.data;
}