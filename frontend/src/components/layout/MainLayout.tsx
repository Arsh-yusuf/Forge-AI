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
        <Box sx={{ display: "flex", position: "relative", minHeight: "100vh", overflow: "hidden" }}>
            {/* Background decorative glow blobs */}
            <Box
                sx={{
                    position: "absolute",
                    top: "-10%",
                    left: "20%",
                    width: "400px",
                    height: "400px",
                    borderRadius: "50%",
                    background: "radial-gradient(circle, rgba(168, 85, 247, 0.08) 0%, transparent 70%)",
                    filter: "blur(40px)",
                    pointerEvents: "none",
                    zIndex: 0,
                }}
            />
            <Box
                sx={{
                    position: "absolute",
                    bottom: "10%",
                    right: "-5%",
                    width: "500px",
                    height: "500px",
                    borderRadius: "50%",
                    background: "radial-gradient(circle, rgba(6, 182, 212, 0.06) 0%, transparent 70%)",
                    filter: "blur(50px)",
                    pointerEvents: "none",
                    zIndex: 0,
                }}
            />

            <Sidebar />

            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    ml: `${drawerWidth}px`,
                    minHeight: "100vh",
                    bgcolor: "transparent",
                    position: "relative",
                    zIndex: 1,
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