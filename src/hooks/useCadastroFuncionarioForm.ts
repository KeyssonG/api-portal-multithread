import { useState } from 'react';
import { cadastrarFuncionario } from '../services/funcionarioService';

export interface CadastroFuncionarioFormState {
  nome: string;
  email: string;
  cpf: string;
  dataNascimento: string;
  username: string;
  password: string;
  departamento: string;
}

export function useCadastroFuncionarioForm() {
  const [formState, setFormState] = useState<CadastroFuncionarioFormState>({
    nome: '',
    email: '',
    cpf: '',
    dataNascimento: '',
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
    setDataNascimento: (dataNascimento: string) => setFormState((s) => ({ ...s, dataNascimento })),
    setUsername: (username: string) => setFormState((s) => ({ ...s, username })),
    setPassword: (password: string) => setFormState((s) => ({ ...s, password })),
    setDepartamento: (departamento: string) => setFormState((s) => ({ ...s, departamento })),
    reset: () => setFormState({ nome: '', email: '', cpf: '', dataNascimento: '', username: '', password: '', departamento: '' }),
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Iniciando cadastro de funcionário:', formState);
    
    setApiState({ isLoading: true, error: '', success: false });
    
    try {
      const result = await cadastrarFuncionario(formState);
      console.log('Funcionário cadastrado com sucesso:', result);
      setApiState({ isLoading: false, error: '', success: true });
      formActions.reset();
      
      // Mostrar mensagem de sucesso por alguns segundos
      setTimeout(() => {
        setApiState(prev => ({ ...prev, success: false }));
      }, 3000);
      
    } catch (err: any) {
      console.error('Erro no cadastro de funcionário:', err);
      setApiState({ 
        isLoading: false, 
        error: err.message || 'Erro ao cadastrar funcionário. Tente novamente.', 
        success: false 
      });
    }
  };

  return { formState, apiState, formActions, handleSubmit };
}
