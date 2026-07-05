import { Box } from "@mui/material";
import type { Message } from "../../types/chat";
import MessageBubble from "./MessageBubble";

interface Props {
    messages: Message[];
}

export default function ChatWindow({ messages }: Props) {
    return (
        <Box
            sx={{
                flex: 1,
                overflowY: "auto",
                p: 2,
                minHeight: "60vh",
                bgcolor: "#f8f9fb",
                borderRadius: 2,
            }}
        >
            {messages.map((message, index) => (
                <MessageBubble
                    key={index}
                    role={message.role}
                    content={message.content}
                    sources={message.sources}
                />
            ))}
        </Box>
    );
}