import React from 'react';
import styles from '../styles/Login.module.css';

type LoginFormProps = {
  username: string;
  password: string;
  error?: string | null;
  isLoading: boolean;
  onUsernameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
};

export const LoginForm = ({
  username,
  password,
  error,
  isLoading,
  onUsernameChange,
  onPasswordChange,
  onSubmit
}: LoginFormProps) => (
  <div className={styles.loginBox}>
    <div className={styles.loginHeader}>
      <header>Login</header>
    </div>

    {error && <div className={styles.errorMessage}>{error}</div>}

    <form onSubmit={onSubmit}>
      <div className={styles.inputBox}>
        <input
          className={styles.inputField}
          type="text"
          placeholder="Usuário"
          value={username}
          onChange={onUsernameChange}
          required
          disabled={isLoading}
        />
      </div>

      <div className={styles.inputBox}>
        <input
          className={styles.inputField}
          type="password"
          placeholder="Senha"
          value={password}
          onChange={onPasswordChange}
          required
          disabled={isLoading}
        />
      </div>

      <div className={styles.inputSubmit}>
        <button 
          className={styles.submitBtn} 
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? 'Carregando...' : 'Entrar'}
        </button>
      </div>
    </form>
  </div>
);