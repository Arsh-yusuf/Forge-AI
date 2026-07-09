import { Box, Typography } from "@mui/material";

interface Props {

    title: string;

    subtitle?: string;

}

export default function PageHeader({

    title,

    subtitle,

}: Props) {

    return (

        <Box sx={{ mb: 4 }}>
            <Typography
                variant="h4"
                sx={{
                    fontWeight: 800,
                    background: "linear-gradient(135deg, #ffffff 0%, #a855f7 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    mb: 1
                }}
            >
                {title}
            </Typography>
            {
                subtitle && (
                    <Typography
                        variant="body2"
                        sx={{ color: "text.secondary" }}
                    >
                        {subtitle}
                    </Typography>
                )
            }
        </Box>

    );

}