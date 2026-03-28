import axios, { AxiosError } from "axios";
import type { Modulo } from "../types/types";
import api from "./apiService";

export const fetchModulos = async (id?: string): Promise<Modulo[]> => {
    try {
        const url = id ? `/administracao/modulos?id=${id}` : '/administracao/modulos';
        const response = await api.get<Modulo[]>(url);
        return response.data;
    } catch (err) {
        let errorMessage = 'Erro ao buscar módulos';
        if (axios.isAxiosError(err)) {
            const axiosError = err as AxiosError<{ message?: string }>;
            errorMessage = axiosError.response?.data?.message || errorMessage;
        }
        throw new Error(errorMessage);
    }
};
