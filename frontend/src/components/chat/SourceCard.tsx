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
                mt: 1.5,
                borderRadius: 3,
                background: "rgba(255, 255, 255, 0.02)",
                borderColor: "rgba(255, 255, 255, 0.05)",
            }}
        >

            <CardContent>

                <Typography
                    sx={{ fontWeight: "bold" }}
                >
                    📄 {source.document_name}
                </Typography>

                <Stack
                    direction="row"
                    spacing={1}
                    sx={{ mt: 2 }}
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
                            variant="body2"
                            sx={{ mt: 2, color: "text.secondary" }}
                        >

                            {source.section}

                        </Typography>

                    )

                }

            </CardContent>

        </Card>

    );

}