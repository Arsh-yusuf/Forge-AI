import {
    Box,
    Typography,
} from "@mui/material";

import type { Source } from "../../types/chat";

import SourceCard from "./SourceCard";

interface Props {

    sources?: Source[];

}

export default function SourcePanel({

    sources,

}: Props) {

    if (!sources || sources.length === 0)
        return null;

    return (

        <Box mt={3}>

            <Typography
                variant="subtitle1"
                fontWeight="bold"
                mb={1}
            >

                Sources Used

            </Typography>

            {

                sources.map((source, index) => (

                    <SourceCard

                        key={index}

                        source={source}

                    />

                ))

            }

        </Box>

    );

}