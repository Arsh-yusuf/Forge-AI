import { useEffect, useState } from "react";

import {

    askQuestion,

    getChatHistory,

    getChatSessions,

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

        const data =
            await getChatSessions();

        setSessions(data);

    }

    async function loadChat(
        id: number
    ) {

        const data =
            await getChatHistory(id);

        setMessages(data.messages);

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

            const response =
                await askQuestion(
                    sessionId,
                    current,
                );

            setSessionId(
                response.session_id
            );

            setMessages(prev => [

                ...prev,

                {

                    role: "assistant",

                    content: response.answer,

                }

            ]);

            await loadSessions();

        }

        finally {

            setLoading(false);

        }

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

    };

}