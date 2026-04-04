import axios from "axios";
import type { CompanyModuloResponse, CompanyResponseDTO, EmpresaPendente, StatusEmpresaData } from "../types/types";
import api from "./apiService";

export const getCompaniesByStatus = async (statusId: number): Promise<CompanyResponseDTO[]> => {
    try {
        const response = await api.get<CompanyResponseDTO[]>(`/administracao/empresa/status/${statusId}`);
        return response.data;
    } catch (err) {
        let errorMessage = 'Erro ao buscar empresas por status';
        if (axios.isAxiosError(err)) {
            errorMessage = err.response?.data?.message || errorMessage;
        }
        throw new Error(errorMessage);
    }
};

export const getCompanyModulos = async (): Promise<CompanyModuloResponse[]> => {
    try {
        const response = await api.get<CompanyModuloResponse[]>('/administracao/empresa/modulo');
        return response.data;
    } catch (err) {
        let errorMessage = 'Erro ao buscar vínculos de empresas e módulos';
        if (axios.isAxiosError(err)) {
            errorMessage = err.response?.data?.message || errorMessage;
        }
        throw new Error(errorMessage);
    }
};

export const fechEmpresaPendentes = async (): Promise<EmpresaPendente[]> => {
    try {
        const response = await api.get<EmpresaPendente[]>('/administracao/empresa/pendente/?numeroConta=');
        return response.data;
    } catch (err) {
        let errorMessage = 'Erro ao buscar empresas pendentes';
        if (axios.isAxiosError(err)) {
            errorMessage = err.response?.data?.message || errorMessage;
        }
        throw new Error(errorMessage);
    }
};

export const updateEmpresaStatus = async (empresa: EmpresaPendente, newStatus: string): Promise<void> => {
    try {
        await api.put(`/administracao/status/conta?numeroConta=${empresa.accountNumber}`, {
            newStatus,
        });
    } catch (err) {
        let errorMessage = 'Erro ao atualizar status da empresa';
        if (axios.isAxiosError(err)) {
            errorMessage = err.response?.data?.message || errorMessage;
        }
        throw new Error(errorMessage);
    }
};

export const getStatusEmpresas = async (): Promise<StatusEmpresaData> => {
    try {
        const response = await api.get<StatusEmpresaData>('/administracao/empresa/status');
        return response.data;
    } catch (err) {
        let errorMessage = 'Erro ao buscar status das empresas';
        if (axios.isAxiosError(err)) {
            errorMessage = err.response?.data?.message || errorMessage;
        }
        throw new Error(errorMessage);
    }
}

export const linkCompanyModulo = async (companyId: number, moduloId: number, status: number): Promise<void> => {
    try {
        await api.post('/administracao/empresa/modulo', {
            companyId,
            moduloId,
            status
        });
    } catch (err) {
        let errorMessage = 'Erro ao vincular empresa ao módulo';
        if (axios.isAxiosError(err)) {
            errorMessage = err.response?.data?.message || errorMessage;
        }
        throw new Error(errorMessage);
    }
};