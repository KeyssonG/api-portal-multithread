import { useState } from "react";
import { getUserData } from "../services/UserService";
import type { UserChartData } from "../types/types";


interface UseUserProjectionProps {
    dataInicio?: string;
    dataFim?: string;
    periodos?: number;
}

export function useUserProjection({
    dataInicio,
    periodos = 7
}: UseUserProjectionProps = {}) {
    const [data, setData] = useState<UserChartData[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const formatDate = (date: Date): string => {
        // Valida se a data é válida
        if (isNaN(date.getTime())) {
            throw new Error('Data inválida para formatação');
        }
        
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear().toString();
        return `${day}${month}${year}`;
    };

    const parseDateString = (dateString: string): Date => {
        // Valida se a string está no formato correto
        if (!dateString || !dateString.includes('-')) {
            throw new Error('Data inválida');
        }
        
        const parts = dateString.split('-');
        if (parts.length !== 3) {
            throw new Error('Formato de data inválido');
        }
        
        const [year, month, day] = parts.map(Number);
        
        // Valida se os números são válidos
        if (isNaN(year) || isNaN(month) || isNaN(day)) {
            throw new Error('Data contém valores inválidos');
        }
        
        // Valida se o mês está no range correto (1-12)
        if (month < 1 || month > 12) {
            throw new Error('Mês inválido');
        }
        
        // Valida se o dia está no range correto (1-31)
        if (day < 1 || day > 31) {
            throw new Error('Dia inválido');
        }
        
        return new Date(year, month - 1, day);
    };

    const generateDateRange = (startDate: Date, periods: number): string[] => {
        const dates: string[] = [];
        const currentDate = new Date(startDate);

        for (let i = 0; i < periods; i++) {
            dates.push(formatDate(currentDate));
            currentDate.setDate(currentDate.getDate() + 1);
        }
        return dates;
    };


    const fetchUserData = async () => {
        setLoading(true);
        setError(null);

        try {
            if (!dataInicio) {
                setError('Data início é obrigatória');
                return;
            }

            const startDate = parseDateString(dataInicio);
            const dateRange = generateDateRange(startDate, periodos);

            const userDataPromises = dateRange.map(async (date) => {
                try {
                    const result = await getUserData(date, date);
                    return {
                        data: date,
                        quantidade: result.quantidadeUsuarios
                    };
                } catch (err: any) {
                    return {
                        data: date,
                        quantidade: 0
                    };
                }
            });

            const results = await Promise.all(userDataPromises);
            setData(results);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };
    const refetch = () => {
        fetchUserData();
    };

    return {
        data,
        loading,
        error,
        refetch
    };
}