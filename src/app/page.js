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
      </div>
    </div>
  );
}
