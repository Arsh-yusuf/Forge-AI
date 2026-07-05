import {

    Box,

    Typography,

} from "@mui/material";

import type { Source } from "../../types/chat";

import SourceCard from "./SourceCard";

interface Props {

    sources: Source[];

}

export default function SourcePanel({

    sources,

}: Props) {

    if (!sources.length) {

        return null;

    }

    return (

        <Box mt={3}>

            <Typography
                variant="h6"
                mb={2}
            >

                Sources Used

            </Typography>

            {

                sources.map((source,index)=>(

                    <SourceCard

                        key={index}

                        source={source}

                    />

                ))

            }

        </Box>

    );

}