"use client"

import React, { useState, useEffect } from "react"
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
    const [isCpfValid, setIsCpfValid] = useState(true)
    const [showCpfError, setShowCpfError] = useState(false)

    // Add these state variables after the existing ones
    const [isNameValid, setIsNameValid] = useState(true)
    const [isCretiValid, setIsCretiValid] = useState(true)
    const [showNameError, setShowNameError] = useState(false)
    const [showCretiError, setShowCretiError] = useState(false)

    // Validate CPF length whenever editFormData.cpf changes
    useEffect(() => {
        if (editingRow) {
            const rawCpf = editFormData.cpf?.replace(/\D/g, "") || ""
            const isValid = rawCpf.length === 11
            setIsCpfValid(isValid)

            // Only show error if user has started typing a CPF
            if (rawCpf.length > 0) {
                setShowCpfError(rawCpf.length !== 11)
            } else {
                setShowCpfError(false)
            }
        } else {
            // Reset validation state when not editing
            setIsCpfValid(true)
            setShowCpfError(false)
        }
    }, [editFormData?.cpf, editingRow])

    // Add this useEffect to validate name
    useEffect(() => {
        if (editingRow && editFormData?.name) {
            const isValid = editFormData.name.length >= 2
            setIsNameValid(isValid)
            setShowNameError(editFormData.name.length > 0 && !isValid)
        } else {
            setIsNameValid(true)
            setShowNameError(false)
        }
    }, [editFormData?.name, editingRow])

    // Add this useEffect to validate CRECI
    useEffect(() => {
        if (editingRow && editFormData?.creci) {
            const isValid = editFormData.creci.length >= 2
            setIsCretiValid(isValid)
            setShowCretiError(editFormData.creci.length > 0 && !isValid)
        } else {
            setIsCretiValid(true)
            setShowCretiError(false)
        }
    }, [editFormData?.creci, editingRow])

    // Format CPF as user types (XXX.XXX.XXX-XX)
    const handleCpfChange = (e) => {
        let value = e.target.value

        // Remove all non-numeric characters
        value = value.replace(/\D/g, "")

        // Apply CPF formatting
        if (value.length <= 11) {
            // Format with dots and dash
            if (value.length > 9) {
                value = value.replace(/^(\d{3})(\d{3})(\d{3})(\d{1,2})$/, "$1.$2.$3-$4")
            } else if (value.length > 6) {
                value = value.replace(/^(\d{3})(\d{3})(\d{1,3})$/, "$1.$2.$3")
            } else if (value.length > 3) {
                value = value.replace(/^(\d{3})(\d{1,3})$/, "$1.$2")
            }
        }

        // Call the original onChange handler with the formatted value and field name
        onInlineEditChange(
            {
                target: {
                    value: value,
                    // Add a raw value property that contains only numbers
                    rawValue: value.replace(/\D/g, ""),
                },
            },
            "cpf",
        )
    }

    // Update the handleSave function to check all validations
    const handleSave = (id) => {
        // Check if CPF is valid before saving
        const rawCpf = editFormData.cpf.replace(/\D/g, "")
        let hasError = false

        if (rawCpf.length !== 11) {
            setShowCpfError(true)
            hasError = true
        }

        if (editFormData.name.length < 2) {
            setShowNameError(true)
            hasError = true
        }

        if (editFormData.creci.length < 2) {
            setShowCretiError(true)
            hasError = true
        }

        if (hasError) {
            return
        }

        // Create a copy of the form data with CPF stripped of formatting
        const formData = {
            ...editFormData,
            cpf: rawCpf, // Remove dots and dash
        }

        // Call the original onInlineEditSave with the id and modified data
        onInlineEditSave(id, formData)
    }

    // Update the isFormValid variable
    const isFormValid = editFormData?.name && isNameValid && isCpfValid && editFormData?.creci && isCretiValid

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
                                                <div>
                                                    <input
                                                        type="text"
                                                        value={editFormData.cpf}
                                                        onChange={handleCpfChange}
                                                        className={`w-full px-2 py-1 border rounded focus:outline-none focus:ring-1 ${showCpfError
                                                                ? "border-red-500 focus:ring-red-500"
                                                                : "border-emerald-300 focus:ring-emerald-500"
                                                            }`}
                                                        maxLength="14"
                                                    />
                                                    {showCpfError && <p className="mt-1 text-xs text-red-500">CPF deve conter 11 dígitos</p>}
                                                </div>
                                            ) : (
                                                // Format CPF for display
                                                corretor.cpf.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, "$1.$2.$3-$4")
                                            )}
                                        </td>

                                        <td className="px-6 py-4 text-sm text-gray-900">
                                            {editingRow === corretor.id ? (
                                                <div>
                                                    <input
                                                        type="text"
                                                        value={editFormData.name}
                                                        onChange={(e) => onInlineEditChange(e, "name")}
                                                        className={`w-full px-2 py-1 border rounded focus:outline-none focus:ring-1 ${showNameError
                                                                ? "border-red-500 focus:ring-red-500"
                                                                : "border-emerald-300 focus:ring-emerald-500"
                                                            }`}
                                                        maxLength={100}
                                                    />
                                                    {showNameError && (
                                                        <p className="mt-1 text-xs text-red-500">Nome deve ter pelo menos 2 caracteres</p>
                                                    )}
                                                </div>
                                            ) : (
                                                corretor.name
                                            )}
                                        </td>

                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {editingRow === corretor.id ? (
                                                <div>
                                                    <input
                                                        type="text"
                                                        value={editFormData.creci}
                                                        onChange={(e) => onInlineEditChange(e, "creci")}
                                                        className={`w-full px-2 py-1 border rounded focus:outline-none focus:ring-1 ${showCretiError
                                                                ? "border-red-500 focus:ring-red-500"
                                                                : "border-emerald-300 focus:ring-emerald-500"
                                                            }`}
                                                        maxLength={4}
                                                    />
                                                    {showCretiError && (
                                                        <p className="mt-1 text-xs text-red-500">CRECI deve ter pelo menos 2 caracteres</p>
                                                    )}
                                                </div>
                                            ) : (
                                                corretor.creci
                                            )}
                                        </td>

                                        <td className="px-6 py-4 text-sm">
                                            {editingRow === corretor.id ? (
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() => handleSave(corretor.id)}
                                                        className={`px-3 py-2 cursor-pointer border-[1.5px] rounded-md transition-transform duration-300 ${isFormValid
                                                                ? "text-emerald-500 hover:text-emerald-600 border-emerald-400 hover:bg-teal-100 hover:scale-115"
                                                                : "text-gray-400 border-gray-300 cursor-not-allowed"
                                                            }`}
                                                        title="Salvar"
                                                        disabled={!isFormValid}
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

