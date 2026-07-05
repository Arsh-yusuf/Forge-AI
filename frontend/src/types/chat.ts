export interface Message {

    role: "user" | "assistant";

    content: string;

    sources?: Source[];

}

export interface Source {

    document_name: string;

    page_number: number;

    section: string;

    score: number;

}

export interface ChatResponse {

    session_id: number;

    answer: string;

    sources: Source[];

}

export interface ChatSession {

    id: number;

    title: string;

    created_at: string;

}