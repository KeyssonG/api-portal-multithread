import React, { useState } from "react";
import styles from "../styles/Login.module.css"; 
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";

const Login = () => {
  const [username, setUsername] = useState("");
  const [senha, setSenha] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const dadosLogin = {
      username,
      password: senha,
    };

    console.log("Dados de login:", dadosLogin);
    try {
      const response = await fetch("http://localhost:8089/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dadosLogin),
      });

      if (!response.ok) {
        throw new Error("Erro ao realizar o login");
      }

      const data = await response.json();
      console.log("Resposta da API: ", data);

      const token = data.token;

      if (token) {
        login(token, username);
        navigate("/dashboard");
      } else {
        alert("Token não encontrado na resposta da API.");
      }
    } catch (error) {
      console.error("Falha na autenticação:", error);
      alert("Não foi possível fazer o login. Verifique os seus dados.");
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.headerTitle}>Portal MultiThread</h1>
      </header>

      <div className={styles.loginBox}>
        <div className={styles.loginHeader}>
          <header>Login</header>
        </div>

        <form onSubmit={handleSubmit}>
          <div className={styles.inputBox}>
            <input
              className={styles.inputField}
              type="text"
              placeholder="Usuário"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className={styles.inputBox}>
            <input
              className={styles.inputField}
              type="password"
              placeholder="Senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
            />
          </div>

          <div className={styles.inputSubmit}>
            <button className={styles.submitBtn} type="submit">
              <label>Entrar</label>
            </button>
          </div>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
