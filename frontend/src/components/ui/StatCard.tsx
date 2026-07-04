import {
    Card,
    CardContent,
    Typography,
    Box,
} from "@mui/material";

import type { ReactNode } from "react";

interface Props {

    title: string;

    value: string | number;

    icon?: ReactNode;

}

export default function StatCard({

    title,

    value,

    icon,

}: Props) {

    return (

        <Card
            elevation={2}
            sx={{
                borderRadius: 3,
                height: "100%",
            }}
        >

            <CardContent>

                <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                >

                    <Typography
                        color="text.secondary"
                    >

                        {title}

                    </Typography>

                    {icon}

                </Box>

                <Typography
                    variant="h4"
                    mt={2}
                >

                    {value}

                </Typography>

            </CardContent>

        </Card>

    );

}