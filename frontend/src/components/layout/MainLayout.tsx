import { Box, Toolbar } from "@mui/material";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

const drawerWidth = 240;

export default function MainLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <Box sx={{ display: "flex" }}>
            <Sidebar />

            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    ml: `${drawerWidth}px`,
                    minHeight: "100vh",
                    bgcolor: "#f5f7fa",
                }}
            >
                <Topbar />

                <Toolbar />

                <Box sx={{ p: 4 }}>
                    {children}
                </Box>
            </Box>
        </Box>
    );
}