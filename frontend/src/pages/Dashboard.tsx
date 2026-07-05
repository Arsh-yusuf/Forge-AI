import {
    Grid,
    Typography,
    CircularProgress,
} from "@mui/material";

import { useEffect, useState } from "react";

import MainLayout from "../components/layout/MainLayout";
import StatCard from "../components/dashboard/StatCard";

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

                <CircularProgress />

            </MainLayout>

        );

    }

    return (

        <MainLayout>

            <Typography
                variant="h4"
                mb={4}
            >

                ForgeAI Dashboard

            </Typography>

            <Grid
                container
                spacing={3}
            >

                <Grid size={{xs:12,md:3}}>

                    <StatCard
                        title="Documents"
                        value={stats.documents}
                    />

                </Grid>

                <Grid size={{xs:12,md:3}}>

                    <StatCard
                        title="Chunks"
                        value={stats.chunks}
                    />

                </Grid>

                <Grid size={{xs:12,md:3}}>

                    <StatCard
                        title="Questions"
                        value={stats.questions}
                    />

                </Grid>

                <Grid size={{xs:12,md:3}}>

                    <StatCard
                        title="Conversations"
                        value={stats.chat_sessions}
                    />

                </Grid>

            </Grid>

        </MainLayout>

    );

}