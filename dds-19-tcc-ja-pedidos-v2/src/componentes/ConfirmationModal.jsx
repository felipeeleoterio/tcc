"use client";

import React from 'react';
import { XCircle } from 'lucide-react';
import styles from '../css/Pedidos.module.css'; // Usaremos este arquivo para os estilos do modal
import cardStyles from '../css/Cards.module.css'; // Para reutilizar alguns estilos do card, como detalhesGrid

export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  onCancel,
  pedido, // Passamos o objeto pedido completo
  confirmButtonText = 'Confirmar Pedido',
  cancelButtonText = 'Cancelar Pedido',
}) {
  if (!isOpen || !pedido) return null;

  // Funções para exibir dados do pedido, copiadas do seu Cards.js
  const getStatusText = (status) => {
    switch (status) {
      case "agendado":
        return "Agendado para Hoje";
      case "aguardandoPagamento":
        return "Aguardando Pagamento";
      case "andamento":
        return "Em Andamento";
      case "concluido":
        return "Concluído";
      case "cancelado":
        return "Cancelado";
      default:
        return "";
    }
  };

  const dataExibida = pedido.dataPedido || pedido.dataEntrega || "-";
  const observacoesExibidas = pedido.observacoes || "-";

  return (
    <div className={styles.popupOverlay}>
      <div className={styles.confirmationModalContent}>
        <button onClick={onClose} className={styles.popupCloseButton}>
          <XCircle size={24} />
        </button>

        <h2 className={styles.confirmationModalTitle}>Confirmar Pedido?</h2>

        <p className={styles.confirmationModalMessage}>
          Por favor, revise os detalhes do pedido abaixo antes de confirmar ou cancelar:
        </p>

        {/* Conteúdo detalhado do pedido, imitando o expandedContent do card */}
        <div className={styles.modalPedidoDetails}> {/* Novo wrapper para o conteúdo do pedido */}
          <div className={cardStyles.detailsGrid}> {/* Reutilizando o grid do seu card */}
            <div className={cardStyles.detail}>
              <strong>Cliente:</strong>
              <span>{pedido.cliente}</span>
            </div>
            <div className={cardStyles.detail}>
              <strong>Protocolo:</strong>
              <span>{pedido.protocolo}</span>
            </div>
            <div className={cardStyles.detail}>
              <strong>Valor Total:</strong>
              <span>{pedido.valor}</span>
            </div>
            <div className={cardStyles.detail}>
              <strong>Data do Pedido:</strong>
              <span>{dataExibida}</span>
            </div>
            <div className={cardStyles.detail}>
              <strong>Status Atual:</strong>
              <span>{getStatusText(pedido.status)}</span>
            </div>
            <div className={cardStyles.detail}>
              <strong>Observações:</strong>
              <span>{observacoesExibidas}</span>
            </div>
          </div>
        </div>

        <div className={styles.confirmationModalActions}>
          <button
            onClick={onConfirm}
            className={`${styles.confirmationButton} ${styles.confirm}`}
          >
            {confirmButtonText}
          </button>
          <button
            onClick={onCancel}
            className={`${styles.confirmationButton} ${styles.cancel}`}
          >
            {cancelButtonText}
          </button>
        </div>
      </div>
    </div>
  );
}