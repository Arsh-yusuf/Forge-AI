import {
    Box,
    CircularProgress,
    Typography,
} from "@mui/material";

import {
    useEffect,
    useRef,
} from "react";

import MessageBubble from "./MessageBubble";

import type {
    Message,
} from "../../types/chat";

interface Props {
    messages: Message[];
    loading: boolean;
}

export default function ChatWindow({
    messages,
    loading,
}: Props) {
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({
            behavior: "smooth",
        });
    }, [messages, loading]);

    return (
        <Box
            sx={{
                height: "60vh",
                overflowY: "auto",
                mb: 2,
                pr: 1.5,
                pl: 0.5,
                background: "rgba(9, 13, 22, 0.1)",
                borderRadius: 4,
                p: 3,
                border: "1px solid rgba(255, 255, 255, 0.05)",
                "&::-webkit-scrollbar": {
                    width: "6px",
                },
                "&::-webkit-scrollbar-thumb": {
                    background: "rgba(255, 255, 255, 0.05)",
                    borderRadius: "3px",
                }
            }}
        >
            {messages.length === 0 ? (
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "100%",
                        textAlign: "center",
                    }}
                >
                    <Typography variant="h6" sx={{ color: "rgba(255,255,255,0.7)", fontWeight: 600, mb: 1 }}>
                        How can I help you today?
                    </Typography>
                    <Typography variant="body2" sx={{ color: "text.secondary", maxWidth: 400 }}>
                        Ask questions about operations, maintenance logs, inspection reports, or standard operating procedures.
                    </Typography>
                </Box>
            ) : (
                messages.map((message, index) => (
                    <MessageBubble
                        key={index}
                        role={message.role}
                        content={message.content}
                        sources={message.sources}
                        responseTimeMs={message.response_time_ms}
                        searchStrategy={message.search_strategy}
                        entitiesExtracted={message.entities_extracted}
                    />
                ))
            )}

            {loading && (
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "flex-start",
                        alignItems: "center",
                        mt: 2,
                        gap: 2,
                        p: 2.5,
                        maxWidth: "120px",
                        bgcolor: "rgba(17, 25, 40, 0.4)",
                        borderRadius: "0 16px 16px 16px",
                        border: "1px solid rgba(255, 255, 255, 0.05)",
                    }}
                >
                    <CircularProgress
                        size={18}
                        sx={{ color: "#a855f7" }}
                    />
                    <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 500 }}>
                        Typing...
                    </Typography>
                </Box>
            )}

            <div ref={bottomRef} />
        </Box>
    );
}