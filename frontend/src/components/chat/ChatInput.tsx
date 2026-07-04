import {
    Box,
    Button,
    TextField,
} from "@mui/material";

interface Props {

    question: string;

    setQuestion: (value: string) => void;

    onSend: () => void;

    loading: boolean;

}

export default function ChatInput({

    question,

    setQuestion,

    onSend,

    loading,

}: Props) {

    return (

        <Box
            display="flex"
            gap={2}
            mt={2}
        >

            <TextField
                fullWidth
                multiline
                maxRows={4}
                placeholder="Ask ForgeAI..."
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyDown={(e) => {
                    if (
                        e.key === "Enter" &&
                        !e.shiftKey
                    ) {
                        e.preventDefault();
                        onSend();
                    }
                }}
            />

            <Button
                variant="contained"
                disabled={loading}
                onClick={onSend}
            >
                Send
            </Button>

        </Box>

    );

}