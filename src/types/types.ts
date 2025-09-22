export interface EmpresaPendente {
    id: number;
    cnpj: string;
    status: number;
    description: string;
    name: string;
    accountNumber: number;
}

export interface StatusEmpresaData {
    pendente: number;
    ativo: number;
    rejeitado: number;
}

export interface UserData {
    quantidadeUsuarios: number;
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