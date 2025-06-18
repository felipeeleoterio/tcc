"use client";

import { useState, useEffect } from "react";
import Cards from "./Cards";
import styles from "../css/Dashboard.module.css";

export default function Dashboard() {
  const [pedidos, setPedidos] = useState([]);

  useEffect(() => {
    // Puxa os pedidos do JSON Server
    fetch("http://localhost:3001/pedidos")
      .then((res) => res.json())
      .then((data) => setPedidos(data))
      .catch((err) => console.error("Erro ao buscar pedidos:", err));
  }, []);

  // Filtra os pedidos por status para exibir nas colunas
  const agendadosHoje = pedidos.filter(
    (pedido) => pedido.statusPedido === "Agendado para Hoje"
  );
  const aguardandoPagamento = pedidos.filter(
    (pedido) => pedido.statusPedido === "Aguardando Pagamento"
  );
  const emAndamento = pedidos.filter(
    (pedido) => pedido.statusPedido === "Em Andamento"
  );

  return (
    <div className={styles.dashboard}>
      <h1 className={styles.title}>Dashboard - Visão Geral dos Pedidos</h1>

      <div className={styles.container}>
        <div className={styles.column}>
          <h2 className={styles.columnTitle}>Agendado para Hoje</h2>
          <div className={styles.cardsContainer}>
            {agendadosHoje.length > 0 ? (
              agendadosHoje.map((pedido) => (
                <Cards key={pedido.id} pedido={pedido} status="agendado" />
              ))
            ) : (
              <p>Nenhum pedido agendado para hoje.</p>
            )}
          </div>
        </div>

        <div className={styles.column}>
          <h2 className={styles.columnTitle}>Aguardando Pagamento</h2>
          <div className={styles.cardsContainer}>
            {aguardandoPagamento.length > 0 ? (
              aguardandoPagamento.map((pedido) => (
                <Cards
                  key={pedido.id}
                  pedido={pedido}
                  status="aguardandoPagamento"
                />
              ))
            ) : (
              <p>Nenhum pedido aguardando pagamento.</p>
            )}
          </div>
        </div>

        <div className={styles.column}>
          <h2 className={styles.columnTitle}>Em Andamento</h2>
          <div className={styles.cardsContainer}>
            {emAndamento.length > 0 ? (
              emAndamento.map((pedido) => (
                <Cards key={pedido.id} pedido={pedido} status="andamento" />
              ))
            ) : (
              <p>Nenhum pedido em andamento.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
