"use client";
import { useState, useEffect } from "react";
import {
  Pencil,
  Trash2,
  User,
  Users,
  RefreshCw,
  AlertCircle,
} from "lucide-react";

export default function CorretorForm() {
  const [cpf, setCpf] = useState("");
  const [creci, setCreci] = useState("");
  const [name, setName] = useState("");
  const [corretores, setCorretores] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formMode, setFormMode] = useState("create"); // "create" or "edit"

  useEffect(() => {
    fetchCorretores();
  }, []);

  const fetchCorretores = () => {
    console.log("Iniciando carregamento de corretores...");
    setIsLoading(true);
    setError(null);

    fetch("http://localhost:8000/endpoints/listar.php")
      .then((res) => {
        console.log("Resposta recebida:", res.status);
        if (!res.ok) {
          throw new Error(`Erro HTTP: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log("Dados recebidos:", data);
        setCorretores(Array.isArray(data) ? data : []);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Erro ao buscar corretores:", error);
        setError(`Não foi possível conectar ao servidor: ${error.message}`);
        setIsLoading(false);
      });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (formMode === "create") {
        // Create new agent
        const response = await fetch(
          "http://localhost:8000/endpoints/cadastrar.php",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, cpf, creci }),
          }
        );

        if (!response.ok) {
          throw new Error(`Erro HTTP: ${response.status}`);
        }

        resetForm();
        fetchCorretores();
      } else {
        // Update existing agent
        const response = await fetch(
          "http://localhost:8000/endpoints/atualizar.php",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: editingId, name, cpf, creci }),
          }
        );

        if (!response.ok) {
          throw new Error(`Erro HTTP: ${response.status}`);
        }

        resetForm();
        setFormMode("create");
        fetchCorretores();
      }
    } catch (error) {
      console.error("Erro na operação:", error);
      setError(`Falha na operação: ${error.message}`);
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

  const handleDelete = async (id) => {
    if (!confirm("Tem certeza que deseja excluir este corretor?")) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        "http://localhost:8000/endpoints/excluir.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        }
      );

      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
      }

      fetchCorretores();
    } catch (error) {
      console.error("Erro ao excluir:", error);
      setError(`Falha ao excluir: ${error.message}`);
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

  const formatCpf = (value) => {
    // Remove non-digits
    const digits = value.replace(/\D/g, "");

    // Apply CPF format: XXX.XXX.XXX-XX
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
    if (digits.length <= 9)
      return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
    return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(
      6,
      9
    )}-${digits.slice(9, 11)}`;
  };

  const handleCpfChange = (e) => {
    const formattedCpf = formatCpf(e.target.value);
    setCpf(formattedCpf);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-emerald-500 mb-2">
          Cadastro de Corretores
        </h1>
        <p className="text-center text-gray-500 mb-8">
          Gerencie seus corretores de forma simples e eficiente
        </p>

        {/* Error message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start">
            <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium">Erro de conexão</p>
              <p className="text-sm">{error}</p>
              <div className="mt-2">
                <button
                  onClick={fetchCorretores}
                  className="text-sm bg-red-100 hover:bg-red-200 text-red-800 px-3 py-1 rounded-md inline-flex items-center"
                >
                  <RefreshCw className="h-3 w-3 mr-1" /> Tentar novamente
                </button>
                <div className="mt-2 text-xs text-red-600">
                  <p>Verifique se:</p>
                  <ul className="list-disc pl-5 space-y-1 mt-1">
                    <li>
                      O servidor PHP está rodando em http://localhost:8000
                    </li>
                    <li>O arquivo listar.php existe no diretório /endpoints</li>
                    <li>Não há erros no código PHP</li>
                    <li>O PHP está configurado para permitir CORS</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Form Card */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100">
            <div className="p-5 bg-emerald-50 border-b border-gray-100 flex items-center">
              <User className="text-emerald-500 mr-2" size={20} />
              <h2 className="text-lg font-medium text-gray-800">
                {formMode === "create" ? "Novo Corretor" : "Editar Corretor"}
              </h2>
              {formMode === "edit" && (
                <button
                  onClick={cancelEdit}
                  className="ml-auto text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              )}
            </div>

            <div className="p-6">
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    CPF
                  </label>
                  <input
                    type="text"
                    value={cpf}
                    onChange={handleCpfChange}
                    placeholder="000.000.000-00"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    maxLength="14"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Nome
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Nome completo"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    required
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    CRECI
                  </label>
                  <input
                    type="text"
                    value={creci}
                    onChange={(e) => setCreci(e.target.value)}
                    placeholder="Número do CRECI"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-2 px-4 rounded-md transition-colors"
                  disabled={isLoading}
                >
                  {isLoading
                    ? "Processando..."
                    : formMode === "create"
                    ? "Cadastrar"
                    : "Salvar"}
                </button>
              </form>
            </div>
          </div>

          {/* Table Card */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100">
            <div className="p-5 bg-emerald-50 border-b border-gray-100 flex items-center">
              <Users className="text-emerald-500 mr-2" size={20} />
              <h2 className="text-lg font-medium text-gray-800">
                Corretores Cadastrados
              </h2>
              <button
                onClick={fetchCorretores}
                className="ml-auto text-emerald-600 hover:text-emerald-800"
                title="Atualizar lista"
                disabled={isLoading}
              >
                <RefreshCw
                  className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
                />
              </button>
            </div>

            {isLoading ? (
              <div className="p-6 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500 mb-2"></div>
                <p className="text-gray-500">Carregando corretores...</p>
              </div>
            ) : error ? (
              <div className="p-6 text-center text-gray-500">
                <p>Não foi possível carregar os dados.</p>
                <button
                  onClick={fetchCorretores}
                  className="mt-2 text-emerald-600 hover:text-emerald-800 text-sm inline-flex items-center"
                >
                  <RefreshCw className="h-3 w-3 mr-1" /> Tentar novamente
                </button>
              </div>
            ) : corretores.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 text-left">
                    <tr>
                      <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">
                        ID
                      </th>
                      <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">
                        CPF
                      </th>
                      <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">
                        Nome
                      </th>
                      <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">
                        CRECI
                      </th>
                      <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {corretores.map((corretor) => (
                      <tr key={corretor.id}>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {corretor.id}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {corretor.cpf}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {corretor.name}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {corretor.creci}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEdit(corretor)}
                              className="text-emerald-500 hover:text-emerald-600"
                              title="Editar"
                            >
                              <Pencil size={18} />
                            </button>
                            <button
                              onClick={() => handleDelete(corretor.id)}
                              className="text-red-500 hover:text-red-600"
                              title="Excluir"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-6 text-center">
                <p className="text-gray-500">Nenhum corretor cadastrado.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
