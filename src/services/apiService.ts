import type { EmpresaPendente } from "../types/types";



export const fechEmpresaPendentes = async (): Promise<EmpresaPendente[]> => {
    try {
        const response = await fetch('http://localhost:31000/administracao/empresa/pendente/?numeroConta=');

        if (!response.ok) {
            throw new Error('Erro ao buscar empresas Pendentes');
        }

        return await response.json();
    } catch (err: any) {
        throw err;
    }
}

export const updateEmpresaStatus = async (empresa: EmpresaPendente, newStatus: string): Promise<void> => {
    try {
        const response = await fetch(
            `http://localhost:31000/administracao/status/conta?numeroConta=${empresa.numeroConta}`,
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ newStatus }),
            }
        );

        if (!response.ok) {
            throw new Error('Erro ao atualizar status');
        }
    } catch (err: any) {
        throw err;
    }
};