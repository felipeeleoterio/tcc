// src/components/RecuperarSenha.js
"use client";

import React, { useState } from 'react';
import styles from '../css/RecuperarSenha.module.css'; // Estilos específicos
import commonStyles from '../css/Pedidos.module.css'; // Reutiliza alguns estilos globais de inputs/botões
import { Mail, User } from 'lucide-react'; // Ícones para e-mail e usuário/documento

export default function RecuperarSenha() {
  const [identificador, setIdentificador] = useState(''); // Pode ser e-mail ou CPF/CNPJ
  const [tipoIdentificador, setTipoIdentificador] = useState('email'); // 'email' ou 'documento'
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Adaptação das funções de formatação do Pedidos.js
  const formatDocument = (value, type) => {
    const numbers = value.replace(/\D/g, "");
    if (type === "cpf") {
      if (numbers.length > 11) return numbers.slice(0, 11).replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
      return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
    } else if (type === "cnpj") {
      if (numbers.length > 14) return numbers.slice(0, 14).replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
      return numbers.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
    }
    return numbers;
  };

  const handleChange = (e) => {
    const { value, name } = e.target;
    if (name === "identificador") {
      if (tipoIdentificador === 'email') {
        setIdentificador(value);
      } else {
        setIdentificador(formatDocument(value, tipoIdentificador));
      }
    } else if (name === 'tipoIdentificador') {
      setTipoIdentificador(value);
      setIdentificador(''); // Limpa o campo ao mudar o tipo
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setIsError(false);
    setIsLoading(true);

    // Validação básica
    if (!identificador) {
      setMessage('Por favor, preencha o campo de identificação.');
      setIsError(true);
      setIsLoading(false);
      return;
    }

    if (tipoIdentificador === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identificador)) {
      setMessage('Por favor, insira um e-mail válido.');
      setIsError(true);
      setIsLoading(false);
      return;
    }

    // Simulação de chamada de API
    try {
      // --- Substitua esta parte pela sua lógica real de chamada de API ---
      console.log(`Tentando recuperar senha para ${tipoIdentificador}: ${identificador}`);

      // Exemplo de fetch (ajuste a URL e o corpo conforme sua API)
      const response = await fetch('/api/recuperar-senha', { // Exemplo de rota de API no Next.js
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tipo: tipoIdentificador,
          valor: identificador,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message || 'Instruções para recuperação de senha foram enviadas para o seu e-mail/contato cadastrado.');
        setIsError(false);
        setIdentificador(''); // Limpa o campo após o sucesso
        setTipoIdentificador('email'); // Reseta o tipo
      } else {
        setMessage(data.message || 'Erro ao processar sua solicitação. Por favor, tente novamente.');
        setIsError(true);
      }
    } catch (error) {
      console.error('Erro na recuperação de senha:', error);
      setMessage('Ocorreu um erro inesperado. Por favor, tente novamente mais tarde.');
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.recuperarSenhaContainer}>
      <div className={styles.formCard}>
        <h1 className={styles.title}>Recuperar Senha</h1>
        <p className={styles.description}>
          Informe seu e-mail ou CPF/CNPJ cadastrado para receber instruções de recuperação de senha.
        </p>

        <form onSubmit={handleSubmit} className={commonStyles.form}> {/* Reutiliza alguns estilos de form */}

          <div className={commonStyles.radioGroup} style={{marginBottom: '15px'}}>
            <label>
              <input
                type="radio"
                name="tipoIdentificador"
                value="email"
                checked={tipoIdentificador === "email"}
                onChange={handleChange}
              />
              E-mail
            </label>
            <label>
              <input
                type="radio"
                name="tipoIdentificador"
                value="cpf"
                checked={tipoIdentificador === "cpf"}
                onChange={handleChange}
              />
              CPF
            </label>
            <label>
              <input
                type="radio"
                name="tipoIdentificador"
                value="cnpj"
                checked={tipoIdentificador === "cnpj"}
                onChange={handleChange}
              />
              CNPJ
            </label>
          </div>

          <div className={commonStyles.inputGroup}>
            <label htmlFor="identificador" className={commonStyles.label}>
              {tipoIdentificador === 'email' ? (
                <> <Mail size={14} /> E-mail</>
              ) : (
                <> <User size={14} /> {tipoIdentificador.toUpperCase()}</>
              )}
            </label>
            <input
              type={tipoIdentificador === 'email' ? 'email' : 'text'}
              id="identificador"
              name="identificador"
              value={identificador}
              onChange={handleChange}
              className={commonStyles.input}
              placeholder={
                tipoIdentificador === 'email' ? 'seu.email@example.com' :
                tipoIdentificador === 'cpf' ? '000.000.000-00' :
                '00.000.000/0000-00'
              }
              required
              disabled={isLoading}
            />
          </div>

          {message && (
            <p className={`${styles.message} ${isError ? styles.errorMessage : styles.successMessage}`}>
              {message}
            </p>
          )}

          <div className={styles.buttonGroup}>
            <button
              type="submit"
              className={commonStyles.saveButton} // Reutiliza estilo de botão
              disabled={isLoading}
            >
              {isLoading ? 'Enviando...' : 'Recuperar Senha'}
            </button>
          </div>

          {/* Opcional: Link para voltar à tela de login */}
          <p className={styles.backToLogin}>
            Lembrou da senha? <a href="/login">Faça login</a>
          </p>

        </form>
      </div>
    </div>
  );
}