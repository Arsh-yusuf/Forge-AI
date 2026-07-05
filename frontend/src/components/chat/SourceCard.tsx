import {
    Card,
    CardContent,
    Chip,
    Stack,
    Typography,
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
                mt: 1,
                borderRadius: 2,
            }}
        >

            <CardContent>

                <Typography
                    fontWeight="bold"
                >
                    📄 {source.document_name}
                </Typography>

                <Stack
                    direction="row"
                    spacing={1}
                    mt={2}
                >

                    <Chip
                        size="small"
                        label={`Page ${source.page_number}`}
                    />

                    <Chip
                        size="small"
                        color="primary"
                        label={`${(source.score * 100).toFixed(1)}% Match`}
                    />

                </Stack>

                {

                    source.section &&
                    source.section !== "Unknown" && (

                        <Typography
                            mt={2}
                            variant="body2"
                            color="text.secondary"
                        >

                            {source.section}

                        </Typography>

                    )

                }

            </CardContent>

        </Card>

    );

}