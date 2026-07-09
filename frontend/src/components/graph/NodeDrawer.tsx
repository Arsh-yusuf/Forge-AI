import {
    Drawer,
    Typography,
    Divider,
    List,
    ListItem,
    Box,
} from "@mui/material";
import { FileText } from "lucide-react";

interface Props {
    open: boolean;
    onClose: () => void;
    data: any;
}

export default function NodeDrawer({
    open,
    onClose,
    data,
}: Props) {
    return (
        <Drawer
            anchor="right"
            open={open}
            onClose={onClose}
            sx={{
                "& .MuiDrawer-paper": {
                    width: 380,
                    background: "rgba(17, 25, 40, 0.8)",
                    backdropFilter: "blur(20px)",
                    borderLeft: "1px solid rgba(255, 255, 255, 0.08)",
                    boxShadow: "-10px 0 30px rgba(0, 0, 0, 0.3)",
                    padding: 4,
                }
            }}
        >
            <Box>
                <Typography
                    variant="h5"
                    sx={{
                        fontWeight: 700,
                        background: "linear-gradient(135deg, #ffffff 0%, #a855f7 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        mb: 1
                    }}
                >
                    Concept Details
                </Typography>
                <Typography variant="h6" color="primary" sx={{ fontWeight: 600, mb: 2 }}>
                    {data?.concept}
                </Typography>

                <Divider sx={{ my: 3, borderColor: "rgba(255, 255, 255, 0.08)" }} />

                <Typography variant="subtitle2" sx={{ color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "1px", mb: 2 }}>
                    Occurrences in Documents
                </Typography>

                <List sx={{ p: 0 }}>
                    {data?.occurrences?.length === 0 ? (
                        <Typography variant="body2" color="text.secondary">
                            No occurrences found.
                        </Typography>
                    ) : (
                        data?.occurrences?.map((item: any, index: number) => (
                            <ListItem
                                key={index}
                                sx={{
                                    p: 2,
                                    mb: 2,
                                    borderRadius: 3,
                                    background: "rgba(255, 255, 255, 0.02)",
                                    border: "1px solid rgba(255, 255, 255, 0.05)",
                                    alignItems: "flex-start",
                                    flexDirection: "column"
                                }}
                            >
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                                    <FileText size={16} color="#06b6d4" />
                                    <Typography variant="body2" sx={{ fontWeight: 600, color: "#ffffff" }}>
                                        {item.document}
                                    </Typography>
                                </Box>
                                <Typography variant="body2" sx={{ color: "rgba(168,85,247,0.9)", fontWeight: 500, fontSize: "0.8rem" }}>
                                    {item.section}
                                </Typography>
                            </ListItem>
                        ))
                    )}
                </List>
            </Box>
        </Drawer>
    );
}