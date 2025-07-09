import React from 'react';
import styles from '../styles/CadastroFuncionario.module.css';
import { IMaskInput } from 'react-imask';

interface Props {
  nome: string;
  email: string;
  cpf: string;
  username: string;
  password: string;
  departamento: string;
  error: string;
  success: boolean;
  isLoading: boolean;
  onNomeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCpfChange: (value: string) => void;
  onUsernameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDepartamentoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const CadastroFuncionarioForm: React.FC<Props> = ({
  nome,
  email,
  cpf,
  username,
  password,
  departamento,
  error,
  success,
  isLoading,
  onNomeChange,
  onEmailChange,
  onCpfChange,
  onUsernameChange,
  onPasswordChange,
  onDepartamentoChange,
  onSubmit,
}) => (
  <form className={styles.form} onSubmit={onSubmit}>
    <input
      type="text"
      placeholder="Nome"
      value={nome}
      onChange={onNomeChange}
      required
    />
    <input
      type="email"
      placeholder="Email"
      value={email}
      onChange={onEmailChange}
      required
    />
    <IMaskInput
      mask="000.000.000-00"
      value={cpf}
      onAccept={onCpfChange}
      className={styles.inputField}
      placeholder="CPF"
      required
    />
    <input
      type="text"
      placeholder="Usuário"
      value={username}
      onChange={onUsernameChange}
      required
    />
    <input
      type="password"
      placeholder="Senha"
      value={password}
      onChange={onPasswordChange}
      required
    />
    <input
      type="text"
      placeholder="Departamento"
      value={departamento}
      onChange={onDepartamentoChange}
      required
    />
    {error && <div className={styles.error}>{error}</div>}
    {success && <div className={styles.success}>Funcionário cadastrado com sucesso!</div>}
    <button type="submit" disabled={isLoading}>
      {isLoading ? 'Cadastrando...' : 'Cadastrar'}
    </button>
  </form>
);
