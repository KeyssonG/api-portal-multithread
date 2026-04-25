import axios from 'axios';
import type { CadastroFuncionarioFormState } from '../hooks/useCadastroFuncionarioForm';

export async function cadastrarFuncionario(data: CadastroFuncionarioFormState) {
  try {
    const response = await axios.post('http://localhost:8089/cadastrar/funcionario-multithread', data);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Erro ao cadastrar Funcionário.');
  }
}

export const funcionarioService = {
  async buscarFuncionariosPorEmpresaEDepartamento(companyId: number, departamento: string, dataInicio?: string, dataFim?: string, token?: string): Promise<any> {
    try {
      const params = {
        companyId,
        dataInicio: dataInicio || new Date().toISOString().split('T')[0],
        dataFim: dataFim || new Date().toISOString().split('T')[0],
      };
      const response = await axios.get(`http://localhost:8085/internal/employees/${departamento}/date`, {
        params,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar funcionários por departamento:', error);
      throw error;
    }
  },

  async buscarFuncionariosPorEmpresa(companyId: number, dataInicio?: string, dataFim?: string, token?: string): Promise<any> {
    try {
      const params = {
        companyId,
        dataInicio: dataInicio || new Date().toISOString().split('T')[0],
        dataFim: dataFim || new Date().toISOString().split('T')[0],
      };
      const response = await axios.get(`http://localhost:8085/internal/employees/date`, {
        params,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar funcionários de todos os departamentos:', error);
      throw error;
    }
  },

  async buscarFuncionariosPorDepartamento(departamento: string, dataInicio?: string, dataFim?: string, token?: string): Promise<any> {
    try {
      const params = {
        dataInicio: dataInicio || new Date().toISOString().split('T')[0],
        dataFim: dataFim || new Date().toISOString().split('T')[0],
      };
      const response = await axios.get(`http://localhost:8085/employees/${departamento}/date`, {
        params,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar funcionários por departamento:', error);
      throw error;
    }
  },

  async buscarFuncionariosTodosDepartamentos(dataInicio?: string, dataFim?: string, token?: string): Promise<any> {
    try {
      const params = {
        dataInicio: dataInicio || new Date().toISOString().split('T')[0],
        dataFim: dataFim || new Date().toISOString().split('T')[0],
      };
      const response = await axios.get('http://localhost:8085/employees/date', {
        params,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar funcionários de todos os departamentos:', error);
      throw error;
    }
  }
};
