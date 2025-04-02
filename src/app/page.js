"use client";
import { useEffect, useState } from "react";
import CorretorForm from "./components/CorretorForm";

export default function Home() {
  const [corretores, setCorretores] = useState([]);

  // Buscar corretores ao carregar a página
  useEffect(() => {
    fetch("http://localhost/backend/endpoints/listar.php")
      .then((res) => res.json())
      .then((data) => setCorretores(data))
      .catch((err) => console.error("Erro ao buscar corretores:", err));
  }, []);

  return (
    <div className="h-screen w-screen bg-gray-100 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center">
        <h1 className="text-2xl font-bold text-center mb-4">
          Cadastro de Corretores
        </h1>
        <CorretorForm setCorretores={setCorretores} />

        <ul className="mt-4 bg-gray-200 p-4 rounded-lg shadow">
          {corretores.map((corretor) => (
            <li key={corretor.id} className="border-b py-2">
              {corretor.nome} - {corretor.cpf} - CRECI: {corretor.creci}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
