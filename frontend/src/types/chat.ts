export interface Message {

    role: "user" | "assistant";

    content: string;

    sources?: Source[];

    response_time_ms?: number;

    search_strategy?: string;

    entities_extracted?: string[];

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

    response_time_ms?: number;

    search_strategy?: string;

    entities_extracted?: string[];

}

export interface ChatSession {

    id: number;

    title: string;

    created_at: string;

}