import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';

type PasswordChangeHookReturn = {
  success: boolean;
  error: string | null;
};

export const usePasswordChangeForm = (initialToken: string, initialUsername: string) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent): Promise<PasswordChangeHookReturn> => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      setError('As senhas não coincidem');
      return { success: false, error: 'As senhas não coincidem' };
    }

    setIsLoading(true);
    setError(null);

    try {
      await authService.changePassword(initialToken, newPassword);
      login(initialToken, initialUsername);
      navigate('/dashboard');
      
      return { success: true, error: null };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Falha ao alterar senha';
      setError(message);
      return { success: false, error: message };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formState: { newPassword, confirmPassword },
    formActions: { setNewPassword, setConfirmPassword },
    apiState: { isLoading, error },
    handleSubmit
  };
};