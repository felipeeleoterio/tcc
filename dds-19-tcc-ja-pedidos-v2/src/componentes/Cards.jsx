"use client"

import { useState } from "react"
import {
  Eye,
  Clock,
  CheckCircle,
  XCircle,
  CalendarCheck,
  DollarSign,
} from "lucide-react"
import styles from "../css/Cards.module.css"

export default function Cards({ pedido, status }) {
  const [isExpanded, setIsExpanded] = useState(false)

  const getStatusIcon = () => {
    switch (status) {
      case "agendado":
        return <CalendarCheck className={styles.statusIcon} />
      case "aguardandoPagamento":
        return <DollarSign className={styles.statusIcon} />
      case "andamento":
        return <Clock className={styles.statusIcon} />
      case "concluido":
        return <CheckCircle className={styles.statusIcon} />
      case "cancelado":
        return <XCircle className={styles.statusIcon} />
      default:
        return null
    }
  }

  const getStatusText = () => {
    switch (status) {
      case "agendado":
        return "Agendado para Hoje"
      case "aguardandoPagamento":
        return "Aguardando Pagamento"
      case "andamento":
        return "Em Andamento"
      case "concluido":
        return "Concluído"
      case "cancelado":
        return "Cancelado"
      default:
        return ""
    }
  }

  const handleViewPedido = (e) => {
    e.stopPropagation()
    setIsExpanded(!isExpanded)
  }

  const handleMouseLeave = () => {
    setIsExpanded(false)
  }

  const handleCardClick = (e) => {
    e.stopPropagation()
  }

  // Use dataPedido ou dataEntrega, se existir
  const dataExibida = pedido.dataPedido || pedido.dataEntrega || "-";
  const observacoesExibidas = pedido.observacoes || "-";

  return (
    <div
      className={`${styles.card} ${styles[status]} ${isExpanded ? styles.expanded : ""}`}
      onMouseLeave={handleMouseLeave}
      onClick={handleCardClick}
    >
      <div className={styles.cardHeader}>
        <div className={styles.statusBadge}>
          {getStatusIcon()}
          <span>{getStatusText()}</span>
        </div>
        <button onClick={handleViewPedido} className={styles.viewButton}>
          <Eye size={16} />
        </button>
      </div>

      <div className={styles.cardContent}>
        <h3 className={styles.clienteName}>{pedido.cliente}</h3>
        <p className={styles.protocolo}>Protocolo: {pedido.protocolo}</p>
        <p className={styles.valor}>{pedido.valor}</p>
        <p className={styles.data}>Data: {dataExibida}</p>
      </div>

      {isExpanded && (
        <div className={styles.expandedContent}>
          <div className={styles.detailsGrid}>
            <div className={styles.detail}>
              <strong>Cliente:</strong>
              <span>{pedido.cliente}</span>
            </div>
            <div className={styles.detail}>
              <strong>Protocolo:</strong>
              <span>{pedido.protocolo}</span>
            </div>
            <div className={styles.detail}>
              <strong>Valor Total:</strong>
              <span>{pedido.valor}</span>
            </div>
            <div className={styles.detail}>
              <strong>Data do Pedido:</strong>
              <span>{dataExibida}</span>
            </div>
            <div className={styles.detail}>
              <strong>Status:</strong>
              <span>{getStatusText()}</span>
            </div>
            <div className={styles.detail}>
              <strong>Observações:</strong>
              <span>{observacoesExibidas}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}