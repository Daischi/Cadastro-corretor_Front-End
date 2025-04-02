"use client";
import { useState, useEffect } from "react";
import { Pencil, Trash2, User, Users } from "lucide-react";

export default function CorretorForm() {
  const [cpf, setCpf] = useState("");
  const [creci, setCreci] = useState("");
  const [name, setName] = useState("");
  const [corretores, setCorretores] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formMode, setFormMode] = useState("create"); // "create" or "edit"

  useEffect(() => {
    fetchCorretores();
  }, []);

  const fetchCorretores = () => {
    setIsLoading(true);
    fetch("http://localhost:8000/endpoints/listar.php")
      .then((res) => res.json())
      .then((data) => {
        setCorretores(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Erro ao buscar corretores:", error);
        setIsLoading(false);
      });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

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

      if (response.ok) {
        resetForm();
        fetchCorretores();
      } else {
        alert("Erro ao cadastrar corretor.");
        setIsLoading(false);
      }
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

      if (response.ok) {
        resetForm();
        setFormMode("create");
        fetchCorretores();
      } else {
        alert("Erro ao atualizar corretor.");
        setIsLoading(false);
      }
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
    const response = await fetch(
      "http://localhost:8000/endpoints/excluir.php",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      }
    );

    if (response.ok) {
      fetchCorretores();
    } else {
      alert("Erro ao excluir corretor.");
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
            </div>

            {isLoading && corretores.length === 0 ? (
              <div className="p-6 text-center">
                <p className="text-gray-500">Carregando corretores...</p>
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
