import { useState } from 'react';
import { cadastrarFuncionario } from '../services/funcionarioService';

export interface CadastroFuncionarioFormState {
  nome: string;
  email: string;
  cpf: string;
  username: string;
  password: string;
  departamento: string;
}

export function useCadastroFuncionarioForm() {
  const [formState, setFormState] = useState<CadastroFuncionarioFormState>({
    nome: '',
    email: '',
    cpf: '',
    username: '',
    password: '',
    departamento: '',
  });
  const [apiState, setApiState] = useState({
    isLoading: false,
    error: '',
    success: false,
  });

  const formActions = {
    setNome: (nome: string) => setFormState((s) => ({ ...s, nome })),
    setEmail: (email: string) => setFormState((s) => ({ ...s, email })),
    setCpf: (cpf: string) => setFormState((s) => ({ ...s, cpf })),
    setUsername: (username: string) => setFormState((s) => ({ ...s, username })),
    setPassword: (password: string) => setFormState((s) => ({ ...s, password })),
    setDepartamento: (departamento: string) => setFormState((s) => ({ ...s, departamento })),
    reset: () => setFormState({ nome: '', email: '', cpf: '', username: '', password: '', departamento: '' }),
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiState({ isLoading: true, error: '', success: false });
    try {
      await cadastrarFuncionario(formState);
      setApiState({ isLoading: false, error: '', success: true });
      formActions.reset();
    } catch (err: any) {
      setApiState({ isLoading: false, error: err.message || 'Erro ao cadastrar', success: false });
    }
  };

  return { formState, apiState, formActions, handleSubmit };
}
