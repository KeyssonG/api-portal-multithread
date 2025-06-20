import axios from 'axios';
import type { EmpresaPendente } from "../types/types";

const apiAdministracao = axios.create({
    baseURL: 'http://localhost:31000',
});



export const fechEmpresaPendentes = async (): Promise<EmpresaPendente[]> => {
    try {
        const response = await apiAdministracao.get<EmpresaPendente[]>('/administracao/empresa/pendente/?numeroConta=');
        return response.data;
    } catch (err: any) {
        throw new Error('Erro ao buscar empresas pendentes');
    }
};

export const updateEmpresaStatus = async (empresa: EmpresaPendente, newStatus: string): Promise<void> => {
    try {
        await apiAdministracao.put(`/administracao/status/conta?numeroConta=${empresa.numeroConta}`, {
            newStatus,
        });
    } catch (err: any) {
        throw new Error('Erro ao atualizar status da empresa');
    }
};