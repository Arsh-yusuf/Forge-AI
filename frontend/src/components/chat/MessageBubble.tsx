import {
    Box,
    Paper,
    Typography,
    Avatar,
} from "@mui/material";

import ReactMarkdown from "react-markdown";

import SourcePanel from "./SourcePanel";

import type {
    Source,
} from "../../types/chat";
import { User, Cpu } from "lucide-react";

interface Props {
    role: "user" | "assistant";
    content: string;
    sources?: Source[];
}

export default function MessageBubble({
    role,
    content,
    sources,
}: Props) {
    const isUser = role === "user";

    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: isUser ? "flex-end" : "flex-start",
                mb: 3,
                gap: 1.5,
            }}
        >
            {!isUser && (
                <Avatar
                    sx={{
                        width: 32,
                        height: 32,
                        bgcolor: "rgba(168, 85, 247, 0.15)",
                        border: "1px solid rgba(168, 85, 247, 0.3)",
                        color: "#a855f7",
                    }}
                >
                    <Cpu size={16} />
                </Avatar>
            )}

            <Paper
                elevation={0}
                sx={{
                    p: 2.5,
                    maxWidth: "75%",
                    background: isUser
                        ? "linear-gradient(135deg, #a855f7 0%, #06b6d4 100%)"
                        : "rgba(17, 25, 40, 0.4)",
                    color: "#ffffff",
                    borderRadius: isUser ? "16px 0px 16px 16px" : "0px 16px 16px 16px",
                    border: "1px solid rgba(255, 255, 255, 0.05)",
                    boxShadow: isUser ? "0 4px 15px rgba(168, 85, 247, 0.2)" : "none",
                }}
            >
                <Typography
                    component="div"
                    sx={{
                        fontSize: "0.95rem",
                        lineHeight: 1.6,
                        "& p": { margin: "0 0 12px 0" },
                        "& p:last-child": { margin: 0 },
                        "& pre": {
                            background: "rgba(0,0,0,0.3)",
                            padding: "12px",
                            borderRadius: "8px",
                            overflowX: "auto",
                            border: "1px solid rgba(255,255,255,0.05)",
                            fontFamily: "'Courier New', Courier, monospace",
                        },
                        "& code": {
                            fontFamily: "'Courier New', Courier, monospace",
                            background: "rgba(255,255,255,0.1)",
                            padding: "2px 6px",
                            borderRadius: "4px",
                        }
                    }}
                >
                    <ReactMarkdown>
                        {content}
                    </ReactMarkdown>
                </Typography>

                {!isUser && (
                    <SourcePanel
                        sources={sources}
                    />
                )}
            </Paper>

            {isUser && (
                <Avatar
                    sx={{
                        width: 32,
                        height: 32,
                        bgcolor: "rgba(6, 182, 212, 0.15)",
                        border: "1px solid rgba(6, 182, 212, 0.3)",
                        color: "#06b6d4",
                    }}
                >
                    <User size={16} />
                </Avatar>
            )}
        </Box>
    );
}