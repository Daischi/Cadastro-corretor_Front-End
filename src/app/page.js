"use client";
import { useState } from "react";
import CorretorForm from "../app/components/CorretorForm";

export default function Home() {
  const [corretores, setCorretores] = useState([]);

  return (
    <div>
      <CorretorForm setCorretores={setCorretores} />
    </div>
  );
}
