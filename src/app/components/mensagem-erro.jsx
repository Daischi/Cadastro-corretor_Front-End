"use client"

import { AlertCircle, RefreshCw } from "lucide-react"

export default function MensagemErro({ mensagem, onRetry }) {
    return (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start">
            <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
            <div>
                <p className="font-medium">Erro de conexão</p>
                <p className="text-sm">{mensagem}</p>
                <div className="mt-2">
                    <button
                        onClick={onRetry}
                        className="text-sm bg-red-100 hover:bg-red-200 text-red-800 px-3 py-1 rounded-md inline-flex items-center"
                    >
                        <RefreshCw className="h-3 w-3 mr-1" /> Tentar novamente
                    </button>
                    <div className="mt-2 text-xs text-red-600">
                        <p>Verifique se:</p>
                        <ul className="list-disc pl-5 space-y-1 mt-1">
                            <li>O servidor PHP está rodando em http://localhost:8000</li>
                            <li>O arquivo listar.php existe no diretório /endpoints</li>
                            <li>Não há erros no código PHP</li>
                            <li>O PHP está configurado para permitir CORS</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}

