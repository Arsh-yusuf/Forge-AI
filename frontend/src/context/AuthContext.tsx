import {
    createContext,
    useContext,
    useState,
} from "react";

interface AuthContextType {

    token: string | null;

    loginUser: (token: string) => void;

    logout: () => void;
}

const AuthContext = createContext<AuthContextType>(
    {} as AuthContextType
);

export function AuthProvider({
    children,
}: {
    children: React.ReactNode;
}) {

    const [token, setToken] = useState(
        localStorage.getItem("access_token")
    );

    function loginUser(token: string) {

        localStorage.setItem(
            "access_token",
            token
        );

        setToken(token);
    }

    function logout() {

        localStorage.removeItem(
            "access_token"
        );

        setToken(null);
    }

    return (

        <AuthContext.Provider
            value={{
                token,
                loginUser,
                logout,
            }}
        >

            {children}

        </AuthContext.Provider>

    );
}

export function useAuth() {

    return useContext(AuthContext);
}