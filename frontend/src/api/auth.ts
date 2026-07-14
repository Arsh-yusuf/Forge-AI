import api from "./api";

export async function login(
    email: string,
    password: string
) {

    const response = await api.post(
        "/auth/login",
        {
            email,
            password,
        }
    );

    return response.data;
}

export async function register(
    fullName: string,
    email: string,
    password: string,
    role: string,
    department: string
) {
    const response = await api.post(
        "/auth/register",
        {
            full_name: fullName,
            email,
            password,
            role,
            department,
        }
    );

    return response.data;
}