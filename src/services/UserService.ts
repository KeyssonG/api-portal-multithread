import api from "./apiService";
import type { UserData, UserError } from "../types/types";

export const getUserData = async (dataInicio?: string, dataFim?: string): Promise<UserData> => {
    try {
        let url = "/users";
        const params = new URLSearchParams();

        if (dataInicio) params.append("dataInicio", dataInicio);
        if (dataFim) params.append("dataFim", dataFim);

        if (params.toString()) {
            url += `?${params.toString()}`;
        }

        const response = await api.get<UserData>(url);
        return response.data;
    } catch (err: any) {
        if (err.response?.status === 400) {
            const errorData: UserError = err.response.data;
            throw new Error(errorData.message);
        }
        throw new Error(err.response.data?.message || "Erro ao buscar dados do usuário");
    }

};