import api from './apiService';
import { API_CONFIG } from '../constants/config';
import type { CadastroFuncionarioFormState } from '../hooks/useCadastroFuncionarioForm';

export async function cadastrarFuncionario(data: CadastroFuncionarioFormState) {
  try {
    const response = await api.post(API_CONFIG.ENDPOINTS.CADASTRAR_FUNCIONARIO, data);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Erro ao cadastrar Funcionário.');
  }
}

export const funcionarioService = {
  async buscarFuncionariosPorEmpresaEDepartamento(companyId: number, departamento: string, dataInicio?: string, dataFim?: string): Promise<any> {
    try {
      const params = {
        companyId,
        dataInicio: dataInicio || new Date().toISOString().split('T')[0],
        dataFim: dataFim || new Date().toISOString().split('T')[0],
      };
      const response = await api.get(`${API_CONFIG.ENDPOINTS.INTERNAL_EMPLOYEES_DEPARTAMENTO}/${departamento}/date`, {
        params,
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar funcionários por departamento:', error);
      throw error;
    }
  },

  async buscarFuncionariosPorEmpresa(companyId: number, dataInicio?: string, dataFim?: string): Promise<any> {
    try {
      const params = {
        companyId,
        dataInicio: dataInicio || new Date().toISOString().split('T')[0],
        dataFim: dataFim || new Date().toISOString().split('T')[0],
      };
      const response = await api.get(API_CONFIG.ENDPOINTS.INTERNAL_EMPLOYEES, {
        params,
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar funcionários de todos os departamentos:', error);
      throw error;
    }
  },

  async buscarFuncionariosPorDepartamento(departamento: string, dataInicio?: string, dataFim?: string): Promise<any> {
    try {
      const params = {
        dataInicio: dataInicio || new Date().toISOString().split('T')[0],
        dataFim: dataFim || new Date().toISOString().split('T')[0],
      };
      const response = await api.get(`${API_CONFIG.ENDPOINTS.EMPLOYEES_DEPARTAMENTO}/${departamento}/date`, {
        params,
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar funcionários por departamento:', error);
      throw error;
    }
  },

  async buscarFuncionariosTodosDepartamentos(dataInicio?: string, dataFim?: string): Promise<any> {
    try {
      const params = {
        dataInicio: dataInicio || new Date().toISOString().split('T')[0],
        dataFim: dataFim || new Date().toISOString().split('T')[0],
      };
      const response = await api.get(API_CONFIG.ENDPOINTS.EMPLOYEES, {
        params,
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar funcionários de todos os departamentos:', error);
      throw error;
    }
  }
};
