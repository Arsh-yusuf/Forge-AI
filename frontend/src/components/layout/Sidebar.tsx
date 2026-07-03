import {
    Drawer,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Toolbar
} from "@mui/material";

import {
    LayoutDashboard,
    FileText,
    MessageSquare,
    Network,
    Settings,
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
        text: "Settings",
        icon: <Settings size={20} />,
        path: "/settings"
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

                    boxSizing: "border-box"

                }

            }}
        >

            <Toolbar>

                <strong>ForgeAI</strong>

            </Toolbar>

            <List>

                {

                    menu.map((item) => (

                        <ListItemButton

                            key={item.text}

                            selected={location.pathname === item.path}

                            onClick={() => navigate(item.path)}

                        >

                            <ListItemIcon>

                                {item.icon}

                            </ListItemIcon>

                            <ListItemText

                                primary={item.text}

                            />

                        </ListItemButton>

                    ))

                }

                <ListItemButton

                    onClick={() => {

                        localStorage.removeItem("access_token");

                        navigate("/");

                    }}

                >

                    <ListItemIcon>

                        <LogOut size={20} />

                    </ListItemIcon>

                    <ListItemText

                        primary="Logout"

                    />

                </ListItemButton>

            </List>

        </Drawer>

    );

}