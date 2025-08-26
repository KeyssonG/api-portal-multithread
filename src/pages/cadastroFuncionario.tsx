import React from "react";
import styles from "../styles/CadastroFuncionario.module.css";
import Footer from "../components/Footer";
import { CadastroFuncionarioForm } from "../components/CadastroFuncionarioForm";
import { useCadastroFuncionarioForm } from "../hooks/useCadastroFuncionarioForm";

const CadastroFuncionario: React.FC = () => {
  const { formState, apiState, formActions, handleSubmit } = useCadastroFuncionarioForm();

  return (
    <div className={styles.container} style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <header className={styles.header}>
        <h1>Portal MultiThread</h1>
      </header>
      <div className={styles["register-box"]} style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div className={styles["login-header"]}>
          <header>Cadastrar funcionário</header>
        </div>
        <CadastroFuncionarioForm
          nome={formState.nome}
          email={formState.email}
          cpf={formState.cpf}
          username={formState.username}
          password={formState.password}
          departamento={formState.departamento}
          error={apiState.error}
          success={apiState.success}
          isLoading={apiState.isLoading}
          onNomeChange={e => formActions.setNome(e.target.value)}
          onEmailChange={e => formActions.setEmail(e.target.value)}
          onCpfChange={formActions.setCpf}
          onUsernameChange={e => formActions.setUsername(e.target.value)}
          onPasswordChange={e => formActions.setPassword(e.target.value)}
          onDepartamentoChange={e => formActions.setDepartamento(e.target.value)}
          onSubmit={handleSubmit}
        />
        <div className={styles["sign-up-link"]}>
          <p>
            Já tem uma conta? <a href="/login">Entrar</a>
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CadastroFuncionario;