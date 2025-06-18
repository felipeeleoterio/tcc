"use client";

import React, { useState, useMemo, useEffect } from "react";
import styles from "../css/BuscaPedido.module.css";
import { useSearchParams } from "next/navigation";

// Função para converter data string em objeto Date (formato esperado: "dd/mm/aaaa hh:mm")
function formatarDataParaComparacao(dataStr) {
  if (!dataStr) return null;
  const [data, hora] = dataStr.split(" ");
  if (!data) return null;
  const [dia, mes, ano] = data.split("/");
  if (!dia || !mes || !ano) return null;
  // Retorna objeto Date no formato ISO para comparação
  return new Date(`${ano}-${mes.padStart(2, "0")}-${dia.padStart(2, "0")}T${hora || "00:00"}`);
}

// Verifica se a data informada é o dia atual
function isHoje(dataStr) {
  const data = formatarDataParaComparacao(dataStr);
  if (!data) return false;
  const hoje = new Date();
  return (
    data.getDate() === hoje.getDate() &&
    data.getMonth() === hoje.getMonth() &&
    data.getFullYear() === hoje.getFullYear()
  );
}

// Adicione filtroInicial como prop
export default function PedidosEmAndamento() {
  const searchParams = useSearchParams();
  const filtroInicial = searchParams.get("filtro") || "TODOS";
  const [pagina, setPagina] = useState(1);
  const [busca, setBusca] = useState("");
  // Use filtroInicial como valor inicial do filtroStatus
  const [filtroStatus, setFiltroStatus] = useState(filtroInicial);
  const [dadosPedidos, setDadosPedidos] = useState([]);
  const itensPorPagina = 4;

  // Carrega pedidos do backend ao montar o componente
  useEffect(() => {
    fetch("http://localhost:3001/pedidos")
      .then((res) => res.json())
      .then((data) => setDadosPedidos(data))
      .catch((err) => console.error("Erro ao carregar pedidos:", err));
  }, []);

  // Filtra pedidos conforme busca e filtro de status
const pedidosFiltrados = useMemo(() => {
  return dadosPedidos.filter((pedido) => {
    const buscaLower = busca.toLowerCase();
    const combinaBusca =
      pedido.cliente.toLowerCase().includes(buscaLower) ||
      (pedido.telefone && pedido.telefone.includes(busca));

    let statusValido = false;
    const status = (pedido.statusPedido || "").toUpperCase();
    const filtro = (filtroStatus || "").toUpperCase();

    switch (filtro) {
      case "EM ANDAMENTO":
        statusValido = status === "PENDENTE" || status === "CONFIRMADO" || status === "EM ANDAMENTO";
        break;
      case "FINALIZADO":
        statusValido = status === "FINALIZADO" || status === "ENTREGUE";
        break;
      case "AGUARDANDO PAGAMENTO":
        statusValido = status === "AGUARDANDO PAGAMENTO";
        break;
      case "AGENDADO PARA HOJE":
        statusValido = status === "AGENDADO PARA HOJE";
        break;
      case "TODOS":
      default:
        statusValido = true;
    }

    return combinaBusca && statusValido;
  });
}, [busca, filtroStatus, dadosPedidos]);

  // Ajusta página atual se exceder o número total de páginas
  const totalPaginas = Math.max(Math.ceil(pedidosFiltrados.length / itensPorPagina), 1);
  useEffect(() => {
    if (pagina > totalPaginas) {
      setPagina(totalPaginas);
    }
  }, [pagina, totalPaginas]);

  // Pega os pedidos que serão exibidos na página atual
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
          <option value="TODOS">Todos</option>
          <option value="EM ANDAMENTO">Em Andamento</option>
          <option value="FINALIZADO">Finalizado</option>
          <option value="AGUARDANDO PAGAMENTO">Aguardando Pagamento</option>
          <option value="AGENDADO PARA HOJE">Agendado para Hoje</option>
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
                  <td>{pedido.telefone || "-"}</td>
                  <td>{pedido.dataEntrega || pedido.dataPedido || "-"}</td>
                  <td>{pedido.valor ? `R$ ${pedido.valor}` : "-"}</td>
                  <td>{pedido.statusPedido || "-"}</td>
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