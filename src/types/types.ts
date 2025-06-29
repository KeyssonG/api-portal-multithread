export interface EmpresaPendente {
    id: number;
    cnpj: string;
    status: number;
    descricao: string;
    nome: string;
    numeroConta: number;
}

export interface StatusEmpresaData {
    pendente: number;
    ativo: number;
    rejeitado: number;
}