import {
    Box,
    Button,
    Paper,
    TextField,
    Typography,
} from "@mui/material";

import { useState } from "react";

import { login } from "../api/auth";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {

    const [email, setEmail] = useState("");

    const [password, setPassword] =
        useState("");

    const auth = useAuth();

    const navigate=useNavigate();



    async function handleLogin() {

        try {

            const response =
                await login(email, password);
            

            auth.loginUser(
                response.access_token
            );

            navigate("/dashboard");

        }

        catch (error:any) {

            console.error(error);

            alert(
                error?.response?.data?.detail ??
                error?.message ??
                "Login failed"
            );

        }

    }

    return (
        <Box
            sx={{
                position: "relative",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh",
                width: "100vw",
                overflow: "hidden",
                background: "radial-gradient(circle at 30% 30%, rgba(168, 85, 247, 0.15) 0%, transparent 50%), radial-gradient(circle at 70% 70%, rgba(6, 182, 212, 0.15) 0%, transparent 50%), #070a12",
            }}
        >
            {/* Glowing background shapes */}
            <Box
                sx={{
                    position: "absolute",
                    width: "350px",
                    height: "350px",
                    borderRadius: "50%",
                    background: "rgba(168, 85, 247, 0.15)",
                    filter: "blur(70px)",
                    top: "15%",
                    left: "20%",
                    pointerEvents: "none",
                }}
            />
            <Box
                sx={{
                    position: "absolute",
                    width: "350px",
                    height: "350px",
                    borderRadius: "50%",
                    background: "rgba(6, 182, 212, 0.15)",
                    filter: "blur(70px)",
                    bottom: "15%",
                    right: "20%",
                    pointerEvents: "none",
                }}
            />

            <Paper
                elevation={0}
                sx={{
                    p: 6,
                    width: 440,
                    borderRadius: 4,
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    backgroundColor: "rgba(17, 25, 40, 0.75)",
                    backdropFilter: "blur(20px)",
                    boxShadow: "0 20px 50px rgba(0, 0, 0, 0.4), 0 0 30px rgba(168, 85, 247, 0.1)",
                    zIndex: 1,
                    textAlign: "center",
                }}
            >
                <Typography
                    variant="h3"
                    sx={{
                        fontWeight: 900,
                        mb: 1,
                        background: "linear-gradient(135deg, #a855f7 0%, #06b6d4 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        letterSpacing: "-1px",
                    }}
                >
                    ForgeAI
                </Typography>

                <Typography
                    variant="body1"
                    sx={{
                        color: "text.secondary",
                        mb: 4,
                        fontWeight: 500,
                        fontSize: "0.95rem",
                    }}
                >
                    Enterprise AI Knowledge Suite for Steel Plants
                </Typography>

                <Box sx={{ textAlign: "left" }}>
                    <TextField
                        fullWidth
                        label="Email Address"
                        margin="normal"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        slotProps={{
                            inputLabel: { style: { color: "rgba(255, 255, 255, 0.5)" } }
                        }}
                    />

                    <TextField
                        fullWidth
                        type="password"
                        label="Password"
                        margin="normal"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        slotProps={{
                            inputLabel: { style: { color: "rgba(255, 255, 255, 0.5)" } }
                        }}
                    />
                </Box>

                <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    sx={{
                        mt: 4,
                        py: 1.5,
                        fontSize: "1rem",
                        fontWeight: 700,
                        letterSpacing: "0.5px",
                        boxShadow: "0 4px 20px rgba(168, 85, 247, 0.3)",
                    }}
                    onClick={handleLogin}
                >
                    Access Platform
                </Button>
            </Paper>
        </Box>
    );

}