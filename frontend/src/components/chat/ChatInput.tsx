import {

    Box,

    Button,

    TextField,

} from "@mui/material";

interface Props {

    question: string;

    setQuestion: (text: string) => void;

    onSend: () => void;

    loading: boolean;

}

export default function ChatInput({

    question,

    setQuestion,

    onSend,

    loading,

}: Props) {

    function handleKeyDown(

        event: React.KeyboardEvent

    ) {

        if (

            event.key === "Enter" &&

            !event.shiftKey

        ) {

            event.preventDefault();

            onSend();

        }

    }

    return (

        <Box

            display="flex"

            gap={2}

        >

            <TextField

                fullWidth

                multiline

                maxRows={4}

                value={question}

                onChange={(e)=>

                    setQuestion(

                        e.target.value

                    )

                }

                onKeyDown={handleKeyDown}

                placeholder="Ask anything..."

            />

            <Button

                variant="contained"

                disabled={

                    loading ||

                    !question.trim()

                }

                onClick={onSend}

            >

                Send

            </Button>

        </Box>

    );

}