import React, { createContext, useState, useContext } from "react";
import type { EmpresaPendente } from "../types/types";

interface DashboardContextType {
    empresaSelecionada: EmpresaPendente | null;
    setEmpresaSelecionada: (empresa: EmpresaPendente | null) => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export const DashboardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [empresaSelecionada, setEmpresaSelecionada] = useState<EmpresaPendente | null>(null);

    return (
        <DashboardContext.Provider value={{ empresaSelecionada, setEmpresaSelecionada }}>
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
