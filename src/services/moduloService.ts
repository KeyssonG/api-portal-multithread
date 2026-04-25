import axios, { AxiosError } from "axios";
import type { Modulo } from "../types/types";
import api from "./apiService";
import type { CompanyModuloDTO, LinkUserModuloRequest, UserModuloResponse } from "../types/modulo";

export const fetchModulos = async (id?: string): Promise<Modulo[]> => {
    try {
        const url = id ? `/administracao/modulos?id=${id}` : '/administracao/modulos';
        const response = await api.get<Modulo[]>(url);
        return response.data;
    } catch (err) {
        let errorMessage = 'Erro ao buscar módulos';
        if (axios.isAxiosError(err)) {
            const axiosError = err as AxiosError<{ message?: string }>;
            errorMessage = axiosError.response?.data?.message || errorMessage;
        }
        throw new Error(errorMessage);
    }
};

export const moduloService = {
    // Busca módulos da empresa usando o endpoint específico do Portal
    async getModulosByCompany(_token: string, companyId: number): Promise<CompanyModuloDTO[]> {
      try {
        const response = await api.get(`/administracao/portal/empresa/modulos?companyId=${companyId}`);
        return response.data;
      } catch (error) {
        console.error('Erro ao buscar módulos da empresa:', error);
        throw error;
      }
    },
  
    // Vincula usuário ao módulo usando o endpoint específico do Portal (envia companyId no body)
    async vincularUsuarioModulo(data: LinkUserModuloRequest & { companyId: number }, _token: string): Promise<void> {
      try {
        await api.post('/administracao/portal/usuario/modulo', data);
      } catch (error) {
        console.error('Erro ao vincular usuário ao módulo:', error);
        throw error;
      }
    },

    // Busca vínculos usando o endpoint específico do Portal
    async getUsuariosModulosPorEmpresa(companyId: number, _token: string): Promise<UserModuloResponse[]> {
      try {
        const response = await api.get(`/administracao/portal/usuario/modulo?companyId=${companyId}`);
        return response.data;
      } catch (error) {
        console.error('Erro ao buscar vínculos de usuários:', error);
        throw error;
      }
    }
  };
  
  export default moduloService;
