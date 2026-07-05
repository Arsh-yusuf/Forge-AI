import {
    Box,
} from "@mui/material";

import MessageBubble from "./MessageBubble";

import type {
    Message,
} from "../../types/chat";

interface Props {

    messages: Message[];

}

export default function ChatWindow({

    messages,

}: Props) {

    return (

        <Box

            sx={{

                height: "60vh",

                overflowY: "auto",

                mb: 2,

            }}

        >

            {

                messages.map((message, index) => (

                    <MessageBubble

                        key={index}

                        role={message.role}

                        content={message.content}

                        sources={message.sources}

                    />

                ))

            }

        </Box>

    );

}