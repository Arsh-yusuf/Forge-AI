import {
    Card,
    CardContent,
    Typography,
    Box,
} from "@mui/material";
import type { ReactNode } from "react";

interface Props {
    title: string;
    value: number;
    icon?: ReactNode;
    color?: string;
}

export default function StatCard({
    title,
    value,
    icon,
    color = "#a855f7",
}: Props) {
    return (
        <Card
            elevation={0}
            sx={{
                borderRadius: 4,
                position: "relative",
                overflow: "hidden",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0 12px 24px rgba(0,0,0,0.4), 0 0 15px rgba(168, 85, 247, 0.1)",
                    borderColor: "rgba(255, 255, 255, 0.15)",
                },
            }}
        >
            <Box
                sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "4px",
                    height: "100%",
                    background: color,
                }}
            />
            <CardContent sx={{ p: 3, "&:last-child": { pb: 3 } }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                    <Typography
                        variant="body2"
                        sx={{ fontWeight: 600, color: "text.secondary", textTransform: "uppercase", letterSpacing: "1px" }}
                    >
                        {title}
                    </Typography>
                    <Box sx={{ color: color, opacity: 0.8, display: "flex", alignItems: "center" }}>
                        {icon}
                    </Box>
                </Box>

                <Typography
                    variant="h3"
                    sx={{
                        fontWeight: 800,
                        color: "#ffffff",
                        mt: 1,
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                    }}
                >
                    {value}
                </Typography>
            </CardContent>
        </Card>
    );
}