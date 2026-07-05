import {

    Card,

    CardContent,

    Typography,

    Chip,

    Stack,

} from "@mui/material";

import type { Source } from "../../types/chat";

interface Props {

    source: Source;

}

export default function SourceCard({

    source,

}: Props) {

    return (

        <Card
            variant="outlined"
            sx={{
                mb:2,
                borderRadius:2,
            }}
        >

            <CardContent>

                <Typography
                    fontWeight={600}
                >

                    📄 {source.document_name}

                </Typography>

                <Stack
                    direction="row"
                    spacing={1}
                    mt={2}
                >

                    <Chip

                        label={`Page ${source.page_number}`}

                    />

                    <Chip

                        label={`${(
                            source.score*100
                        ).toFixed(1)}% Match`}

                        color="primary"

                    />

                </Stack>

                <Typography
                    mt={2}
                    color="text.secondary"
                >

                    {source.section}

                </Typography>

            </CardContent>

        </Card>

    );

}