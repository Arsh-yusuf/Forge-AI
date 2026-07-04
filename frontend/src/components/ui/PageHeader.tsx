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

        <Box mb={4}>

            <Typography

                variant="h4"

            >

                {title}

            </Typography>

            {

                subtitle && (

                    <Typography

                        color="text.secondary"

                    >

                        {subtitle}

                    </Typography>

                )

            }

        </Box>

    );

}