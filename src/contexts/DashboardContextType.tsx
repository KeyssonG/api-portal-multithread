import React, { createContext, useState, useContext } from "react";

interface DashboardContextType {
    showEmpresasPendentes: boolean;
    setShowEmpresasPendentes: (value: boolean) => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export const DashboardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [showEmpresasPendentes, setShowEmpresasPendentes] = useState(false);

    return (
        <DashboardContext.Provider value={{showEmpresasPendentes, setShowEmpresasPendentes}}>
            {children}
        </DashboardContext.Provider>
    );
};

export const useDashboard = () => {
    const context = useContext(DashboardContext);
    if (!context) {
        throw new Error('useDashboard deve ser usado dentro de DashboardProvider');
    }
    return context
};
