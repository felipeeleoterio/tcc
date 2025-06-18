// src/components/Pedidos.js
"use client";

import { useState, useEffect } from "react";
import { Save, Edit, Plus, Minus } from "lucide-react"; // Removido HardDrive, mantido o resto
import styles from "../css/Pedidos.module.css";
import ConfirmationModal from "./ConfirmationModal"; // Importe o componente do modal

export default function Pedidos({ onPedidoCadastrado }) {
  const [formData, setFormData] = useState({
    protocolo: `JA${Date.now()}-2024`,
    tipoDocumento: "cpf",
    documento: "",
    nomeCompleto: "",
    tipoTelefone: "movel",
    telefone: "",
    isWhatsApp: false,
    email: "",
    tipoLogradouro: "",
    numero: "",
    complemento: "",
    bairro: "",
    cidade: "Vitória",
    estado: "ES",
    produto: "", // Campo para o produto selecionado no "adicionar item"
    unidadeMedida: "Unit", // Unidade padrão
    quantidade: 1, // Quantidade padrão
    valorFrete: "",
    dataPedido: "",
    horaPedido: "",
    statusPedido: "Pendente",
    observacoes: "",
  });

  const [itens, setItens] = useState([]);
  const [totalPedido, setTotalPedido] = useState(0);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false); // Novo estado para o modal
  const [pedidoToConfirm, setPedidoToConfirm] = useState(null); // Estado para guardar os dados do pedido a ser confirmado

  // Lista de produtos com seus valores
  const produtos = [
    { nome: "Bolinha de Queijo", valorUnit: 0.25, valorKg: 25.0 },
    { nome: "Coxinha de frango", valorUnit: 0.25, valorKg: 25.0 },
    { nome: "Enroladinho de salsicha", valorUnit: 0.25, valorKg: 25.0 },
    { nome: "Pastelzinho de carne", valorUnit: 0.25, valorKg: 25.0 },
    { nome: "Quibe", valorUnit: 0.3, valorKg: 30.0 },
    { nome: "Mini pizza", valorUnit: 0.3, valorKg: 30.0 },
  ];

  const cidades = ["Cariacica", "Serra", "Vila Velha", "Vitória"];
  const unidades = ["Unit", "Kg", "Lt"];
  const descontos = ["0%", "2.5%", "5%", "7.5%", "10%"];

  // Calcular o total do pedido quando os itens mudam
  useEffect(() => {
    const novoTotal = itens.reduce((total, item) => total + item.valorTotal, 0);
    setTotalPedido(novoTotal);
  }, [itens]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const formatDocument = (value, type) => {
    const numbers = value.replace(/\D/g, "");
    if (type === "cpf") {
      // (Exemplo de formatação)
      return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
    } else {
      // (Exemplo de formatação)
      return numbers.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
    }
  };

  const formatPhone = (value, type) => {
    const numbers = value.replace(/\D/g, "");
    if (type === "fixo") {
      // (Exemplo de formatação)
      return numbers.replace(/(\d{2})(\d{4})(\d{4})/, "$1-$2-$3");
    } else {
      // (Exemplo de formatação)
      return numbers.replace(/(\d{2})(\d{5})(\d{4})/, "$1-$2-$3");
    }
  };


  // Função para adicionar item à tabela
  const adicionarItem = () => {
    // Verificar se um produto foi selecionado
    if (!formData.produto) {
      alert("Por favor, selecione um produto");
      return;
    }

    // Verificar se a quantidade é válida
    if (formData.quantidade <= 0) {
      alert("A quantidade deve ser maior que zero");
      return;
    }

    // Encontrar o produto selecionado
    const produtoSelecionado = produtos.find((p) => p.nome === formData.produto);

    if (!produtoSelecionado) {
      alert("Produto não encontrado");
      return;
    }

    // Determinar o valor unitário com base na unidade de medida
    let valorUnitario = 0;
    if (formData.unidadeMedida === "Unit") {
      valorUnitario = produtoSelecionado.valorUnit;
    } else if (formData.unidadeMedida === "Kg") {
      valorUnitario = produtoSelecionado.valorKg;
    } else {
      valorUnitario = produtoSelecionado.valorUnit; // Padrão para outras unidades
    }

    // Calcular o valor total
    const quantidade = Number.parseInt(formData.quantidade);
    const valorTotal = valorUnitario * quantidade;

    // Criar o novo item
    const novoItem = {
      id: Date.now(), // ID único para o item na lista
      codigo: `COD${String(itens.length + 1).padStart(3, "0")}`,
      produto: formData.produto,
      unidadeMedida: formData.unidadeMedida,
      valorUnitario: valorUnitario,
      quantidade: quantidade,
      desconto: "0%", // Desconto inicial
      valorTotal: valorTotal,
    };

    // Adicionar o novo item à lista
    setItens((prevItens) => [...prevItens, novoItem]);

    // Limpar os campos do formulário de item
    setFormData((prev) => ({
      ...prev,
      produto: "",
      quantidade: 1,
    }));
  };

  // Função para adicionar quantidade a um item existente (ou remover, se for 0)
  const adicionarQuantidade = (id) => {
    setItens((prevItens) =>
      prevItens.map((item) => {
        if (item.id === id) {
          const novaQuantidade = item.quantidade + 1;
          return {
            ...item,
            quantidade: novaQuantidade,
            valorTotal: item.valorUnitario * novaQuantidade * (1 - (parseFloat(item.desconto) / 100)),
          };
        }
        return item;
      })
    );
  };

  // Função para remover um item da tabela
  const removerItem = (id) => {
    setItens((prevItens) => prevItens.filter((item) => item.id !== id));
  };

  // Função para aplicar desconto a um item
  const aplicarDesconto = (id, descontoStr) => {
    setItens((prevItens) =>
      prevItens.map((item) => {
        if (item.id === id) {
          // Converter a string de desconto para número (ex: "5%" -> 0.05)
          const descontoPercent = Number.parseFloat(descontoStr) / 100;
          const valorComDesconto = item.valorUnitario * item.quantidade * (1 - descontoPercent);

          return {
            ...item,
            desconto: descontoStr,
            valorTotal: valorComDesconto,
          };
        }
        return item;
      }),
    );
  };

  function formatarDataParaSalvar(data, hora) {
    if (!data) return "";
    const [ano, mes, dia] = data.split("-");
    return `${dia}/${mes}/${ano} ${hora || "00:00"}`;
  }

  // --- Funções para o modal de confirmação ---

  // Esta função é chamada quando o botão "Cadastrar Pedido" é clicado
  const handleOpenConfirmationModal = (e) => {
    e.preventDefault(); // Evita o submit padrão do formulário

    // Adicione validações básicas antes de abrir o modal
    if (!formData.nomeCompleto || !formData.dataPedido || itens.length === 0) {
      alert("Por favor, preencha o nome do cliente, a data do pedido e adicione pelo menos um item.");
      return;
    }

    // Criar o objeto de pedido com os dados atuais do formulário
    const pedidoGerado = {
      cliente: formData.nomeCompleto,
      protocolo: formData.protocolo,
      valor: totalPedido.toFixed(2), // Formata para 2 casas decimais para exibição
      dataPedido: formatarDataParaSalvar(formData.dataPedido, formData.horaPedido),
      // Você pode definir dataEntrega de forma diferente, se houver um campo separado para isso
      dataEntrega: formatarDataParaSalvar(formData.dataPedido, formData.horaPedido),
      status: formData.statusPedido,
      observacoes: formData.observacoes || "Nenhuma observação.",
      itens: itens, // Passa a lista de itens para o modal
      // Inclua outros dados do formulário que você queira exibir no modal
      documento: formData.documento,
      tipoDocumento: formData.tipoDocumento,
      telefone: formData.telefone,
      tipoTelefone: formData.tipoTelefone,
      isWhatsApp: formData.isWhatsApp,
      email: formData.email,
      endereco: {
        tipoLogradouro: formData.tipoLogradouro,
        numero: formData.numero,
        complemento: formData.complemento,
        bairro: formData.bairro,
        cidade: formData.cidade,
        estado: formData.estado,
      },
      valorFrete: formData.valorFrete,
    };

    setPedidoToConfirm(pedidoGerado); // Salva o pedido para ser exibido no modal
    setShowConfirmationModal(true); // Abre o modal
  };

  // Esta função é chamada quando o usuário CONFIRMA o pedido no modal
  const handleConfirmSubmit = async () => {
    setShowConfirmationModal(false); // Fecha o modal imediatamente
    if (!pedidoToConfirm) return;

    console.log("Confirmando pedido:", pedidoToConfirm);

    try {
      const res = await fetch("http://localhost:3001/pedidos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // Envia os dados do pedido. Ajuste conforme sua API espera.
        body: JSON.stringify({
          // Campos que sua API espera receber
          cliente: pedidoToConfirm.cliente,
          protocolo: pedidoToConfirm.protocolo,
          valor: parseFloat(pedidoToConfirm.valor), // Converte de volta para número
          dataPedido: pedidoToConfirm.dataPedido, // Data formatada
          dataEntrega: pedidoToConfirm.dataEntrega, // Data formatada
          statusPedido: pedidoToConfirm.status,
          observacoes: pedidoToConfirm.observacoes,
          itens: pedidoToConfirm.itens, // Inclui a lista de itens
          documento: pedidoToConfirm.documento,
          tipoDocumento: pedidoToConfirm.tipoDocumento,
          telefone: pedidoToConfirm.telefone,
          tipoTelefone: pedidoToConfirm.tipoTelefone,
          isWhatsApp: pedidoToConfirm.isWhatsApp,
          email: pedidoToConfirm.email,
          endereco: pedidoToConfirm.endereco,
          valorFrete: pedidoToConfirm.valorFrete,
        }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Erro no fetch:", res.status, errorText);
        throw new Error("Erro ao salvar o pedido: " + errorText);
      }

      const data = await res.json();
      console.log("Resposta JSON:", data);

      alert("Pedido cadastrado com sucesso! ID: " + data.id);

      // 🔁 Atualiza a lista de pedidos na tela pai, se a função for fornecida
      if (typeof onPedidoCadastrado === "function") {
        onPedidoCadastrado();
      }

      // Limpa os dados do formulário APENAS APÓS a confirmação e sucesso do salvamento
      setFormData({
        protocolo: `JA${Date.now()}-2024`,
        tipoDocumento: "cpf",
        documento: "",
        nomeCompleto: "",
        tipoTelefone: "movel",
        telefone: "",
        isWhatsApp: false,
        email: "",
        tipoLogradouro: "",
        numero: "",
        complemento: "",
        bairro: "",
        cidade: "Vitória",
        estado: "ES",
        produto: "",
        unidadeMedida: "Unit",
        quantidade: 1,
        valorFrete: "",
        dataPedido: "",
        horaPedido: "",
        statusPedido: "Pendente",
        observacoes: "",
      });

      setItens([]);
      setTotalPedido(0);
      setPedidoToConfirm(null); // Limpa o pedido a ser confirmado
    } catch (error) {
      console.error("Erro ao salvar:", error);
      alert("Falha ao cadastrar pedido: " + error.message);
    }
  };

  // Esta função é chamada quando o usuário CANCELA a ação no modal
  const handleCancelSubmit = () => {
    alert("Cadastro de pedido cancelado.");
    setShowConfirmationModal(false); // Fecha o modal
    setPedidoToConfirm(null); // Limpa o pedido a ser confirmado
  };

  return (
    <div className={styles.pedidosContainer}>
      <h1 className={styles.title}>Criar Pedido</h1>

      {/* Altere o onSubmit para chamar a função que abre o modal */}
      <form onSubmit={handleOpenConfirmationModal} className={styles.form}>
        {/* Dados do Cliente */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>1. Dados do Cliente</h2>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Número de Protocolo</label>
            <input type="text" value={formData.protocolo} className={styles.input} readOnly />
          </div>

          <div className={styles.radioGroup}>
            <label>
              <input
                type="radio"
                name="tipoDocumento"
                value="cpf"
                checked={formData.tipoDocumento === "cpf"}
                onChange={handleChange}
              />
              CPF
            </label>
            <label>
              <input
                type="radio"
                name="tipoDocumento"
                value="cnpj"
                checked={formData.tipoDocumento === "cnpj"}
                onChange={handleChange}
              />
              CNPJ
            </label>
          </div>

          <div className={styles.inputRow}>
            <div className={styles.inputGroup}>
              <label className={styles.label}>{formData.tipoDocumento === "cpf" ? "CPF" : "CNPJ"}</label>
              <input
                type="text"
                name="documento"
                value={formData.documento}
                onChange={(e) => setFormData(prev => ({ ...prev, documento: formatDocument(e.target.value, formData.tipoDocumento) }))}
                className={styles.input}
                placeholder={formData.tipoDocumento === "cpf" ? "000.000.000-00" : "00.000.000/0000-00"}
              />
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Nome Completo</label>
              <input
                type="text"
                name="nomeCompleto"
                value={formData.nomeCompleto}
                onChange={handleChange}
                className={styles.input}
                required // Torna este campo obrigatório para o cadastro
              />
            </div>
          </div>

          <div className={styles.radioGroup}>
            <label>
              <input
                type="radio"
                name="tipoTelefone"
                value="fixo"
                checked={formData.tipoTelefone === "fixo"}
                onChange={handleChange}
              />
              Fixo
            </label>
            <label>
              <input
                type="radio"
                name="tipoTelefone"
                value="movel"
                checked={formData.tipoTelefone === "movel"}
                onChange={handleChange}
              />
              Móvel
            </label>
          </div>

          <div className={styles.inputRow}>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Contato Telefônico</label>
              <input
                type="text"
                name="telefone"
                value={formData.telefone}
                onChange={(e) => setFormData(prev => ({ ...prev, telefone: formatPhone(e.target.value, formData.tipoTelefone) }))}
                className={styles.input}
                placeholder={formData.tipoTelefone === "fixo" ? "00-0000-0000" : "00-00000-0000"}
              />
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.label}>E-mail</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={styles.input}
              />
            </div>
          </div>

          <div className={styles.checkboxGroup}>
            <label className={styles.checkboxLabel}>
              <input type="checkbox" name="isWhatsApp" checked={formData.isWhatsApp} onChange={handleChange} />
              WhatsApp
            </label>
          </div>

          <div className={styles.addressGrid}>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Tipo/Logradouro</label>
              <input
                type="text"
                name="tipoLogradouro"
                value={formData.tipoLogradouro}
                onChange={handleChange}
                className={styles.input}
                placeholder="Rua, Avenida, Travessa"
              />
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Número</label>
              <input
                type="text"
                name="numero"
                value={formData.numero}
                onChange={handleChange}
                className={styles.input}
              />
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Complemento</label>
              <input
                type="text"
                name="complemento"
                value={formData.complemento}
                onChange={handleChange}
                className={styles.input}
              />
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Bairro</label>
              <input
                type="text"
                name="bairro"
                value={formData.bairro}
                onChange={handleChange}
                className={styles.input}
              />
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Cidade</label>
              <select name="cidade" value={formData.cidade} onChange={handleChange} className={styles.select}>
                {cidades.map((cidade) => (
                  <option key={cidade} value={cidade}>
                    {cidade}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Estado</label>
              <select name="estado" value={formData.estado} onChange={handleChange} className={styles.select}>
                <option value="ES">ES - Espírito Santo</option>
              </select>
            </div>
          </div>
        </section>

        {/* Dados do Pedido */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>2. Dados do Pedido</h2>

          <div className={styles.pedidoGrid}>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Produto</label>
              <select name="produto" value={formData.produto} onChange={handleChange} className={styles.select}>
                <option value="">Selecione um produto</option>
                {produtos.map((produto) => (
                  <option key={produto.nome} value={produto.nome}>
                    {produto.nome}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Unidade de Medida</label>
              <select
                name="unidadeMedida"
                value={formData.unidadeMedida}
                onChange={handleChange}
                className={styles.select}
              >
                {unidades.map((unidade) => (
                  <option key={unidade} value={unidade}>
                    {unidade}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Quantidade</label>
              <div className={styles.quantityGroup}>
                <input
                  type="number"
                  name="quantidade"
                  value={formData.quantidade}
                  onChange={handleChange}
                  className={styles.input}
                  min="1"
                  // Removido style inline para usar a classe CSS
                />
                <button type="button" onClick={adicionarItem} className={styles.addButton}>
                  <Plus size={14} />
                </button>
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Valor do Frete</label>
              <input
                type="text"
                name="valorFrete"
                value={formData.valorFrete}
                onChange={handleChange}
                className={styles.input}
                placeholder="R$ 0,00"
              />
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Data do Pedido</label>
              <input
                type="date"
                name="dataPedido"
                value={formData.dataPedido}
                onChange={handleChange}
                className={styles.input}
                required // Torna este campo obrigatório para o cadastro
              />
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Hora do Pedido</label>
              <input
                type="time"
                name="horaPedido"
                value={formData.horaPedido}
                onChange={handleChange}
                className={styles.input}
              />
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Status do Pedido</label>
              <select
                name="statusPedido"
                value={formData.statusPedido}
                onChange={handleChange}
                className={styles.select}
              >
                <option value="Pendente">Pendente</option> {/* Padrão inicial */}
                <option value="Em Andamento">Em Andamento</option>
                <option value="Finalizado">Finalizado</option>
                <option value="Aguardando Pagamento">Aguardando Pagamento</option>
                <option value="Agendado para Hoje">Agendado para Hoje</option>
                <option value="Cancelado">Cancelado</option>
              </select>
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Observações</label>
            <textarea
              name="observacoes"
              value={formData.observacoes}
              onChange={handleChange}
              className={styles.textarea}
              rows="3"
            />
          </div>
        </section>

        {/* Tabela de Itens */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>3. Tabela de Itens do Pedido</h2>

          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Nome do Produto</th>
                  <th>Unidade</th>
                  <th>Valor Unitário</th>
                  <th>Quantidade</th>
                  <th>% Desc</th>
                  <th>Valor Total</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {itens.length === 0 ? (
                  <tr>
                    <td colSpan="8" style={{ textAlign: "center", padding: "20px", color: "#666" }}>
                      Nenhum item adicionado
                    </td>
                  </tr>
                ) : (
                  itens.map((item) => (
                    <tr key={item.id}>
                      <td>{item.codigo}</td>
                      <td>{item.produto}</td>
                      <td>{item.unidadeMedida}</td>
                      <td>R$ {item.valorUnitario.toFixed(2)}</td>
                      <td>{item.quantidade}</td>
                      <td>
                        <select
                          className={styles.selectSmall}
                          value={item.desconto}
                          onChange={(e) => aplicarDesconto(item.id, e.target.value)}
                        >
                          {descontos.map((desc) => (
                            <option key={desc} value={desc}>
                              {desc}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td>R$ {item.valorTotal.toFixed(2)}</td>
                      <td>
                        <div className={styles.actionButtons}>
                          <button
                            type="button"
                            onClick={() => adicionarQuantidade(item.id)}
                            className={styles.addItemButton}
                            title="Adicionar mais quantidade"
                          >
                            <Plus size={14} />
                          </button>
                          <button
                            type="button"
                            onClick={() => removerItem(item.id)}
                            className={styles.removeButton}
                            title="Remover item"
                          >
                            <Minus size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
              {itens.length > 0 && (
                <tfoot>
                  <tr>
                    <td colSpan="6" style={{ textAlign: "right", fontWeight: "bold" }}>
                      Total do Pedido:
                    </td>
                    <td colSpan="2" style={{ fontWeight: "bold" }}>
                      R$ {totalPedido.toFixed(2)}
                    </td>
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
        </section>

        {/* Finalização */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>4. Finalização</h2>

          <div className={styles.buttonGroup}>
            <button type="submit" className={styles.saveButton}>
              <Save size={14} />
              Cadastrar Pedido
            </button>
            <button type="button" className={styles.editButton}>
              <Edit size={14} />
              Editar Pedido
            </button>
          </div>
        </section>
      </form>

      {/* O Modal de Confirmação - Renderizado condicionalmente */}
      <ConfirmationModal
        isOpen={showConfirmationModal}
        onClose={handleCancelSubmit}
        onConfirm={handleConfirmSubmit}
        onCancel={handleCancelSubmit}
        pedido={pedidoToConfirm} // Passa os dados do pedido para o modal, incluindo os itens
        confirmButtonText="Confirmar e Cadastrar!"
        cancelButtonText="Voltar e Revisar"
      />
    </div>
  );
}