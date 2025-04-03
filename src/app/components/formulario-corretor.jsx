"use client"

import { UserPlus } from "lucide-react"
import { useState, useEffect } from "react"

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
    const [isCpfValid, setIsCpfValid] = useState(false)
    const [showCpfError, setShowCpfError] = useState(false)

    // Add these state variables after the existing ones
    const [isNameValid, setIsNameValid] = useState(false)
    const [isCretiValid, setIsCretiValid] = useState(false)
    const [showNameError, setShowNameError] = useState(false)
    const [showCretiError, setShowCretiError] = useState(false)

    // Validate CPF length whenever cpf changes
    useEffect(() => {
        const rawCpf = cpf.replace(/\D/g, "")
        setIsCpfValid(rawCpf.length === 11)

        // Only show error if user has started typing a CPF
        if (rawCpf.length > 0) {
            setShowCpfError(rawCpf.length !== 11)
        } else {
            setShowCpfError(false)
        }
    }, [cpf])

    // Add this useEffect to validate name
    useEffect(() => {
        if (name) {
            setIsNameValid(name.length >= 2)
            setShowNameError(name.length > 0 && name.length < 2)
        } else {
            setIsNameValid(false)
            setShowNameError(false)
        }
    }, [name])

    // Add this useEffect to validate CRECI
    useEffect(() => {
        if (creci) {
            setIsCretiValid(creci.length >= 2)
            setShowCretiError(creci.length > 0 && creci.length < 2)
        } else {
            setIsCretiValid(false)
            setShowCretiError(false)
        }
    }, [creci])

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

        // Call the original onChange handler with the formatted value
        onCpfChange({
            target: {
                value: value,
                // Add a raw value property that contains only numbers
                rawValue: value.replace(/\D/g, ""),
            },
        })
    }

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault()

        // Check if CPF is valid before submitting
        const rawCpf = cpf.replace(/\D/g, "")
        if (rawCpf.length !== 11) {
            setShowCpfError(true)
            return
        }

        // Create a copy of the form data with CPF stripped of formatting
        const formData = {
            name,
            cpf: rawCpf, // Remove dots and dash
            creci,
        }

        // Call the original onSubmit with the modified data
        onSubmit(e, formData)
    }

    // Update the isFormValid variable
    const isFormValid = name && isNameValid && isCpfValid && creci && isCretiValid

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100 md:col-span-1 border-t-emerald-500 border-t-4">
            <div className="p-5 bg-emerald-50 border-b border-gray-100 flex items-center">
                <UserPlus className="text-emerald-500 mr-2" size={20} />
                <h2 className="text-lg font-medium text-gray-800">Novo Corretor</h2>
                {formMode === "edit" && (
                    <button onClick={onCancelEdit} className="ml-auto text-gray-400 hover:text-gray-600">
                        ✕
                    </button>
                )}
            </div>

            <div className="p-6">
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-medium mb-2">Nome</label>
                        <input
                            type="text"
                            value={name}
                            onChange={onNameChange}
                            placeholder="Nome completo"
                            className={`w-full px-3 py-2 border text-gray-900 ${showNameError ? "border-red-500 ring-1 ring-red-500" : "border-gray-300"} rounded-md focus:outline-none focus:ring-1 ${showNameError ? "focus:ring-red-500" : "focus:ring-emerald-500"}`}
                            maxLength={100}
                            required
                        />
                        {showNameError && <p className="mt-1 text-sm text-red-500">Nome deve ter pelo menos 2 caracteres</p>}
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-medium mb-2">CPF</label>
                        <input
                            type="text"
                            value={cpf}
                            onChange={handleCpfChange}
                            placeholder="000.000.000-00"
                            className={`w-full px-3 py-2 border text-gray-900 ${showCpfError ? "border-red-500 ring-1 ring-red-500" : "border-gray-300"} rounded-md focus:outline-none focus:ring-1 ${showCpfError ? "focus:ring-red-500" : "focus:ring-emerald-500"}`}
                            maxLength="14"
                            required
                        />
                        {showCpfError && <p className="mt-1 text-sm text-red-500">CPF deve conter 11 dígitos</p>}
                    </div>

                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-medium mb-2">CRECI</label>
                        <input
                            type="text"
                            value={creci}
                            onChange={onCreciChange}
                            placeholder="Número do CRECI"
                            className={`w-full px-3 py-2 border ${showCretiError ? "border-red-500 ring-1 ring-red-500" : "border-gray-300"} text-gray-900 rounded-md focus:outline-none focus:ring-1 ${showCretiError ? "focus:ring-red-500" : "focus:ring-emerald-500"}`}
                            maxLength={4}
                            required
                        />
                        {showCretiError && <p className="mt-1 text-sm text-red-500">CRECI deve ter pelo menos 2 caracteres</p>}
                    </div>

                    <button
                        type="submit"
                        className={`w-full hover:scale-105 text-white font-medium rounded-md cursor-pointer h-10 px-4 py-2 transition-all duration-300 ${isFormValid ? "bg-emerald-500 hover:bg-emerald-600 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600" : "bg-gray-400 cursor-not-allowed"}`}
                        disabled={isLoading || !isFormValid}
                    >
                        {isLoading ? "Processando..." : formMode === "create" ? "Cadastrar" : "Salvar"}
                    </button>
                </form>
            </div>
        </div>
    )
}

