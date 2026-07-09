import {
    Grid,
    Typography,
    CircularProgress,
    Box,
} from "@mui/material";

import { useEffect, useState } from "react";

import MainLayout from "../components/layout/MainLayout";
import StatCard from "../components/dashboard/StatCard";
import { FileText, Database, HelpCircle, MessageSquare } from "lucide-react";

import { getDashboardStats } from "../api/dashboard";

export default function Dashboard() {

    const [stats, setStats] = useState<any>(null);

    useEffect(() => {

        async function load() {

            const data =
                await getDashboardStats();

            setStats(data);

        }

        load();

    }, []);

    if (!stats) {
        return (
            <MainLayout>
                <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh" }}>
                    <CircularProgress color="primary" />
                </Box>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <Box sx={{ mb: 5 }}>
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
                    System Dashboard
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    Monitor your document ingestion status, knowledge base size, and assistant activity in real time.
                </Typography>
            </Box>

            <Grid
                container
                spacing={3}
            >
                <Grid size={{xs:12,md:3}}>
                    <StatCard
                        title="Documents"
                        value={stats.documents}
                        color="linear-gradient(135deg, #a855f7 0%, #ec4899 100%)"
                        icon={<FileText size={22} />}
                    />
                </Grid>

                <Grid size={{xs:12,md:3}}>
                    <StatCard
                        title="Chunks"
                        value={stats.chunks}
                        color="linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)"
                        icon={<Database size={22} />}
                    />
                </Grid>

                <Grid size={{xs:12,md:3}}>
                    <StatCard
                        title="Questions"
                        value={stats.questions}
                        color="linear-gradient(135deg, #10b981 0%, #059669 100%)"
                        icon={<HelpCircle size={22} />}
                    />
                </Grid>

                <Grid size={{xs:12,md:3}}>
                    <StatCard
                        title="Conversations"
                        value={stats.chat_sessions}
                        color="linear-gradient(135deg, #f59e0b 0%, #d97706 100%)"
                        icon={<MessageSquare size={22} />}
                    />
                </Grid>
            </Grid>
        </MainLayout>
    );
}