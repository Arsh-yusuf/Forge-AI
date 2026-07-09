import {
    Box,
    Typography,
} from "@mui/material";

interface Props {

    message: string;

}

export default function EmptyState({
    message,
}: Props) {
    return (
        <Box
            sx={{
                py: 8,
                textAlign: "center"
            }}
        >
            <Typography
                color="text.secondary"
            >
                {message}
            </Typography>
        </Box>
    );
}