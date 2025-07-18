import { useEffect, useState } from "react";
import { getUserData } from "../services/UserService";
import type { UserChartData } from "../types/types";


interface UseUserProjectionProps {
    dataInicio?: string;
    dataFim?: string;
    periodos?: number,
}

export function useUserProjection({
    dataInicio,
    dataFim,
    periodos = 7
}: UseUserProjectionProps = {}) {
    const [data, setData] = useState<UserChartData[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const formatDate = (date: Date): string => {
        return date.toISOString().split('T')[0];
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
            const startDate = dataInicio ? new Date(dataInicio) : new Date();
            const dateRange = generateDateRange(startDate, periodos);

            const userDataPromises = dateRange.map(async (date) => {
                try {
                    const result = await getUserData(date, date);
                    return {
                        data: date,
                        quantidade: result.quantidadeUsers
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

    useEffect(() => {
        fetchUserData();
    }, [dataInicio, dataFim, periodos]);

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