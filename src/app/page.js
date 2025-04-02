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
    <div>
      <div>
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
