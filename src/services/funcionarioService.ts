import axios from 'axios';
import type { CadastroFuncionarioFormState } from '../hooks/useCadastroFuncionarioForm';

export async function cadastrarFuncionario(data: CadastroFuncionarioFormState) {
  try {
    const response = await axios.post('https://localhost:8089/cadastrar/funcionario', data);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Erro ao cadastrar Funcionário.');
  }
}
