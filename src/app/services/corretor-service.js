const API_BASE_URL = "http://localhost:8000/endpoints";

// Função auxiliar para tratar respostas
async function handleResponse(response) {
  // Se a resposta for bem-sucedida, tenta fazer o parse do JSON
  if (response.ok) {
    try {
      // Tenta fazer o parse do JSON, mas se falhar, retorna um objeto de sucesso
      const text = await response.text();
      return text ? JSON.parse(text) : { success: true };
    } catch (error) {
      console.log(
        "Resposta não é um JSON válido, mas a operação foi bem-sucedida:",
        error
      );
      // Se não conseguir fazer o parse do JSON, mas a resposta for OK, considera sucesso
      return { success: true };
    }
  }

  // Se a resposta não for bem-sucedida, retorna um objeto de erro
  return {
    success: false,
    status: response.status,
    message: `Erro HTTP: ${response.status}`,
  };
}

export async function listarCorretores() {
  try {
    const response = await fetch(`${API_BASE_URL}/listar.php`);

    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }

    const text = await response.text();
    if (!text) return [];

    try {
      const data = JSON.parse(text);
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error("Erro ao fazer parse do JSON:", error);
      return [];
    }
  } catch (error) {
    console.error("Erro ao listar corretores:", error);
    throw error;
  }
}

export async function cadastrarCorretor(corretor) {
  try {
    const response = await fetch(`${API_BASE_URL}/cadastrar.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(corretor),
    });

    return await handleResponse(response);
  } catch (error) {
    console.error("Erro ao cadastrar corretor:", error);
    return { success: false, message: error.message };
  }
}

export async function editarCorretor(corretor) {
  try {
    const response = await fetch(`${API_BASE_URL}/editar.php`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(corretor),
    });

    return await handleResponse(response);
  } catch (error) {
    console.error("Erro ao editar corretor:", error);
    return { success: false, message: error.message };
  }
}

export async function excluirCorretor(id) {
  try {
    const response = await fetch(`${API_BASE_URL}/excluir.php`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    return await handleResponse(response);
  } catch (error) {
    console.error("Erro ao excluir corretor:", error);
    return { success: false, message: error.message };
  }
}
