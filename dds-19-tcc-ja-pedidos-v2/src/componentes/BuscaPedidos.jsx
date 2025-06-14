import React, { useState } from 'react';
import styles from "../css/BuscaCliente.module.css";

const pedidosMock = [
  { id: 1, nome: 'FELIPE', telefone: '40028922', dataEntrega: '16/11/2024 14:00', valor: 'R$ 350,00' },
  { id: 2, nome: 'VANDERSON', telefone: '313655759', dataEntrega: '16/11/2024 14:00', valor: 'R$ 570,00' },
  { id: 3, nome: 'MARCIO', telefone: '33567558', dataEntrega: '16/11/2024 14:00', valor: 'R$ 150,00' },
  { id: 4, nome: 'PIETRA', telefone: '33857845', dataEntrega: '16/11/2024 14:00', valor: 'R$ 290,00' },
  { id: 5, nome: 'GREGORY', telefone: '33426787', dataEntrega: '16/11/2024 14:00', valor: 'R$ 400,00' },
  { id: 6, nome: 'RAMON', telefone: '32146578', dataEntrega: '16/11/2024 14:00', valor: 'R$ 680,00' },
  { id: 7, nome: 'LUCAS', telefone: '32154890', dataEntrega: '16/11/2024 14:00', valor: 'R$ 220,00' },
  { id: 8, nome: 'MYCAEL', telefone: '33479545', dataEntrega: '16/11/2024 14:00', valor: 'R$ 300,00' },
  { id: 9, nome: 'MARIA', telefone: '33387807', dataEntrega: '16/11/2024 14:00', valor: 'R$ 320,00' }
];

const ITEMS_PER_PAGE = 4;

const BuscaPedidos = () => {
  const [busca, setBusca] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Filtra pedidos pelo nome
  const pedidosFiltrados = pedidosMock.filter(pedido =>
    pedido.nome.toLowerCase().includes(busca.toLowerCase())
  );

  // Calcula total de páginas
  const totalPages = Math.ceil(pedidosFiltrados.length / ITEMS_PER_PAGE);

  // Define os pedidos a exibir na página atual
  const pedidosPaginaAtual = pedidosFiltrados.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Quando busca mudar, resetar para página 1
  const handleBuscaChange = (e) => {
    setBusca(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div className={styles.pedidosContainer}>
      <h2 className={styles.title}>Buscar Pedidos</h2>

      <div className={styles.inputRow}>
        <input
          type="text"
          className={styles.input}
          placeholder="Digite para procurar"
          value={busca}
          onChange={handleBuscaChange}
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
              <th className={`${styles.tableHead} ${styles.tableCellCenter}`}>VALOR</th>
            </tr>
          </thead>
          <tbody>
            {pedidosPaginaAtual.length > 0 ? (
              pedidosPaginaAtual.map(pedido => (
                <tr key={pedido.id} className={styles.tableRowHover}>
                  <td className={styles.tableCell}>{pedido.id}</td>
                  <td className={styles.tableCell}>{pedido.nome}</td>
                  <td className={styles.tableCell}>{pedido.telefone}</td>
                  <td className={styles.tableCell}>{pedido.dataEntrega}</td>
                  <td className={styles.tableCellCenter}>{pedido.valor}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className={styles.tableCellCenter}>Nenhum pedido encontrado.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Paginação */}
      <div className={styles.buttonGroup}>
        <button
          className={`${styles.saveButton} ${currentPage === 1 ? styles.disabledButton : ''}`}
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          ←
        </button>

        <span className={styles.statusText}>
           {currentPage} de {totalPages}
        </span>

        <button
          className={`${styles.saveButton} ${currentPage === totalPages ? styles.disabledButton : ''}`}
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          →
        </button>
      </div>
    </div>
  );
};

export default BuscaPedidos;
