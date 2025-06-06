"use client"

import React, { useState } from "react";
import styles from "../css/PedidosEmAndamento.module.css";

const dadosPedidos = [
  { id: 1, cliente: "FELIPE", telefone: "40028922", dataEntrega: "16/11/2024 14:00", valor: "R$ 1,00", status: "ABERTO" },
  { id: 2, cliente: "VANDERSON", telefone: "33365759", dataEntrega: "16/11/2024 14:00", valor: "R$ 1,00", status: "ABERTO" },
  { id: 3, cliente: "MARCIO", telefone: "33365758", dataEntrega: "16/11/2024 14:00", valor: "R$ 1,00", status: "ABERTO" },
  { id: 4, cliente: "PIETRA", telefone: "33875845", dataEntrega: "16/11/2024 14:00", valor: "R$ 1,00", status: "ABERTO" },
  { id: 5, cliente: "GREGORY", telefone: "33267687", dataEntrega: "16/11/2024 14:00", valor: "R$ 1,00", status: "ABERTO" },
  { id: 6, cliente: "RAMON", telefone: "32145678", dataEntrega: "16/11/2024 14:00", valor: "R$ 1,00", status: "ABERTO" },
  { id: 7, cliente: "LUCAS", telefone: "33479820", dataEntrega: "16/11/2024 14:00", valor: "R$ 1,00", status: "ABERTO" },
  { id: 8, cliente: "MYCAEL", telefone: "34875945", dataEntrega: "16/11/2024 14:00", valor: "R$ 1,00", status: "ABERTO" },
  { id: 9, cliente: "MARIA", telefone: "33378807", dataEntrega: "16/11/2024 14:00", valor: "R$ 1,00", status: "ABERTO" },
];

export default function PedidosEmAndamento() {
  const [pagina, setPagina] = useState(1);
  const itensPorPagina = 10;
  const totalPaginas = Math.ceil(dadosPedidos.length / itensPorPagina);

  const pedidosPaginados = dadosPedidos.slice(
    (pagina - 1) * itensPorPagina,
    pagina * itensPorPagina
  );

  const avancarPagina = () => {
    if (pagina < totalPaginas) setPagina(pagina + 1);
  };

  const voltarPagina = () => {
    if (pagina > 1) setPagina(pagina - 1);
  };

  return (
    <div className={styles.pedidosContainer}>
      <h2 className={styles.title}>Pedidos em Andamento</h2>

      <div className={styles.inputRow}>
        <select className={styles.select}>
          <option value="">FILTRO</option>
          <option value="andamento">Andamento</option>
          <option value="entregue">Entregues</option>
        </select>
        <input
          className={styles.input}
          type="text"
          placeholder="Digite Para Procurar"
        />
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr className={styles.tableHeadRow}>
              <th className={styles.tableHead}>ID</th>
              <th className={styles.tableHead}>NOME DO CLIENTE</th>
              <th className={styles.tableHead}>TELEFONE</th>
              <th className={styles.tableHead}>DATA/HORA ENTREGA</th>
              <th className={styles.tableHead}>VALOR</th>
              <th className={styles.tableHead}>STATUS PEDIDO</th>
            </tr>
          </thead>
          <tbody>
            {pedidosPaginados.map((pedido) => (
              <tr key={pedido.id} className={styles.tableRowHover}>
                <td className={styles.tableCellCenter}>{pedido.id}</td>
                <td className={styles.tableCell}>{pedido.cliente}</td>
                <td className={styles.tableCell}>{pedido.telefone}</td>
                <td className={styles.tableCell}>{pedido.dataEntrega}</td>
                <td className={styles.tableCellCenter}>{pedido.valor}</td>
                <td className={styles.tableCellCenter}>{pedido.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className={styles.buttonGroup}>
        <button
          onClick={voltarPagina}
          disabled={pagina === 1}
          className={`${styles.saveButton} ${pagina === 1 ? styles.disabledButton : ''}`}
        >
          ←
        </button>
        <span className={styles.statusText}>
          {pagina} de {totalPaginas}
        </span>
        <button
          onClick={avancarPagina}
          disabled={pagina === totalPaginas}
          className={`${styles.saveButton} ${pagina === totalPaginas ? styles.disabledButton : ''}`}
        >
          →
        </button>
      </div>
    </div>
  );
}

