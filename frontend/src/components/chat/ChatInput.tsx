import {
    Box,
    Button,
    TextField,
} from "@mui/material";
import { Send } from "lucide-react";

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
    function handleKeyDown(event: React.KeyboardEvent) {
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            onSend();
        }
    }

    return (
        <Box
            sx={{
                display: "flex",
                gap: 2,
                p: 1.5,
                bgcolor: "rgba(17, 25, 40, 0.4)",
                borderRadius: 4,
                border: "1px solid rgba(255, 255, 255, 0.05)",
                alignItems: "center"
            }}
        >
            <TextField
                fullWidth
                multiline
                maxRows={4}
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask assistant about manuals, SOPs, safety policies..."
                variant="standard"
                slotProps={{
                    input: {
                        disableUnderline: true,
                        style: {
                            color: "#ffffff",
                            padding: "8px 12px",
                            fontFamily: "'Inter', sans-serif"
                        }
                    }
                }}
            />

            <Button
                variant="contained"
                disabled={loading || !question.trim()}
                onClick={onSend}
                sx={{
                    borderRadius: "50%",
                    minWidth: "48px",
                    width: "48px",
                    height: "48px",
                    p: 0,
                    boxShadow: "0 4px 15px rgba(168, 85, 247, 0.25)"
                }}
            >
                <Send size={18} />
            </Button>
        </Box>
    );
}