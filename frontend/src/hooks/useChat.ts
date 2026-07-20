import { useEffect, useState } from "react";

import {
    askQuestion,
    getChatHistory,
    getChatSessions,
    deleteChatSession,
} from "../api/chat";

import type {
    ChatSession,
    Message,
} from "../types/chat";

export default function useChat() {

    const [sessions, setSessions] =
        useState<ChatSession[]>([]);

    const [messages, setMessages] =
        useState<Message[]>([]);

    const [sessionId, setSessionId] =
        useState<number | null>(null);

    const [question, setQuestion] =
        useState("");

    const [loading, setLoading] =
        useState(false);

    async function loadSessions() {
        const data = await getChatSessions();
        setSessions(data);
    }

    async function loadChat(id: number) {
        const data = await getChatHistory(id);

        // Map messages from backend, carrying persisted sources
        const mapped: Message[] = data.messages.map((m: any) => ({
            role: m.role as "user" | "assistant",
            content: m.content,
            sources: m.sources ?? [],
        }));

        setMessages(mapped);
        setSessionId(id);
    }

    async function sendMessage() {
        if (!question.trim()) return;

        const current = question;

        setMessages(prev => [
            ...prev,
            {
                role: "user",
                content: current,
            }
        ]);

        setQuestion("");
        setLoading(true);

        try {
            const response = await askQuestion(sessionId, current);

            setSessionId(response.session_id);

            setMessages(prev => [
                ...prev,
                {
                    role: "assistant",
                    content: response.answer,
                    sources: response.sources ?? [],
                    response_time_ms: response.response_time_ms,
                    search_strategy: response.search_strategy,
                    entities_extracted: response.entities_extracted,
                }
            ]);

            await loadSessions();

        } finally {
            setLoading(false);
        }
    }

    async function deleteSession(id: number) {
        await deleteChatSession(id);

        // If the deleted session was open, clear the window
        if (sessionId === id) {
            setSessionId(null);
            setMessages([]);
        }

        await loadSessions();
    }

    function newChat() {
        setSessionId(null);
        setMessages([]);
    }

    useEffect(() => {
        loadSessions();
    }, []);

    return {
        sessions,
        messages,
        question,
        loading,
        sessionId,
        setQuestion,
        sendMessage,
        loadChat,
        newChat,
        deleteSession,
    };
}