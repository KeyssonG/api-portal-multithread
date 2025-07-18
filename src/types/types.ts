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

export interface UserData {
    quantidadeUsers: number;
    dataCriacao: string;
}

export interface UserError {
    status: number;
    message: string;
    timestamp: string;
}

export interface UserChartData {
    data: string;
    quantidade: number;
}