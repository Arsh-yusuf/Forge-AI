import { AppBar, Toolbar, Typography } from "@mui/material";

const drawerWidth = 240;

export default function Topbar() {
    return (
        <AppBar
            position="fixed"
            elevation={0}
            sx={{
                width: `calc(100% - ${drawerWidth}px)`,
                ml: `${drawerWidth}px`,
                background: "rgba(9, 13, 22, 0.25)",
                backdropFilter: "blur(12px)",
                borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
                color: "#f3f4f6",
            }}
        >
            <Toolbar sx={{ px: 4 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, color: "rgba(255, 255, 255, 0.8)", letterSpacing: "0.5px" }}>
                    AI-Powered Operations Assistant
                </Typography>
            </Toolbar>
        </AppBar>
    );
}