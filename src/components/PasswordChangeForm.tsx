import React from 'react';
import styles from '../styles/Login.module.css';

type PasswordChangeFormProps = {
  newPassword: string;
  confirmPassword: string;
  error?: string | null;
  isLoading: boolean;
  onNewPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onConfirmPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
};

export const PasswordChangeForm = ({
  newPassword,
  confirmPassword,
  error,
  isLoading,
  onNewPasswordChange,
  onConfirmPasswordChange,
  onSubmit
}: PasswordChangeFormProps) => (
  <div className={styles.loginBox}>
    <div className={styles.loginHeader}>
      <header>Primeiro Acesso</header>
      <p>Por favor, defina uma nova senha</p>
    </div>

    {error && <div className={styles.errorMessage}>{error}</div>}

    <form onSubmit={onSubmit}>
      <div className={styles.inputBox}>
        <input
          className={styles.inputField}
          type="password"
          placeholder="Nova Senha"
          value={newPassword}
          onChange={onNewPasswordChange}
          required
          minLength={6}
          disabled={isLoading}
        />
      </div>

      <div className={styles.inputBox}>
        <input
          className={styles.inputField}
          type="password"
          placeholder="Confirmar Nova Senha"
          value={confirmPassword}
          onChange={onConfirmPasswordChange}
          required
          minLength={6}
          disabled={isLoading}
        />
      </div>

      <div className={styles.inputSubmit}>
        <button
          className={styles.submitBtn}
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? 'Processando...' : 'Alterar Senha'}
        </button>
      </div>
    </form>
  </div>
);