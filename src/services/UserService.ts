import axios from "axios";
import type { UserData, UserError } from "../types/types";

const empresaAPI = axios.create({
    baseURL: "http://localhost:8085",
})

empresaAPI.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
})

export const getUserData = async (dataInicio?: string, dataFim?: string): Promise<UserData> => {
    try {
        let url = "/users";
        const params = new URLSearchParams();

        if (dataInicio) params.append("dataInicio", dataInicio);
        if (dataFim) params.append("dataFim", dataFim);

        if (params.toString()) {
            url += `?${params.toString()}`;
        }

        const response = await empresaAPI.get<UserData>(url);
        return response.data;
    } catch (err: any) {
        if (err.response?.status === 400) {
            const errorData: UserError = err.response.data;
            throw new Error(errorData.message);
        }
        throw new Error(err.response.data?.message || "Erro ao buscar dados do usuário");
    }

};