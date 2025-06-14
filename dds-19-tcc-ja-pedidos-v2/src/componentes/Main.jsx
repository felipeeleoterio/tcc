"use client"

import Dashboard from "./Dashboard"
import Login from "./Login"
import Buscar from "./BuscaCliente"
import Cadastro from "./Cadastro"
import Pedidos from "./Pedidos"
import PedidosEmAndamento from "./PedidosEmAndamento"
import BuscaPedidos from "./BuscaPedidos"
import Sobre from "./Sobre"
import Config from "./Config"
import Error from "./Error"
import EstoqueCadastrar from "./EstoqueCadastrar"
import styles from "../css/Main.module.css"


export default function Main({ currentComponent, isNavbarExpanded, onNavigate }) {
  const renderComponent = () => {
    switch (currentComponent) {
      case "Dashboard":
        return <Dashboard />
      case "Login":
        return <Login onNavigate={onNavigate} />
      case "Cadastro":
        return <Cadastro onNavigate={onNavigate} />
        case "Buscar":
          return <Buscar onNavigate={onNavigate}/>
      case "Criar":
        return <Pedidos type={currentComponent} />
      case "PedidosAndamento":
        return <PedidosEmAndamento onNavigate={onNavigate} />
      case "BuscaPedidos":
        return <BuscaPedidos onNavigate={onNavigate} />
      case "Pedidos":
        return <Pedidos type={currentComponent} />
      case "EstoqueCadastrar":
        return <EstoqueCadastrar />
      case "Sobre":
        return <Sobre />
      case "Config1":
      case "Config2":
      case "Config3":
        return <Config type={currentComponent} />
      default:
        return <Error />
    }
  }

  return (
    <main className={`${styles.main} ${isNavbarExpanded ? styles.expanded : styles.retracted}`}>
      <div className={styles.content}>{renderComponent()}</div>
    </main>
  )
}
