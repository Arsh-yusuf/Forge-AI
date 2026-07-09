import {
    Box,
    CircularProgress,
} from "@mui/material";

export default function LoadingOverlay() {
    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "center",
                py: 6
            }}
        >
            <CircularProgress />
        </Box>
    );
}