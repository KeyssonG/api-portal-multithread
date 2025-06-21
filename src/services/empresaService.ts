import type { EmpresaPendente } from "../types/types";
import api from "./apiService";



export const fechEmpresaPendentes = async (): Promise<EmpresaPendente[]> => {
    try {
        const response = await api.get<EmpresaPendente[]>('/administracao/empresa/pendente/?numeroConta=');
        return response.data;
    } catch (err: any) {
        throw new Error(err.response?.data?.message || 'Erro ao buscar empresas pendentes');
    }
};

export const updateEmpresaStatus = async (empresa: EmpresaPendente, newStatus: string): Promise<void> => {
    try {
        await api.put(`/administracao/status/conta?numeroConta=${empresa.numeroConta}`, {
            newStatus,
        });
    } catch (err: any) {
        throw new Error(err.response?.data?.message || 'Erro ao atualizar status da empresa');
    }
};