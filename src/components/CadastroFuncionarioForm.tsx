import React from 'react';
import styles from '../styles/CadastroFuncionario.module.css';
import { IMaskInput } from 'react-imask';

interface Props {
  nome: string;
  email: string;
  cpf: string;
  sexo: string;
  dataNascimento: string;
  telefone: string;
  username: string;
  departamento: string;
  error: string;
  success: boolean;
  isLoading: boolean;
  onNomeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCpfChange: (value: string) => void;
  onSexoChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onDataNascimentoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onTelefoneChange: (value: string) => void;
  onUsernameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDepartamentoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const CadastroFuncionarioForm: React.FC<Props> = ({
  nome,
  email,
  cpf,
  sexo,
  dataNascimento,
  telefone,
  username,
  departamento,
  error,
  success,
  isLoading,
  onNomeChange,
  onEmailChange,
  onCpfChange,
  onSexoChange,
  onDataNascimentoChange,
  onTelefoneChange,
  onUsernameChange,
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
    <select
      value={sexo}
      onChange={onSexoChange}
      className={styles.inputField}
      required
    >
      <option value="">Selecione o sexo</option>
      <option value="M">Masculino</option>
      <option value="F">Feminino</option>
      <option value="O">Outro</option>
    </select>
    <input
      type="text"
      placeholder="Usuário"
      value={username}
      onChange={onUsernameChange}
      required
    />
    <input
      type="date"
      placeholder="Data de nascimento"
      value={dataNascimento}
      onChange={onDataNascimentoChange}
      required
    />
    <IMaskInput
      mask={[{ mask: '(00) 0000-0000' }, { mask: '(00) 00000-0000' }]}
      value={telefone}
      onAccept={onTelefoneChange}
      className={styles.inputField}
      placeholder="Telefone"
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
