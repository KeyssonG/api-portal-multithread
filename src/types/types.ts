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

export interface UnlinkCompanyModuloRequest {
    companyId: number;
    moduloId: number;
}

export interface UserChartData {

    data: string;
    quantidade: number;
}

export interface UserData {
    quantidadeUsuarios: number;
}

export interface UserError {
    message: string;
}

export interface DepartmentData {
    idDepartamento?: number;
    nomeDepartamento: string;
}