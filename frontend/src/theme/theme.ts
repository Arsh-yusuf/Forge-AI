import { createTheme } from "@mui/material/styles";

const theme = createTheme({
    palette: {
        mode: "dark",
        primary: {
            main: "#a855f7", // Vibrant purple
            light: "#c084fc",
            dark: "#7e22ce",
        },
        secondary: {
            main: "#06b6d4", // Cyan
            light: "#22d3ee",
            dark: "#0891b2",
        },
        background: {
            default: "#090d16",
            paper: "rgba(17, 25, 40, 0.65)",
        },
        text: {
            primary: "#f3f4f6",
            secondary: "#9ca3af",
        },
        divider: "rgba(255, 255, 255, 0.08)",
    },
    shape: {
        borderRadius: 16,
    },
    typography: {
        fontFamily: "'Plus Jakarta Sans', 'Inter', 'Roboto', sans-serif",
        h1: { fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800 },
        h2: { fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700 },
        h3: { fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700 },
        h4: { fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700 },
        h5: { fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600 },
        h6: { fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600 },
        subtitle1: { fontFamily: "'Inter', sans-serif" },
        subtitle2: { fontFamily: "'Inter', sans-serif" },
        body1: { fontFamily: "'Inter', sans-serif" },
        body2: { fontFamily: "'Inter', sans-serif" },
        button: { fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600 },
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                body: {
                    background: "radial-gradient(circle at 10% 20%, rgba(168, 85, 247, 0.12) 0%, transparent 45%), radial-gradient(circle at 90% 80%, rgba(6, 182, 212, 0.12) 0%, transparent 45%), #090d16",
                    backgroundAttachment: "fixed",
                    color: "#f3f4f6",
                    minHeight: "100vh",
                    "&::-webkit-scrollbar": {
                        width: "8px",
                        height: "8px",
                    },
                    "&::-webkit-scrollbar-track": {
                        background: "rgba(0, 0, 0, 0.2)",
                    },
                    "&::-webkit-scrollbar-thumb": {
                        background: "rgba(255, 255, 255, 0.1)",
                        borderRadius: "4px",
                        "&:hover": {
                            background: "rgba(255, 255, 255, 0.2)",
                        },
                    },
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundColor: "rgba(17, 25, 40, 0.65)",
                    backdropFilter: "blur(16px)",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.3)",
                    backgroundImage: "none",
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: "24px",
                    textTransform: "none",
                    padding: "8px 22px",
                    transition: "all 0.2s ease-in-out",
                    "&:hover": {
                        transform: "translateY(-1px)",
                    },
                },
                contained: {
                    background: "linear-gradient(135deg, #a855f7 0%, #06b6d4 100%)",
                    color: "#ffffff",
                    boxShadow: "0 4px 15px rgba(168, 85, 247, 0.25)",
                    "&:hover": {
                        background: "linear-gradient(135deg, #c084fc 0%, #22d3ee 100%)",
                        boxShadow: "0 6px 20px rgba(168, 85, 247, 0.4)",
                        transform: "translateY(-1px)",
                    },
                    "&.Mui-disabled": {
                        background: "rgba(255, 255, 255, 0.08)",
                        color: "rgba(255, 255, 255, 0.3)",
                    },
                },
                outlined: {
                    borderColor: "rgba(255, 255, 255, 0.15)",
                    color: "#f3f4f6",
                    "&:hover": {
                        borderColor: "#06b6d4",
                        background: "rgba(6, 182, 212, 0.08)",
                    },
                },
            },
        },
        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    borderRadius: "12px",
                    backgroundColor: "rgba(255, 255, 255, 0.02)",
                    "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "rgba(255, 255, 255, 0.1)",
                        transition: "border-color 0.2s ease-in-out",
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "rgba(255, 255, 255, 0.2)",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#06b6d4",
                    },
                },
            },
        },
        MuiListItemButton: {
            styleOverrides: {
                root: {
                    borderRadius: "12px",
                    margin: "4px 12px",
                    padding: "10px 16px",
                    color: "#9ca3af",
                    transition: "all 0.2s ease",
                    "&.Mui-selected": {
                        backgroundColor: "rgba(168, 85, 247, 0.15)",
                        color: "#ffffff",
                        "&::before": {
                            content: '""',
                            position: "absolute",
                            left: 0,
                            top: "25%",
                            height: "50%",
                            width: "4px",
                            borderRadius: "2px",
                            backgroundColor: "#06b6d4",
                        },
                        "& .MuiListItemIcon-root": {
                            color: "#06b6d4",
                        },
                        "&:hover": {
                            backgroundColor: "rgba(168, 85, 247, 0.25)",
                        },
                    },
                    "&:hover": {
                        backgroundColor: "rgba(255, 255, 255, 0.05)",
                        color: "#ffffff",
                    },
                },
            },
        },
        MuiListItemIcon: {
            styleOverrides: {
                root: {
                    color: "inherit",
                    minWidth: "36px",
                },
            },
        },
        MuiTableCell: {
            styleOverrides: {
                root: {
                    borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
                    padding: "16px",
                },
                head: {
                    fontWeight: 700,
                    color: "#9ca3af",
                    borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
                },
            },
        },
    },
});

export default theme;