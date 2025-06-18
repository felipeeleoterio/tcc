"use client";

import Dashboard from "./Dashboard";
import Cadastro from "./Cadastro";
import Pedidos from "./Pedidos";
import BuscaPedido from "./BuscaPedido";
import Error from "./Error";
import EstoqueCadastrar from "./EstoqueCadastrar";
import styles from "../css/Main.module.css";

export default function Main({ currentComponent, isNavbarExpanded, onNavigate }) {
  const renderComponent = () => {
    switch (currentComponent) {
      case "Dashboard":
        return <Dashboard />;
      case "Cadastro":
        return <Cadastro onNavigate={onNavigate} />;
      case "Criar":
        return <Pedidos type={currentComponent} />;
      case "BuscaPedido":
        return <BuscaPedido onNavigate={onNavigate} />;
      case "Pedidos":
        return <Pedidos type={currentComponent} />;
      case "EstoqueCadastrar":
        return <EstoqueCadastrar />;
      // se usar Sobre, importe e coloque aqui, senão deixa default
      default:
        return <Error />;
    }
  };

  return (
    <main
      className={`${styles.main} ${
        isNavbarExpanded ? styles.expanded : styles.retracted
      }`}
    >
      <div className={styles.content}>{renderComponent()}</div>
    </main>
  );
}
