"use client";

import { useState } from "react";
import { ShoppingCart } from "lucide-react";
import styles from "../css/Login.module.css";

export default function Login({ onNavigate, onLoginSuccess }) {
  const [formData, setFormData] = useState({
    email: "",
    senha: "",
  });

  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    try {
      const res = await fetch(
        `http://localhost:3001/usuarios?email=${encodeURIComponent(
          formData.email
        )}&senha=${encodeURIComponent(formData.senha)}`
      );

      if (!res.ok) {
        setErrorMessage("Erro ao conectar com o servidor.");
        return;
      }

      const users = await res.json();

      if (users.length > 0) {
        if (onLoginSuccess) onLoginSuccess();
        if (onNavigate) onNavigate("Dashboard");
      } else {
        setErrorMessage("E-mail ou senha incorretos.");
      }
    } catch (error) {
      console.error("Erro no login:", error);
      setErrorMessage("Erro ao conectar com o servidor.");
    }
  };

  const handleCadastroClick = (e) => {
    e.preventDefault();
    if (onNavigate) {
      onNavigate("Cadastro");
    }
  };

  const handleEsqueceuSenhaClick = (e) => {
    e.preventDefault();
    if (onNavigate) {
      onNavigate("Error");
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginBox}>
        <div className={styles.logo}>
          <ShoppingCart className={styles.logoIcon} />
          <h1 className={styles.logoText}>JÁ Pedidos</h1>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="email" className={styles.label}>
              E-mail
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={styles.input}
              required
              autoComplete="username"
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="senha" className={styles.label}>
              Senha
            </label>
            <input
              type="password"
              id="senha"
              name="senha"
              value={formData.senha}
              onChange={handleChange}
              className={styles.input}
              required
              autoComplete="current-password"
            />
          </div>

          {errorMessage && (
            <p style={{ color: "red", marginBottom: "10px" }}>{errorMessage}</p>
          )}

          <button type="submit" className={styles.submitButton}>
            Entrar
          </button>

          <div className={styles.links}>
            <a href="#" className={styles.link} onClick={handleEsqueceuSenhaClick}>
              Esqueceu a senha?
            </a>
            <a href="#" className={styles.link} onClick={handleCadastroClick}>
              Cadastre-se
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
