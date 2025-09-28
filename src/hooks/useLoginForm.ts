import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';

type LoginResponse = {
  token: string;
  primeiroAcesso?: boolean;
  username?: string;
};

type LoginHookReturn = {
  needsPasswordChange: boolean;
  token?: string;
  username?: string;
};

export const useLoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent): Promise<LoginHookReturn> => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const { data }: { data: LoginResponse } = await authService.login(username, password);
      
      if (!data.token) {
        throw new Error('Token não encontrado na resposta da API');
      }

      if (data.primeiroAcesso) {
        return { 
          needsPasswordChange: true, 
          token: data.token,
          username: data.username || username
        };
      }

      login(data.token, data.username || username);
      navigate('/dashboard');
      
      return { needsPasswordChange: false };
      
    } catch (error: any) {
      console.error('Erro no login:', error);

      const errorMessage = 'Erro ao fazer o login, revise os dados de usuário e senha';
      setError(errorMessage);
      return { needsPasswordChange: false };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formState: {
      username,
      password
    },
    formActions: {
      setUsername,
      setPassword
    },
    apiState: {
      isLoading,
      error
    },
    handleSubmit
  };
};