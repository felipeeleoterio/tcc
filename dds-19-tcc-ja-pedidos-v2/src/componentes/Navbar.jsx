"use client"

import { useState } from "react"
import {
  LayoutDashboard,
  Users,
  UserCircle,
  ShoppingCart,
  Package,
  Building,
  Settings,
  Search,
  ChevronDown,
  ChevronRight,
} from "lucide-react"

import styles from "../css/Navbar.module.css"

export default function Navbar({ onNavigate, isExpanded, setIsExpanded }) {
  const [activeMenu, setActiveMenu] = useState("")
  const [searchTerm, setSearchTerm] = useState("")

const menuItems = [
  {
    id: "dashboard",
    title: "Dashboard",
    icon: LayoutDashboard,
    component: "Dashboard",
  },
  {
    id: "operadores",
    title: "Operadores",
    icon: Users,
    submenus: [
      { id: "login", title: "Login", component: "Login" },
      { id: "novo", title: "Novo", component: "Cadastro" },
      { id: "recuperar", title: "Recuperar acesso", component: "RecuperarAcesso" },
    ],
  },
  {
    id: "pedidos",
    title: "Pedidos",
    icon: ShoppingCart,
    submenus: [
      { id: "Buscar", title: "Buscar", component: "PedidosAndamento" },
      { id: "novo", title: "Novo", component: "Pedidos" },
    ],
  },
  {
    id: "cliente",
    title: "Cliente",
    icon: UserCircle,
    submenus: [
      { id: "buscarcliente", title: "Buscar Cliente", component: "Buscar" },
    ],
  },
  {
    id: "produto",
    title: "Produto",
    icon: Package,
    component: "EstoqueCadastrar",
  },

  {
    id: "configuracoes",
    title: "Configurações",
    icon: Settings,
    submenus: [
      { id: "config1", title: "Geral", component: "Config1" },
      { id: "config2", title: "Operador", component: "Config2" },
      { id: "config3", title: "Avançada", component: "Config3" },
    ],
  },
]


  const handleMenuClick = (menuId, component) => {
    if (component) {
      // Menu simples, sem submenu: navega direto e fecha submenu ativo
      setActiveMenu("")
      onNavigate(component)
    } else {
      // Menu com submenu: alterna abrir/fechar submenu
      setActiveMenu(activeMenu === menuId ? "" : menuId)
    }
  }

  const handleSubmenuClick = (component) => {
    onNavigate(component)
    setActiveMenu("")
  }

  const handleLogoClick = () => {
    setIsExpanded(!isExpanded)
  }

  const handleMouseEnter = () => {
    setIsExpanded(true)
  }

  const handleMouseLeave = () => {
    setIsExpanded(false)
    setActiveMenu("")
  }

  const handleSearch = () => {
    if (searchTerm.trim()) {
      onNavigate("SearchResults")
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  return (
    <nav
      className={`${styles.navbar} ${isExpanded ? styles.expanded : styles.retracted}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className={styles.logo} onClick={handleLogoClick}>
        <img src="/Logojapedidos.png" alt="Logo Já Pedidos" className={styles.logoIcon} />
        {isExpanded && <span className={styles.logoText}>JÁ Pedidos</span>}
      </div>

      {isExpanded && (
        <div className={styles.searchContainer}>
          <div className={styles.searchInputWrapper}>
            <input
              type="text"
              placeholder="Pesquisar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
              onKeyDown={handleKeyPress}
            />
            <button onClick={handleSearch} className={styles.searchButton}>
              <Search size={16} />
            </button>
          </div>
        </div>
      )}

      <ul className={styles.menuList}>
        {menuItems.map((item) => (
          <li key={item.id} className={styles.menuItem}>
            <div
              className={`${styles.menuButton} ${activeMenu === item.id ? styles.active : ""}`}
              onClick={() => handleMenuClick(item.id, item.component)}
            >
              <item.icon className={styles.menuIcon} />
              {isExpanded && (
                <>
                  <span className={styles.menuText}>{item.title}</span>
                  {item.submenus && (
                    <span className={styles.chevron}>
                      {activeMenu === item.id ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                    </span>
                  )}
                </>
              )}
            </div>

            {item.submenus && activeMenu === item.id && isExpanded && (
              <ul className={styles.submenuList}>
                {item.submenus.map((submenu) => (
                  <li key={submenu.id} className={styles.submenuItem}>
                    <button className={styles.submenuButton} onClick={() => handleSubmenuClick(submenu.component)}>
                      {submenu.title}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </nav>
  )
}
