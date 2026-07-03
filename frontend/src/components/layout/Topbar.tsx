import { AppBar, Toolbar, Typography } from "@mui/material";

const drawerWidth = 240;

export default function Topbar() {
    return (
        <AppBar
            position="fixed"
            color="inherit"
            elevation={1}
            sx={{
                width: `calc(100% - ${drawerWidth}px)`,
                ml: `${drawerWidth}px`,
            }}
        >
            <Toolbar>
                <Typography variant="h6">
                    ForgeAI
                </Typography>
            </Toolbar>
        </AppBar>
    );
}