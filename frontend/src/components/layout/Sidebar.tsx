import {
    Drawer,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Toolbar,
    Typography,
    Box,
    Divider
} from "@mui/material";

import {
    LayoutDashboard,
    FileText,
    MessageSquare,
    Network,
    ShieldAlert,
    Wrench,
    LogOut
} from "lucide-react";

import { useNavigate, useLocation } from "react-router-dom";

const drawerWidth = 240;

const menu = [
    {
        text: "Dashboard",
        icon: <LayoutDashboard size={20} />,
        path: "/dashboard"
    },
    {
        text: "Documents",
        icon: <FileText size={20} />,
        path: "/documents"
    },
    {
        text: "AI Chat",
        icon: <MessageSquare size={20} />,
        path: "/chat"
    },
    {
        text: "Knowledge Graph",
        icon: <Network size={20} />,
        path: "/graph"
    },
    {
        text: "Compliance Audit",
        icon: <ShieldAlert size={20} />,
        path: "/compliance"
    },
    {
        text: "Maintenance & RCA",
        icon: <Wrench size={20} />,
        path: "/maintenance"
    }
];

export default function Sidebar() {
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <Drawer
            variant="permanent"
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                "& .MuiDrawer-paper": {
                    width: drawerWidth,
                    boxSizing: "border-box",
                    background: "rgba(9, 13, 22, 0.4)",
                    backdropFilter: "blur(12px)",
                    borderRight: "1px solid rgba(255, 255, 255, 0.05)",
                    boxShadow: "none",
                }
            }}
        >
            <Toolbar sx={{ px: 3, my: 1 }}>
                <Typography
                    variant="h5"
                    sx={{
                        fontWeight: 800,
                        background: "linear-gradient(135deg, #a855f7 0%, #06b6d4 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        letterSpacing: "-0.5px",
                    }}
                >
                    ForgeAI
                </Typography>
            </Toolbar>

            <Divider sx={{ mx: 2, borderColor: "rgba(255, 255, 255, 0.05)" }} />

            <Box sx={{ mt: 2, display: "flex", flexDirection: "column", height: "calc(100% - 80px)", justifyContent: "space-between" }}>
                <List sx={{ px: 1 }}>
                    {menu.map((item) => (
                        <ListItemButton
                            key={item.text}
                            selected={location.pathname === item.path}
                            onClick={() => navigate(item.path)}
                        >
                            <ListItemIcon>
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText
                                primary={
                                    <Typography sx={{ fontSize: "0.95rem", fontWeight: 500 }}>
                                        {item.text}
                                    </Typography>
                                }
                            />
                        </ListItemButton>
                    ))}
                </List>

                <List sx={{ px: 1, mb: 2 }}>
                    <ListItemButton
                        onClick={() => {
                            localStorage.removeItem("access_token");
                            navigate("/");
                        }}
                        sx={{
                            color: "#ef4444",
                            "&:hover": {
                                backgroundColor: "rgba(239, 68, 68, 0.08)",
                                color: "#f87171",
                            }
                        }}
                    >
                        <ListItemIcon sx={{ color: "inherit" }}>
                            <LogOut size={20} />
                        </ListItemIcon>
                        <ListItemText
                            primary={
                                <Typography sx={{ fontSize: "0.95rem", fontWeight: 500 }}>
                                    Logout
                                </Typography>
                            }
                        />
                    </ListItemButton>
                </List>
            </Box>
        </Drawer>
    );
}