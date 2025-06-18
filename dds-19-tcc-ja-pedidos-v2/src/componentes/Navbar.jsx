"use client";

import { useState, useRef } from "react";
import {
  LayoutDashboard,
  Users,
  ShoppingCart,
  Package,
  Search,
  ChevronDown,
  ChevronRight,
} from "lucide-react";

import styles from "../css/Navbar.module.css";

export default function Navbar({ onNavigate, isExpanded, setIsExpanded }) {
  const [activeMenu, setActiveMenu] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const leaveTimeoutRef = useRef(null);

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
        { id: "novo", title: "Novo", component: "Cadastro" },
        { id: "recuperar", title: "Recuperar Senha", component: "RecuperarSenha" },
      ],
    },
    {
      id: "pedidos",
      title: "Pedidos",
      icon: ShoppingCart,
      submenus: [
        { id: "buscar", title: "Buscar", component: "BuscaPedido" },
        { id: "novo", title: "Novo", component: "Pedidos" },
      ],
    },
    {
      id: "produto",
      title: "Produto",
      icon: Package,
      component: "EstoqueCadastrar",
    },
  ];

  const handleMenuClick = (item) => {
    if (item.submenus) {
      setActiveMenu((prev) => (prev === item.id ? "" : item.id));
      if (searchTerm && activeMenu !== item.id) {
        setSearchTerm("");
      }
    } else {
      setActiveMenu("");
      setSearchTerm("");
      onNavigate(item.component);
    }
  };

  const handleSubmenuClick = (component) => {
    setSearchTerm("");
    setActiveMenu("");
    onNavigate(component);
  };

  const handleLogoClick = () => setIsExpanded(!isExpanded);

  const handleMouseEnter = () => {
    if (leaveTimeoutRef.current) {
      clearTimeout(leaveTimeoutRef.current);
      leaveTimeoutRef.current = null;
    }
    setIsExpanded(true);
  };

  const handleMouseLeave = () => {
    leaveTimeoutRef.current = setTimeout(() => {
      setIsExpanded(false);
      // Opcional: Limpar o menu ativo e termo de busca ao retrair
      // Isso garante que, ao expandir novamente, não haja um submenu aberto automaticamente.
      // setActiveMenu("");
      // setSearchTerm("");
    }, 200);
  };

  const displayedMenuItems = searchTerm
    ? menuItems.filter((item) => {
        const titleMatch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
        const submenuMatch = item.submenus?.some((submenu) =>
          submenu.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
        return titleMatch || submenuMatch;
      })
    : menuItems;

  return (
    <nav
      className={`${styles.navbar} ${isExpanded ? styles.expanded : styles.retracted}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className={styles.logo} onClick={handleLogoClick}>
        <img src="/Logojapedidos.png" alt="Logo Já Pedidos" className={styles.logoIcon} />
        {/* Renderize o texto do logo SOMENTE se o menu estiver expandido */}
        {isExpanded && <span className={styles.logoText}>JÁ Pedidos</span>}
      </div>

      {/* Renderize a barra de pesquisa SOMENTE se o menu estiver expandido */}
      {isExpanded && (
        <div className={styles.searchContainer}>
          <div className={styles.searchInputWrapper}>
            <input
              type="text"
              placeholder="Pesquisar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
            <button className={styles.searchButton}>
              <Search size={16} />
            </button>
          </div>
        </div>
      )}

      <ul className={styles.menuList}>
        {displayedMenuItems.map((item) => (
          <li key={item.id} className={styles.menuItem}>
            <button
              className={`${styles.menuButton} ${activeMenu === item.id ? styles.active : ""}`}
              onClick={() => handleMenuClick(item)}
            >
              <item.icon className={styles.menuIcon} />
              {/* Renderize o texto do menu principal SOMENTE se o menu estiver expandido */}
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
            </button>
            {/* Renderize o submenu SOMENTE se o menu estiver expandido E o item estiver ativo */}
            {item.submenus && activeMenu === item.id && isExpanded && (
              <ul className={styles.submenuList}>
                {item.submenus
                  .filter((submenu) =>
                    submenu.title.toLowerCase().includes(searchTerm.toLowerCase()) || searchTerm === ""
                  )
                  .map((submenu) => (
                    <li key={submenu.id} className={styles.submenuItem}>
                      <button
                        className={styles.submenuButton}
                        onClick={() => handleSubmenuClick(submenu.component)}
                      >
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
  );
}