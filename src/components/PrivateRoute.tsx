
import React from "react";
import { Navigate } from "react-router";
import { useAuth } from "../contexts/AuthContext";
import { isTokenExpired } from "../utils/jwt";

export function PrivateRoute({ children }: {children: React.ReactElement}) {
    const { token } = useAuth();
    const authenticated = !!token && !isTokenExpired(token);
    return authenticated ? children : <Navigate to="/login" replace />;
}
