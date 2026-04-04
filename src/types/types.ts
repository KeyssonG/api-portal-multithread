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

export interface Modulo {
    id: number;
    nome: string;
}

export interface CompanyResponseDTO {
    id: number;
    name: string;
}

export interface CompanyModuloResponse {
    id: number;
    companyId: number;
    companyName: string;
    moduloId: number;
    moduloName: string;
    status: number;
    statusDescription: string;
}