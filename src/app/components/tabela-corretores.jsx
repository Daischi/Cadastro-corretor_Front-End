"use client"

import React from "react"
import { Users, RefreshCw, Pencil, Trash2, X, Save } from "lucide-react"
import AvatarCorretor from "./avatar-corretor"

export default function TabelaCorretores({
    corretores,
    isLoading,
    error,
    editingRow,
    editFormData,
    onRefresh,
    onInlineEdit,
    onInlineEditChange,
    onInlineEditSave,
    onInlineEditCancel,
    onDelete,
}) {
    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100 md:col-span-2 border-t-emerald-500 border-t-4 ">
            <div className="p-5 bg-emerald-50 border-b border-gray-100 flex items-center">
                <Users className="text-emerald-500 mr-2" size={20} />
                <h2 className="text-lg font-medium text-gray-800">Corretores Cadastrados</h2>
                <button
                    onClick={onRefresh}
                    className="ml-auto text-emerald-600 hover:text-emerald-800"
                    title="Atualizar lista"
                    disabled={isLoading}
                >
                    <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
                </button>
            </div>

            {isLoading && !corretores.length ? (
                <div className="p-6 text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500 mb-2"></div>
                    <p className="text-gray-500">Carregando corretores...</p>
                </div>
            ) : error && !corretores.length ? (
                <div className="p-6 text-center text-gray-500">
                    <p>Não foi possível carregar os dados.</p>
                    <button
                        onClick={onRefresh}
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
                                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Foto</th>
                                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">ID</th>
                                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">CPF</th>
                                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Nome</th>
                                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">CRECI</th>
                                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {corretores.map((corretor) => (
                                <React.Fragment key={corretor.id}>
                                    <tr className={editingRow === corretor.id ? "bg-emerald-50" : ""}>
                                        <td className="px-6 py-4 text-sm">
                                            <AvatarCorretor nome={corretor.name} />
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">{corretor.id}</td>

                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {editingRow === corretor.id ? (
                                                <input
                                                    type="text"
                                                    value={editFormData.cpf}
                                                    onChange={(e) => onInlineEditChange(e, "cpf")}
                                                    className="w-full px-2 py-1 border border-emerald-300 rounded focus:outline-none focus:ring-1 focus:ring-emerald-500"
                                                    maxLength="14"
                                                />
                                            ) : (
                                                corretor.cpf
                                            )}
                                        </td>

                                        <td className="px-6 py-4 text-sm text-gray-900">
                                            {editingRow === corretor.id ? (
                                                <input
                                                    type="text"
                                                    value={editFormData.name}
                                                    onChange={(e) => onInlineEditChange(e, "name")}
                                                    className="w-full px-2 py-1 border border-emerald-300 rounded focus:outline-none focus:ring-1 focus:ring-emerald-500"
                                                />
                                            ) : (
                                                corretor.name
                                            )}
                                        </td>

                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {editingRow === corretor.id ? (
                                                <input
                                                    type="text"
                                                    value={editFormData.creci}
                                                    onChange={(e) => onInlineEditChange(e, "creci")}
                                                    className="w-full px-2 py-1 border border-emerald-300 rounded focus:outline-none focus:ring-1 focus:ring-emerald-500"
                                                />
                                            ) : (
                                                corretor.creci
                                            )}
                                        </td>

                                        <td className="px-6 py-4 text-sm">
                                            {editingRow === corretor.id ? (
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() => onInlineEditSave(corretor.id)}
                                                        className="text-emerald-500 hover:text-emerald-600  px-3 py-2 cursor-pointer border-emerald-400 border-[1.5px] rounded-md hover:scale-115 transition-transform duration-300 hover:bg-teal-100"
                                                        title="Salvar"
                                                    >
                                                        <Save size={18} />
                                                    </button>
                                                    <button
                                                        onClick={onInlineEditCancel}
                                                        className="text-red-500 hover:text-red-600 px-3 py-2 cursor-pointer border-red-400 border-[1.5px] rounded-md hover:scale-115 transition-transform duration-300 hover:bg-red-100"
                                                        title="Cancelar"
                                                    >
                                                        <X size={18} />
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="flex space-x-2 gap-2">
                                                    <button
                                                        onClick={() => onInlineEdit(corretor)}
                                                        className="text-emerald-500 hover:text-emerald-600 px-3 py-2 cursor-pointer border-emerald-400 border-[1.5px] rounded-md hover:scale-115 transition-transform duration-300 hover:bg-teal-100"
                                                        title="Editar"
                                                    >
                                                        <Pencil size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => onDelete(corretor.id)}
                                                        className="text-red-500 hover:text-red-600 px-3 py-2 cursor-pointer border-red-400 border-[1.5px] rounded-md hover:scale-115 transition-transform duration-300 hover:bg-red-100"
                                                        title="Excluir"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                </React.Fragment>
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
    )
}

