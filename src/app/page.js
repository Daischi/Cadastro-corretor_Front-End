"use client";
import { useState, useEffect } from "react";

import FormularioCorretor from "./components/formulario-corretor";
import TabelaCorretores from "./components/tabela-corretores";
import MensagemErro from "./components/mensagem-erro";
import { formatCpf } from "./utils/format-utils";
import {
  listarCorretores,
  cadastrarCorretor,
  editarCorretor,
  excluirCorretor,
} from "./services/corretor-service";

export default function CorretorForm() {
  const [cpf, setCpf] = useState("");
  const [creci, setCreci] = useState("");
  const [name, setName] = useState("");
  const [corretores, setCorretores] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formMode, setFormMode] = useState("create"); // "create" or "edit"
  const [editingRow, setEditingRow] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: "",
    cpf: "",
    creci: "",
  });
  const [successMessage, setSuccessMessage] = useState(null);

  // Limpar mensagem de sucesso após 3 segundos
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  useEffect(() => {
    fetchCorretores();
  }, []);

  const fetchCorretores = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await listarCorretores();
      setCorretores(data);
    } catch (error) {
      console.error("Erro ao buscar corretores:", error);
      setError(`Não foi possível conectar ao servidor: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      let result;

      if (formMode === "create") {
        // Criar novo corretor
        result = await cadastrarCorretor({ name, cpf, creci });
      } else {
        // Atualizar corretor existente
        result = await editarCorretor({ id: editingId, name, cpf, creci });
      }

      // Verificar se a operação foi bem-sucedida
      if (result.success) {
        setSuccessMessage(
          formMode === "create"
            ? "Corretor cadastrado com sucesso!"
            : "Corretor atualizado com sucesso!"
        );
        resetForm();
        setFormMode("create");
        await fetchCorretores(); // Atualizar a lista
      } else {
        setError(
          `Operação não concluída: ${
            result.message || `Código de status: ${result.status}`
          }`
        );
      }
    } catch (error) {
      console.error("Erro na operação:", error);
      setError(`Falha na operação: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (corretor) => {
    setName(corretor.name);
    setCpf(corretor.cpf);
    setCreci(corretor.creci);
    setEditingId(corretor.id);
    setFormMode("edit");
  };

  const handleInlineEdit = (corretor) => {
    setEditingRow(corretor.id);
    setEditFormData({
      name: corretor.name,
      cpf: corretor.cpf,
      creci: corretor.creci,
    });
  };

  const handleInlineEditChange = (e, field) => {
    let value = e.target.value;

    // Formatar CPF se o campo for CPF
    if (field === "cpf") {
      value = formatCpf(value);
    }

    setEditFormData({
      ...editFormData,
      [field]: value,
    });
  };

  const handleInlineEditSave = async (id) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await editarCorretor({
        id: id,
        name: editFormData.name,
        cpf: editFormData.cpf,
        creci: editFormData.creci,
      });

      // Verificar se a operação foi bem-sucedida
      if (result.success) {
        setSuccessMessage("Corretor atualizado com sucesso!");
        setEditingRow(null);

        // Atualizar o corretor na lista local para feedback imediato
        setCorretores(
          corretores.map((corretor) =>
            corretor.id === id
              ? {
                  ...corretor,
                  name: editFormData.name,
                  cpf: editFormData.cpf,
                  creci: editFormData.creci,
                }
              : corretor
          )
        );

        // Também buscar do servidor para garantir consistência
        await fetchCorretores();
      } else {
        setError(
          `Operação não concluída: ${
            result.message || `Código de status: ${result.status}`
          }`
        );
      }
    } catch (error) {
      console.error("Erro ao salvar:", error);
      setError(`Falha ao salvar: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInlineEditCancel = () => {
    setEditingRow(null);
  };

  const handleDelete = async (id) => {
    if (!confirm("Tem certeza que deseja excluir este corretor?")) return;

    setIsLoading(true);
    setError(null);

    try {
      const result = await excluirCorretor(id);

      // Verificar se a operação foi bem-sucedida
      if (result.success) {
        setSuccessMessage("Corretor excluído com sucesso!");

        // Remover o corretor da lista local para atualização imediata
        setCorretores(corretores.filter((corretor) => corretor.id !== id));

        // Também buscar do servidor para garantir consistência
        await fetchCorretores();
      } else {
        setError(
          `Operação não concluída: ${
            result.message || `Código de status: ${result.status}`
          }`
        );
        // Forçar atualização da lista para garantir consistência
        await fetchCorretores();
      }
    } catch (error) {
      console.error("Erro ao excluir:", error);
      setError(`Falha ao excluir: ${error.message}`);
      // Forçar atualização da lista para garantir consistência
      await fetchCorretores();
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setCpf("");
    setCreci("");
    setName("");
    setEditingId(null);
  };

  const cancelEdit = () => {
    resetForm();
    setFormMode("create");
  };

  const handleCpfChange = (e) => {
    setCpf(formatCpf(e.target.value));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-emerald-500 mb-2">
          Cadastro de Corretores
        </h1>
        <p className="text-center text-gray-500 mb-8">
          Gerencie seus corretores de forma simples e eficiente
        </p>

        {/* Success message */}
        {successMessage && (
          <div className="mb-6 bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-lg flex items-start">
            <div className="mr-2 flex-shrink-0">✓</div>
            <div>{successMessage}</div>
          </div>
        )}

        {/* Error message */}
        {error && <MensagemErro mensagem={error} onRetry={fetchCorretores} />}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Form Card */}
          <FormularioCorretor
            name={name}
            cpf={cpf}
            creci={creci}
            formMode={formMode}
            isLoading={isLoading}
            onNameChange={(e) => setName(e.target.value)}
            onCpfChange={handleCpfChange}
            onCreciChange={(e) => setCreci(e.target.value)}
            onSubmit={handleSubmit}
            onCancelEdit={cancelEdit}
          />

          {/* Table Card */}
          <TabelaCorretores
            corretores={corretores}
            isLoading={isLoading}
            error={error}
            editingRow={editingRow}
            editFormData={editFormData}
            onRefresh={fetchCorretores}
            onInlineEdit={handleInlineEdit}
            onInlineEditChange={handleInlineEditChange}
            onInlineEditSave={handleInlineEditSave}
            onInlineEditCancel={handleInlineEditCancel}
            onDelete={handleDelete}
          />
        </div>
      </div>
    </div>
  );
}
