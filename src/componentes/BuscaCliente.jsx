"use client";

import React, { useState } from "react";
import styles from "../css/BuscaCliente.module.css";

const clientes = [
  { id: 1, name: "FELIPE", phone: "40028922" },
  { id: 2, name: "VANDERSON", phone: "33365759" },
  { id: 3, name: "MARCIO", phone: "33365758" },
  { id: 4, name: "PIETRA", phone: "33875845" },
  { id: 5, name: "GREGORY", phone: "33267687" },
  { id: 6, name: "RAMON", phone: "32145678" },
  { id: 7, name: "LUCAS", phone: "33479820" },
  { id: 8, name: "MYCAEL", phone: "34875945" },
  { id: 9, name: "MARIA", phone: "33378807" },
  { id: 10, name: "ANA", phone: "33445566" },
  { id: 11, name: "JOAO", phone: "33998877" },
  { id: 12, name: "MARCELO", phone: "33112233" },
];

export default function ClientSearch() {
  const [pagina, setPagina] = useState(1);
  const [filtro, setFiltro] = useState("");
  const itensPorPagina = 5;

  // Filtra clientes pelo nome conforme o filtro
  const clientesFiltrados = clientes.filter((c) =>
    c.name.toLowerCase().includes(filtro.toLowerCase())
  );

  const totalPaginas = Math.ceil(clientesFiltrados.length / itensPorPagina);

  // Pagina os clientes filtrados
  const clientesPaginados = clientesFiltrados.slice(
    (pagina - 1) * itensPorPagina,
    pagina * itensPorPagina
  );

  const avancarPagina = () => {
    if (pagina < totalPaginas) setPagina(pagina + 1);
  };

  const voltarPagina = () => {
    if (pagina > 1) setPagina(pagina - 1);
  };

  // Reseta pagina ao mudar o filtro
  const handleFiltroChange = (e) => {
    setFiltro(e.target.value);
    setPagina(1);
  };

  return (
    <div className={styles.pedidosContainer}>
      <h2 className={styles.title}>Buscar Clientes</h2>

      <div className={styles.inputRow}>
        <input
          type="text"
          placeholder="Digite para procurar"
          className={styles.input}
          value={filtro}
          onChange={handleFiltroChange}
        />
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr className={styles.tableHeadRow}>
              <th className={styles.tableHead}>ID</th>
              <th className={styles.tableHead}>NOME DO CLIENTE</th>
              <th className={styles.tableHead}>TELEFONE</th>
            </tr>
          </thead>
          <tbody>
            {clientesPaginados.length > 0 ? (
              clientesPaginados.map((cliente) => (
                <tr key={cliente.id} className={styles.tableRowHover}>
                  <td className={styles.tableCellCenter}>{cliente.id}</td>
                  <td className={styles.tableCell}>{cliente.name}</td>
                  <td className={styles.tableCell}>{cliente.phone}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="text-center p-4 text-gray-500">
                  Nenhum cliente encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className={styles.buttonGroup}>
        <button
          onClick={voltarPagina}
          disabled={pagina === 1}
          className={`${styles.saveButton} ${pagina === 1 ? styles.disabledButton : ""}`}
        >
          ←
        </button>
        <span className={styles.statusText}>
          {pagina} de {totalPaginas || 1}
        </span>
        <button
          onClick={avancarPagina}
          disabled={pagina === totalPaginas || totalPaginas === 0}
          className={`${styles.saveButton} ${
            pagina === totalPaginas || totalPaginas === 0 ? styles.disabledButton : ""
          }`}
        >
          →
        </button>
      </div>
    </div>
  );
}
