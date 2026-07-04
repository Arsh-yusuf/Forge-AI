import {

    Box,

    Paper,

    Typography,

} from "@mui/material";

import ReactMarkdown from "react-markdown";

interface Props {

    role: "user" | "assistant";

    content: string;

}

export default function MessageBubble({

    role,

    content,

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

                    p:2,

                    maxWidth:"75%",

                    bgcolor: isUser

                        ? "primary.main"

                        : "background.paper",

                    color: isUser

                        ? "white"

                        : "black",

                    borderRadius:3,

                }}

            >

                <Typography
                    component="div"
                >

                    <ReactMarkdown>

                        {content}

                    </ReactMarkdown>

                </Typography>

            </Paper>

        </Box>

    );

}