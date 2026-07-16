import {
    Alert,
    Box,
    Button,
    FormControl,
    IconButton,
    InputAdornment,
    InputLabel,
    Link,
    MenuItem,
    Paper,
    Select,
    TextField,
    Typography,
} from "@mui/material";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

import { login, register } from "../api/auth";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const ROLES = [
    "Plant Manager",
    "Maintenance Engineer",
    "Safety Officer",
    "Quality Engineer",
    "Operations Engineer"
];

const DEPARTMENTS = [
    "Maintenance",
    "Safety",
    "Production",
    "Quality",
    "Operations",
    "Utilities",
    "Warehouse"
];

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function parseError(error: any): string {
    const detail = error?.response?.data?.detail;
    if (typeof detail === "string") return detail;
    if (Array.isArray(detail) && detail.length > 0) {
        return detail[0]?.msg ?? "Validation error";
    }
    return error?.message ?? "Authentication failed";
}

export default function Login() {
    const [isRegister, setIsRegister] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [fullName, setFullName] = useState("");
    const [role, setRole] = useState("Operations Engineer");
    const [department, setDepartment] = useState("Operations");
    const [showPassword, setShowPassword] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [loading, setLoading] = useState(false);

    const auth = useAuth();
    const navigate = useNavigate();

    function switchMode() {
        setIsRegister((prev) => !prev);
        setErrorMsg("");
        setShowPassword(false);
    }

    async function handleAuth() {
        setErrorMsg("");

        if (!email || !password) {
            setErrorMsg("Email and password are required.");
            return;
        }

        if (!EMAIL_REGEX.test(email)) {
            setErrorMsg("Please enter a valid email address.");
            return;
        }

        if (isRegister && !fullName.trim()) {
            setErrorMsg("Full name is required.");
            return;
        }

        setLoading(true);
        try {
            let response;
            if (isRegister) {
                response = await register(fullName, email, password, role, department);
            } else {
                response = await login(email, password);
            }

            auth.loginUser(response.access_token);
            navigate("/dashboard");
        } catch (error: any) {
            console.error(error);
            setErrorMsg(parseError(error));
        } finally {
            setLoading(false);
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
            {/* Glowing background orbs */}
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
                    p: 5,
                    width: 460,
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
                        mb: 3,
                        fontWeight: 500,
                        fontSize: "0.95rem",
                    }}
                >
                    Enterprise AI Knowledge Suite for Steel Plants
                </Typography>

                <Typography
                    variant="h5"
                    sx={{
                        fontWeight: 700,
                        color: "#fff",
                        mb: 2,
                    }}
                >
                    {isRegister ? "Create Account" : "Access Platform"}
                </Typography>

                {/* Inline error banner */}
                {errorMsg && (
                    <Alert
                        severity="error"
                        onClose={() => setErrorMsg("")}
                        sx={{
                            mb: 2,
                            borderRadius: 2,
                            textAlign: "left",
                            fontSize: "0.85rem",
                        }}
                    >
                        {errorMsg}
                    </Alert>
                )}

                <Box sx={{ textAlign: "left", display: "flex", flexDirection: "column", gap: 1.5 }}>
                    {isRegister && (
                        <TextField
                            fullWidth
                            label="Full Name"
                            size="small"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            slotProps={{
                                inputLabel: { style: { color: "rgba(255, 255, 255, 0.5)" } }
                            }}
                        />
                    )}

                    <TextField
                        fullWidth
                        label="Email Address"
                        size="small"
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);
                            if (errorMsg) setErrorMsg("");
                        }}
                        error={!!errorMsg && !EMAIL_REGEX.test(email) && email.length > 0}
                        helperText={
                            email.length > 0 && !EMAIL_REGEX.test(email)
                                ? "Enter a valid email address"
                                : ""
                        }
                        slotProps={{
                            inputLabel: { style: { color: "rgba(255, 255, 255, 0.5)" } }
                        }}
                    />

                    <TextField
                        fullWidth
                        label="Password"
                        size="small"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value);
                            if (errorMsg) setErrorMsg("");
                        }}
                        slotProps={{
                            inputLabel: { style: { color: "rgba(255, 255, 255, 0.5)" } },
                            input: {
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() => setShowPassword((prev) => !prev)}
                                            edge="end"
                                            size="small"
                                            sx={{ color: "rgba(255,255,255,0.4)", "&:hover": { color: "#a855f7" } }}
                                            aria-label={showPassword ? "Hide password" : "Show password"}
                                        >
                                            {showPassword
                                                ? <EyeOff size={16} />
                                                : <Eye size={16} />
                                            }
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }
                        }}
                    />

                    {isRegister && (
                        <>
                            <FormControl fullWidth size="small">
                                <InputLabel id="role-select-label" sx={{ color: "rgba(255, 255, 255, 0.5)" }}>
                                    Role
                                </InputLabel>
                                <Select
                                    labelId="role-select-label"
                                    value={role}
                                    label="Role"
                                    onChange={(e) => setRole(e.target.value)}
                                    sx={{
                                        color: "#fff",
                                        "& .MuiOutlinedInput-notchedOutline": {
                                            borderColor: "rgba(255, 255, 255, 0.15)",
                                        },
                                        "&:hover .MuiOutlinedInput-notchedOutline": {
                                            borderColor: "rgba(255, 255, 255, 0.3)",
                                        },
                                    }}
                                >
                                    {ROLES.map((r) => (
                                        <MenuItem key={r} value={r}>
                                            {r}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <FormControl fullWidth size="small">
                                <InputLabel id="dept-select-label" sx={{ color: "rgba(255, 255, 255, 0.5)" }}>
                                    Department
                                </InputLabel>
                                <Select
                                    labelId="dept-select-label"
                                    value={department}
                                    label="Department"
                                    onChange={(e) => setDepartment(e.target.value)}
                                    sx={{
                                        color: "#fff",
                                        "& .MuiOutlinedInput-notchedOutline": {
                                            borderColor: "rgba(255, 255, 255, 0.15)",
                                        },
                                        "&:hover .MuiOutlinedInput-notchedOutline": {
                                            borderColor: "rgba(255, 255, 255, 0.3)",
                                        },
                                    }}
                                >
                                    {DEPARTMENTS.map((d) => (
                                        <MenuItem key={d} value={d}>
                                            {d}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </>
                    )}
                </Box>

                <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    disabled={loading}
                    sx={{
                        mt: 3,
                        py: 1.2,
                        fontSize: "0.95rem",
                        fontWeight: 700,
                        letterSpacing: "0.5px",
                        boxShadow: "0 4px 20px rgba(168, 85, 247, 0.3)",
                    }}
                    onClick={handleAuth}
                >
                    {loading
                        ? (isRegister ? "Creating account..." : "Signing in...")
                        : (isRegister ? "Sign Up & Login" : "Access Platform")
                    }
                </Button>

                <Box sx={{ mt: 3 }}>
                    <Link
                        component="button"
                        variant="body2"
                        onClick={switchMode}
                        sx={{
                            color: "#06b6d4",
                            textDecoration: "none",
                            fontWeight: 600,
                            "&:hover": {
                                color: "#a855f7",
                                textDecoration: "underline",
                            }
                        }}
                    >
                        {isRegister ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
                    </Link>
                </Box>
            </Paper>
        </Box>
    );
}