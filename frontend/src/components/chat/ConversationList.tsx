import {
    Box,
    Button,
    Divider,
    List,
    ListItemButton,
    ListItemText,
    Typography,
} from "@mui/material";

import type { ChatSession } from "../../types/chat";
import { MessageSquarePlus } from "lucide-react";

interface Props {
    sessions: ChatSession[];
    selectedId: number | null;
    onSelect: (id: number) => void;
    onNewChat: () => void;
}

export default function ConversationList({
    sessions,
    selectedId,
    onSelect,
    onNewChat,
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
                        <ListItemButton
                            key={session.id}
                            selected={selectedId === session.id}
                            onClick={() => onSelect(session.id)}
                            sx={{
                                borderRadius: "10px",
                                mb: 0.5,
                                py: 1.2,
                                px: 2,
                                "&.Mui-selected": {
                                    backgroundColor: "rgba(168, 85, 247, 0.12)",
                                    borderLeft: "3px solid #06b6d4",
                                    color: "#ffffff",
                                    "& .MuiListItemText-secondary": {
                                        color: "rgba(6, 182, 212, 0.8)",
                                    }
                                }
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
                    ))
                )}
            </List>
        </Box>
    );
}