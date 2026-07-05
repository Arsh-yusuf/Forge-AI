import {
    Box,
    CircularProgress,
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

                pr: 1,

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

            {

                loading && (

                    <Box

                        display="flex"

                        justifyContent="flex-start"

                        mt={2}

                    >

                        <CircularProgress
                            size={24}
                        />

                    </Box>

                )

            }

            <div ref={bottomRef} />

        </Box>

    );

}