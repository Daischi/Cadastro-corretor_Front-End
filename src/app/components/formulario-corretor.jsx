"use client"

import { User, UserPlus } from "lucide-react"

export default function FormularioCorretor({
    name,
    cpf,
    creci,
    formMode,
    isLoading,
    onNameChange,
    onCpfChange,
    onCreciChange,
    onSubmit,
    onCancelEdit,
}) {
    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100 md:col-span-1 border-t-emerald-900">
            <div className="p-5 bg-emerald-50 border-b border-gray-100 flex items-center">
                <UserPlus className="text-emerald-500 mr-2" size={20} />
                <h2 className="text-lg font-medium text-gray-800">
                    Novo Corretor
                </h2>
                {formMode === "edit" && (
                    <button onClick={onCancelEdit} className="ml-auto text-gray-400 hover:text-gray-600">
                        ✕
                    </button>
                )}
            </div>

            <div className="p-6">
                <form onSubmit={onSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-medium mb-2">Nome</label>
                        <input
                            type="text"
                            value={name}
                            onChange={onNameChange}
                            placeholder="Nome completo"
                            className="w-full px-3 py-2 border text-gray-900 border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-500"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-medium mb-2">CPF</label>
                        <input
                            type="text"
                            value={cpf}
                            onChange={onCpfChange}
                            placeholder="000.000.000-00"
                            className="w-full px-3 py-2 border text-gray-900 border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-500"
                            maxLength="14"
                            required
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-medium mb-2">CRECI</label>
                        <input
                            type="text"
                            value={creci}
                            onChange={onCreciChange}
                            placeholder="Número do CRECI"
                            className="w-full px-3 py-2 border border-gray-300 text-gray-900 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-500"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-2 px-4 rounded-md transition-colors cursor-pointer"
                        disabled={isLoading}
                    >
                        {isLoading ? "Processando..." : formMode === "create" ? "Cadastrar" : "Salvar"}
                    </button>
                </form>
            </div>
        </div>
    )
}

