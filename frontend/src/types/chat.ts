export interface Message {

    role: "user" | "assistant";

    content: string;

}

export interface ChatResponse {

    session_id: number;

    answer: string;

}

export interface ChatSession {

    id: number;

    title: string;

    created_at: string;

}