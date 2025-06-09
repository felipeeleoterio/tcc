"use client";

import React, { useState, useMemo } from "react";
import styles from "../css/PedidosEmAndamento.module.css";

const dadosPedidos = [
  { id: 1, cliente: "FELIPE", telefone: "40028922", dataEntrega: "16/11/2024 14:00", valor: "R$ 1,00", status: "ABERTO" },
  { id: 2, cliente: "VANDERSON", telefone: "33365759", dataEntrega: "16/11/2024 14:00", valor: "R$ 1,00", status: "ENTREGUE" },
  { id: 3, cliente: "MARCIO", telefone: "33365758", dataEntrega: "16/11/2024 14:00", valor: "R$ 1,00", status: "ABERTO" },
  { id: 4, cliente: "PIETRA", telefone: "33875845", dataEntrega: "16/11/2024 14:00", valor: "R$ 1,00", status: "ENTREGUE" },
  { id: 5, cliente: "GREGORY", telefone: "33267687", dataEntrega: "16/11/2024 14:00", valor: "R$ 1,00", status: "ABERTO" },
  { id: 6, cliente: "RAMON", telefone: "32145678", dataEntrega: "16/11/2024 14:00", valor: "R$ 1,00", status: "ABERTO" },
  { id: 7, cliente: "LUCAS", telefone: "33479820", dataEntrega: "16/11/2024 14:00", valor: "R$ 1,00", status: "ENTREGUE" },
  { id: 8, cliente: "MYCAEL", telefone: "34875945", dataEntrega: "16/11/2024 14:00", valor: "R$ 1,00", status: "ABERTO" },
  { id: 9, cliente: "MARIA", telefone: "33378807", dataEntrega: "16/11/2024 14:00", valor: "R$ 1,00", status: "ENTREGUE" },
];

export default function PedidosEmAndamento() {
  const [pagina, setPagina] = useState(1);
  const [busca, setBusca] = useState("");
  const itensPorPagina = 4;

  // Filtra apenas os pedidos com status "ABERTO" e que combinam com a busca (nome ou telefone)
  const pedidosFiltrados = useMemo(() => {
    return dadosPedidos.filter((pedido) => {
      const combinaBusca =
        pedido.cliente.toLowerCase().includes(busca.toLowerCase()) ||
        pedido.telefone.includes(busca);
      const statusAberto = pedido.status === "ABERTO";
      return statusAberto && combinaBusca;
    });
  }, [busca]);

  const totalPaginas = Math.max(Math.ceil(pedidosFiltrados.length / itensPorPagina), 1);

  if (pagina > totalPaginas) {
    setPagina(totalPaginas);
  }

  const pedidosPaginados = pedidosFiltrados.slice(
    (pagina - 1) * itensPorPagina,
    pagina * itensPorPagina
  );

  return (
    <div className={styles.pedidosContainer}>
      <h2 className={styles.title}>Pedidos em Andamento</h2>

     <div className={styles.inputRow}>
  <input
    className={styles.input}
    type="text"
    placeholder="Buscar por nome ou telefone"
    value={busca}
    onChange={(e) => {
      setBusca(e.target.value);
      setPagina(1);
    }}
  />
</div>


      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>NOME DO CLIENTE</th>
              <th>TELEFONE</th>
              <th>DATA/HORA ENTREGA</th>
              <th>VALOR</th>
              <th>STATUS PEDIDO</th>
            </tr>
          </thead>
          <tbody>
            {pedidosPaginados.length > 0 ? (
              pedidosPaginados.map((pedido) => (
                <tr key={pedido.id}>
                  <td>{pedido.id}</td>
                  <td>{pedido.cliente}</td>
                  <td>{pedido.telefone}</td>
                  <td>{pedido.dataEntrega}</td>
                  <td>{pedido.valor}</td>
                  <td>{pedido.status}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" style={{ textAlign: "center", padding: "10px" }}>
                  Nenhum pedido aberto encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className={styles.paginationGroup}>
        <button
          onClick={() => setPagina(p => Math.max(p - 1, 1))}
          disabled={pagina === 1}
          className={styles.paginationButton}
        >
          ←
        </button>
        <span className={styles.paginationText}>
          {pagina} de {totalPaginas}
        </span>
        <button
          onClick={() => setPagina(p => Math.min(p + 1, totalPaginas))}
          disabled={pagina === totalPaginas}
          className={styles.paginationButton}
        >
          →
        </button>
      </div>
    </div>
  );
}
