import React, { useState } from "react";
import styles from "../styles/CadastroFuncionario.module.css";
import Footer from "../components/Footer";
import { IMaskInput } from "react-imask";
interface FormData {
  nome: string;
  email: string;
  cpf: string;
  username: string;
  password: string;
  departamento: string;
}

const CadastroFuncionario: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    nome: "",
    email: "",
    cpf: "",
    username: "",
    password: "",
    departamento: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const formattedValue = name === "cpf" ? value.replace(/[^\d]/g, "") : value;
    setFormData((prev) => ({
      ...prev,
      [name]: formattedValue,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8089/cadastrar/funcionario", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Erro ao cadastrar Funcionário.");
      }

      alert("Funcionário cadastrado com sucesso!");
    } catch (error) {
      console.error("Falha no cadastro:", error);
      alert(error instanceof Error ? error.message : "Não foi possível realizar o cadastro.");
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Portal MultiThread</h1>
      </header>

      <div className={styles["register-box"]}>
        <div className={styles["login-header"]}>
          <header>Cadastrar funcionário</header>
        </div>

        <form onSubmit={handleSubmit}>
          <div className={styles["input-box"]}>
            <input
              className={styles["input-field"]}
              type="text"
              placeholder="Seu nome"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles["input-box"]}>
            <input
              className={styles["input-field"]}
              type="email"
              placeholder="E-mail Corporativo"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles["input-box"]}>
            <IMaskInput
              mask="000.000.000-00"
              name="cpf"
              value={formData.cpf}
              onAccept={(value: string) =>
                setFormData((prev) => ({ ...prev, cpf: value }))
              }
              className={styles["input-field"]}
              placeholder="Seu CPF"
              required
            />
          </div>

          <div className={styles["input-box"]}>
            <input
              className={styles["input-field"]}
              type="text"
              placeholder="Usuário"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles["input-box"]}>
            <input
              className={styles["input-field"]}
              type="password"
              placeholder="Senha"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles["input-box"]}>
            <input
              className={styles["input-field"]}
              type="text"
              placeholder="Seu departamento"
              name="departamento"
              value={formData.departamento}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles["input-submit"]}>
            <button className={styles["submit-btn"]} type="submit">
              <label className={styles["submit-label"]}>Cadastrar</label>
            </button>
          </div>

          <div className={styles["sign-up-link"]}>
            <p>
              Já tem uma conta? <a href="/login">Entrar</a>
            </p>
          </div>
        </form>
      </div>

      <Footer />
    </div>
  );
};

export default CadastroFuncionario;