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
                borderRight: "1px solid #ddd",
                display: "flex",
                flexDirection: "column",
                height: "70vh",
            }}
        >

            <Box p={2}>

                <Button
                    fullWidth
                    variant="contained"
                    onClick={onNewChat}
                >

                    + New Chat

                </Button>

            </Box>

            <Divider />

            <Typography
                px={2}
                py={1}
                fontWeight="bold"
            >

                Conversations

            </Typography>

            <List
                sx={{
                    overflowY: "auto",
                    flex: 1,
                }}
            >

                {

                    sessions.map((session) => (

                        <ListItemButton

                            key={session.id}

                            selected={
                                selectedId === session.id
                            }

                            onClick={() =>
                                onSelect(session.id)
                            }

                        >

                            <ListItemText

                                primary={session.title}

                                secondary={
                                    new Date(
                                        session.created_at
                                    ).toLocaleDateString()
                                }

                            />

                        </ListItemButton>

                    ))

                }

            </List>

        </Box>

    );

}