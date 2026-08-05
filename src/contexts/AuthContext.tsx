import { createContext, useState, useEffect, useContext, useCallback, type ReactNode } from "react";
import { isTokenExpired, getJwtPayload } from "../utils/jwt";

type AuthContextType = {
    token: string | null;
    name: string | null;
    isAuthenticated: boolean;
    login: (token: string, name: string) => void;
    logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth deve ser usado dentro de um AuthProvider');
    }
    return context;
};


type AuthProviderProps = {
    children: ReactNode;
};

function initAuthState(): { token: string | null; name: string | null } {
    const storedToken = localStorage.getItem('token');
    const storedName = localStorage.getItem('userName');
    if (storedToken && isTokenExpired(storedToken)) {
        localStorage.removeItem('token');
        localStorage.removeItem('userName');
        return { token: null, name: null };
    }
    return { token: storedToken, name: storedName };
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [initial] = useState(initAuthState);
    const [token, setToken] = useState<string | null>(initial.token);
    const [name, setName] = useState<string | null>(initial.name);

    const logout = useCallback(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('userName');
        setToken(null);
        setName(null);
    }, []);

    const login = useCallback((newToken: string, newName: string) => {
        localStorage.setItem('token', newToken);
        localStorage.setItem('userName', newName);
        setToken(newToken);
        setName(newName);
    }, []);

    useEffect(() => {
        if (!token) return;
        const payload = getJwtPayload(token);
        if (!payload || typeof payload.exp !== 'number') return;
        const msUntilExpiration = payload.exp * 1000 - Date.now();
        if (msUntilExpiration <= 0) {
            logout();
            return;
        }
        const timeoutId = window.setTimeout(() => logout(), msUntilExpiration);
        return () => window.clearTimeout(timeoutId);
    }, [token, logout]);

    const value = {
        token,
        name,
        isAuthenticated: !!token,
        login,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
