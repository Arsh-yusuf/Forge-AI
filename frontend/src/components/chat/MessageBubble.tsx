import {
    Box,
    Paper,
    Typography,
} from "@mui/material";

import ReactMarkdown from "react-markdown";

import SourcePanel from "./SourcePanel";

import type { Source } from "../../types/chat";

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
            display="flex"
            justifyContent={
                isUser
                    ? "flex-end"
                    : "flex-start"
            }
            mb={2}
        >

            <Paper
                sx={{
                    p: 2,
                    maxWidth: "75%",
                    bgcolor: isUser
                        ? "primary.main"
                        : "background.paper",
                    color: isUser
                        ? "white"
                        : "black",
                    borderRadius: 3,
                }}
            >

                <Typography component="div">

                    <ReactMarkdown>

                        {content}

                    </ReactMarkdown>

                </Typography>

                {
                    !isUser &&
                    sources &&
                    sources.length > 0 && (

                        <SourcePanel
                            sources={sources}
                        />

                    )
                }

            </Paper>

        </Box>

    );

}