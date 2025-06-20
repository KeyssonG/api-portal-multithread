import React, { createContext, useState, useContext } from "react";
import type { EmpresaPendente } from "../types/types";

interface DashboardContextType {
    empresaSelecionada: EmpresaPendente | null;
    setEmpresaSelecionada: (empresa: EmpresaPendente | null) => void;
    showEmpresasPendentes: boolean;
    setShowEmpresasPendentes: (value: boolean) => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export const DashboardProvider = ({ children }: { children: React.ReactNode }) => {
  const [empresaSelecionada, setEmpresaSelecionada] = useState<EmpresaPendente | null>(null);
  const [showEmpresasPendentes, setShowEmpresasPendentes] = useState(false);

  return (
    <DashboardContext.Provider
      value={{
        empresaSelecionada,
        setEmpresaSelecionada,
        showEmpresasPendentes,
        setShowEmpresasPendentes,
      }}
    >
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
