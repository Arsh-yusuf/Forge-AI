import {
    Box,
    Button,
    Divider,
    IconButton,
    List,
    ListItemButton,
    ListItemText,
    Tooltip,
    Typography,
} from "@mui/material";

import type { ChatSession } from "../../types/chat";
import { MessageSquarePlus, Trash2 } from "lucide-react";

interface Props {
    sessions: ChatSession[];
    selectedId: number | null;
    onSelect: (id: number) => void;
    onNewChat: () => void;
    onDelete: (id: number) => void;
}

export default function ConversationList({
    sessions,
    selectedId,
    onSelect,
    onNewChat,
    onDelete,
}: Props) {
    return (
        <Box
            sx={{
                width: 300,
                borderRight: "1px solid rgba(255, 255, 255, 0.05)",
                display: "flex",
                flexDirection: "column",
                height: "70vh",
                background: "rgba(9, 13, 22, 0.2)",
                borderRadius: 4,
                overflow: "hidden",
                border: "1px solid rgba(255, 255, 255, 0.05)"
            }}
        >
            <Box sx={{ p: 2 }}>
                <Button
                    fullWidth
                    variant="contained"
                    onClick={onNewChat}
                    startIcon={<MessageSquarePlus size={18} />}
                    sx={{
                        py: 1.2,
                        borderRadius: "24px",
                        boxShadow: "0 4px 12px rgba(168, 85, 247, 0.2)"
                    }}
                >
                    New Chat
                </Button>
            </Box>

            <Divider sx={{ borderColor: "rgba(255, 255, 255, 0.05)" }} />

            <Typography
                variant="subtitle2"
                sx={{
                    px: 3,
                    py: 1.5,
                    fontWeight: "bold",
                    color: "rgba(255, 255, 255, 0.4)",
                    textTransform: "uppercase",
                    letterSpacing: "1px"
                }}
            >
                History
            </Typography>

            <List
                sx={{
                    overflowY: "auto",
                    flex: 1,
                    px: 1,
                    py: 0,
                    "&::-webkit-scrollbar": {
                        width: "6px",
                    },
                    "&::-webkit-scrollbar-thumb": {
                        background: "rgba(255, 255, 255, 0.05)",
                        borderRadius: "3px",
                    }
                }}
            >
                {sessions.length === 0 ? (
                    <Box sx={{ p: 3, textAlign: "center" }}>
                        <Typography variant="body2" color="text.secondary">
                            No chat history
                        </Typography>
                    </Box>
                ) : (
                    sessions.map((session) => (
                        <Box
                            key={session.id}
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                borderRadius: "10px",
                                mb: 0.5,
                                pr: 0.5,
                                background: selectedId === session.id
                                    ? "rgba(168, 85, 247, 0.12)"
                                    : "transparent",
                                borderLeft: selectedId === session.id
                                    ? "3px solid #06b6d4"
                                    : "3px solid transparent",
                                "&:hover .delete-btn": {
                                    opacity: 1,
                                },
                            }}
                        >
                            <ListItemButton
                                onClick={() => onSelect(session.id)}
                                sx={{
                                    flex: 1,
                                    borderRadius: "10px",
                                    py: 1.2,
                                    px: 2,
                                    background: "transparent",
                                    "&:hover": { background: "transparent" },
                                }}
                            >
                                <ListItemText
                                    primary={
                                        <Typography
                                            noWrap
                                            sx={{
                                                fontSize: "0.875rem",
                                                fontWeight: selectedId === session.id ? 600 : 500,
                                                color: "#ffffff"
                                            }}
                                        >
                                            {session.title || "Untitled Session"}
                                        </Typography>
                                    }
                                    secondary={
                                        <Typography
                                            sx={{
                                                fontSize: "0.75rem",
                                                mt: 0.5,
                                                color: "text.secondary"
                                            }}
                                        >
                                            {new Date(session.created_at).toLocaleDateString()}
                                        </Typography>
                                    }
                                />
                            </ListItemButton>

                            <Tooltip title="Delete chat" placement="right">
                                <IconButton
                                    className="delete-btn"
                                    size="small"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onDelete(session.id);
                                    }}
                                    sx={{
                                        opacity: 0,
                                        transition: "opacity 0.15s ease",
                                        color: "rgba(239, 68, 68, 0.6)",
                                        "&:hover": {
                                            color: "#ef4444",
                                            background: "rgba(239, 68, 68, 0.1)",
                                        },
                                    }}
                                >
                                    <Trash2 size={14} />
                                </IconButton>
                            </Tooltip>
                        </Box>
                    ))
                )}
            </List>
        </Box>
    );
}