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

export default function Login() {

    const [email, setEmail] = useState("");

    const [password, setPassword] =
        useState("");

    const auth = useAuth();

    async function handleLogin() {

        try {

            const response =
                await login(email, password);

            auth.loginUser(
                response.access_token
            );

            window.location.href =
                "/dashboard";

        }

        catch {

            alert("Invalid credentials");

        }

    }

    return (

        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="100vh"
        >

            <Paper
                sx={{
                    p: 5,
                    width: 400,
                }}
            >

                <Typography
                    variant="h4"
                    gutterBottom
                >

                    ForgeAI

                </Typography>

                <Typography
                    mb={3}
                >

                    AI Assistant for Steel Plants

                </Typography>

                <TextField
                    fullWidth
                    label="Email"
                    margin="normal"
                    value={email}
                    onChange={(e)=>
                        setEmail(e.target.value)
                    }
                />

                <TextField
                    fullWidth
                    type="password"
                    label="Password"
                    margin="normal"
                    value={password}
                    onChange={(e)=>
                        setPassword(e.target.value)
                    }
                />

                <Button
                    fullWidth
                    variant="contained"
                    sx={{ mt:2 }}
                    onClick={handleLogin}
                >

                    Login

                </Button>

            </Paper>

        </Box>

    );

}