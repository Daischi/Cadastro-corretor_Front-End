"use client";
import { useState, useEffect } from "react";

export default function CorretorForm() {
  const [cpf, setCpf] = useState("");
  const [creci, setCreci] = useState("");
  const [name, setName] = useState("");
  const [corretores, setCorretores] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8000/endpoints/listar.php")
      .then((res) => res.json())
      .then((data) => setCorretores(data))
      .catch((error) => console.error("Erro ao buscar corretores:", error));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch(
      "http://localhost:8000/endpoints/cadastrar.php",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, cpf, creci }),
      }
    );

    if (response.ok) {
      alert("Corretor cadastrado com sucesso!");
      setCpf("");
      setCreci("");
      setName("");

      // Atualiza a lista de corretores
      fetch("http://localhost:8000/endpoints/listar.php")
        .then((res) => res.json())
        .then((data) => setCorretores(data))
        .catch((error) => console.error("Erro ao atualizar lista:", error));
    } else {
      alert("Erro ao cadastrar corretor.");
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="bg-white p-4 rounded-lg shadow">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nome"
          className="border p-2 m-2 w-full"
          required
        />
        <input
          type="text"
          value={cpf}
          onChange={(e) => setCpf(e.target.value)}
          placeholder="CPF"
          className="border p-2 m-2 w-full"
          required
        />
        <input
          type="text"
          value={creci}
          onChange={(e) => setCreci(e.target.value)}
          placeholder="CRECI"
          className="border p-2 m-2 w-full"
          required
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 mt-2 w-full"
        >
          Cadastrar
        </button>
      </form>

      <h2 className="text-xl font-bold mt-4">Lista de Corretores</h2>
      <ul className="bg-white p-4 rounded-lg shadow mt-2">
        {corretores.length > 0 ? (
          corretores.map((corretor) => (
            <li key={corretor.id} className="border-b p-2">
              {corretor.name} - CPF: {corretor.cpf} - CRECI: {corretor.creci}
            </li>
          ))
        ) : (
          <p>Nenhum corretor cadastrado.</p>
        )}
      </ul>
    </div>
  );
}
