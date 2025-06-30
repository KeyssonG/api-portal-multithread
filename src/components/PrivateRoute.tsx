
import React from "react";
import { Navigate } from "react-router";

export function PrivateRoute({ children }: {children: React.ReactElement}) {
    const token = localStorage.getItem('token');
    return token ? children : <Navigate to="/login" replace />;
}