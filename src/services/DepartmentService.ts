import type { DepartmentData } from "../types/types";
import api from "./apiService";

export const DepartmentService = {
  async cadastrarDepartamento(
    data: DepartmentData,
    _token: string
  ): Promise<void> {
    await api.post("/administracao/departamento", data);
  },

  async listarDepartamentos(_token: string): Promise<DepartmentData[]> {
    const response = await api.get("/administracao/departamento");
    return response.data;
  },

  // Usa o endpoint específico do Portal para buscar departamentos por empresa via query param
  async listarDepartamentosPorEmpresa(companyId: number, _token: string): Promise<DepartmentData[]> {
    const response = await api.get(`/administracao/portal/departamento?companyId=${companyId}`);
    return response.data;
  },

  async deletarDepartamento(data: { idDepartamento: number }, _token: string): Promise<void> {
    await api.delete("/administracao/departamento", {
      data,
    });
  }
};

export default DepartmentService;
