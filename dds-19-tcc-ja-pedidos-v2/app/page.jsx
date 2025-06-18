"use client";

import { useState } from "react";
import Login from "../src/componentes/Login";
import Navbar from "../src/componentes/Navbar";
import Main from "../src/componentes/Main";
import Rodape from "../src/componentes/Rodape";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentComponent, setCurrentComponent] = useState("Dashboard");
  const [isNavbarExpanded, setIsNavbarExpanded] = useState(false);

  const handleNavigation = (component) => {
    console.log("Navegando para:", component); // DEBUG
    setCurrentComponent(component);
  };

  // Passa o setIsLoggedIn para o Login para controlar login
  if (!isLoggedIn) {
    return (
      <Login
        onLoginSuccess={() => setIsLoggedIn(true)}
        onNavigate={handleNavigation}
      />
    );
  }

  return (
    <div className="app-container">
      <Navbar
        onNavigate={handleNavigation}
        isExpanded={isNavbarExpanded}
        setIsExpanded={setIsNavbarExpanded}
      />
      <Main
        currentComponent={currentComponent}
        isNavbarExpanded={isNavbarExpanded}
        onNavigate={handleNavigation}
      />
      <Rodape isNavbarExpanded={isNavbarExpanded} />
    </div>
  );
}
