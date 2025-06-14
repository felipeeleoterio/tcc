"use client";

import React, { useState, useMemo } from "react";
import styles from "../css/PedidosEmAndamento.module.css";

// Lista de pedidos
const dadosPedidos = [
  { id: 1, cliente: "FELIPE", telefone: "40028922", dataEntrega: "13/06/2025 14:00", valor: "R$ 1,00", status: "ABERTO" },
  { id: 2, cliente: "VANDERSON", telefone: "33365759", dataEntrega: "14/06/2025 10:00", valor: "R$ 1,00", status: "ENTREGUE" },
  { id: 3, cliente: "MARCIO", telefone: "33365758", dataEntrega: "13/06/2025 08:30", valor: "R$ 1,00", status: "ABERTO" },
  { id: 4, cliente: "PIETRA", telefone: "33875845", dataEntrega: "13/06/2025 11:00", valor: "R$ 1,00", status: "ENTREGUE" },
  { id: 5, cliente: "GREGORY", telefone: "33267687", dataEntrega: "13/06/2025 15:00", valor: "R$ 1,00", status: "AGUARDANDO PAGAMENTO" },
];

// Função para converter data string em objeto Date
function formatarDataParaComparacao(dataStr) {
  const [data, hora] = dataStr.split(" ");
  const [dia, mes, ano] = data.split("/");
  return new Date(`${ano}-${mes}-${dia}T${hora || "00:00"}`);
}

// Verifica se a data é hoje
function isHoje(dataStr) {
  const data = formatarDataParaComparacao(dataStr);
  const hoje = new Date();
  return (
    data.getDate() === hoje.getDate() &&
    data.getMonth() === hoje.getMonth() &&
    data.getFullYear() === hoje.getFullYear()
  );
}

export default function PedidosEmAndamento() {
  const [pagina, setPagina] = useState(1);
  const [busca, setBusca] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("EM_ANDAMENTO");
  const itensPorPagina = 4;

  const pedidosFiltrados = useMemo(() => {
    return dadosPedidos.filter((pedido) => {
      const combinaBusca =
        pedido.cliente.toLowerCase().includes(busca.toLowerCase()) ||
        pedido.telefone.includes(busca);

      let statusValido = false;

      switch (filtroStatus) {
        case "EM_ANDAMENTO":
          statusValido = pedido.status === "ABERTO";
          break;
        case "FINALIZADOS":
          statusValido = pedido.status === "ENTREGUE";
          break;
        case "AGUARDANDO_PAGAMENTO":
          statusValido = pedido.status === "AGUARDANDO PAGAMENTO";
          break;
        case "HOJE":
          statusValido = isHoje(pedido.dataEntrega);
          break;
        default:
          statusValido = true;
      }

      return combinaBusca && statusValido;
    });
  }, [busca, filtroStatus]);

  const totalPaginas = Math.max(Math.ceil(pedidosFiltrados.length / itensPorPagina), 1);
  if (pagina > totalPaginas) setPagina(totalPaginas);

  const pedidosPaginados = pedidosFiltrados.slice(
    (pagina - 1) * itensPorPagina,
    pagina * itensPorPagina
  );

  return (
    <div className={styles.pedidosContainer}>
      <h2 className={styles.title}>Buscar Pedido</h2>

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

        <select
          className={styles.input}
          value={filtroStatus}
          onChange={(e) => {
            setFiltroStatus(e.target.value);
            setPagina(1);
          }}
        >
          <option value="EM_ANDAMENTO">Em Andamento</option>
          <option value="FINALIZADOS">Finalizados</option>
          <option value="AGUARDANDO_PAGAMENTO">Aguardando Pagamento</option>
          <option value="HOJE">Agendados para Hoje</option>
        </select>
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
                  Nenhum pedido encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className={styles.paginationGroup}>
        <button
          onClick={() => setPagina((p) => Math.max(p - 1, 1))}
          disabled={pagina === 1}
          className={styles.paginationButton}
        >
          ←
        </button>
        <span className={styles.paginationText}>
          {pagina} de {totalPaginas}
        </span>
        <button
          onClick={() => setPagina((p) => Math.min(p + 1, totalPaginas))}
          disabled={pagina === totalPaginas}
          className={styles.paginationButton}
        >
          →
        </button>
      </div>
    </div>
  );
}
