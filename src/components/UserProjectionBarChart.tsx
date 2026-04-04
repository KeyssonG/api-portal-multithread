import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

interface UserChartData {
    data: string;
    quantidade: number;
}

interface UserProjectionBarChartProps {
    data: UserChartData[];
    title?: string;
}

export function UserProjectionBarChart({ data, title = "Projeção de Usuários por período" }: UserProjectionBarChartProps) {
    const formatDate = (dateString: string) => {
        // Se a string está no formato DDMMYYYY (8 caracteres)
        if (dateString && dateString.length === 8 && /^\d{8}$/.test(dateString)) {
            const day = dateString.substring(0, 2);
            const month = dateString.substring(2, 4);
            const year = dateString.substring(4, 8);
            return `${day}/${month}/${year}`;
        }
        
        // Se for outro formato, tenta converter normalmente
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) {
                return dateString; // Retorna a string original se não conseguir converter
            }
            return date.toLocaleDateString('pt-BR');
        } catch {
            return dateString; // Retorna a string original em caso de erro
        }
    };

    const formatTooltip = (value: number) => {
        return `${value} usuários`;
    }

    return (
        <div style={{
            backgroundColor: "#fff",
            borderRadius: 16,
            boxShadow: "0 2px 16px rgba(0, 0, 0, 0.10)",
            padding: 32,
            margin: '0 auto',
            maxWidth: 900,
        }}>
            <h3 style={{
                textAlign: "center",
                marginBottom: 32,
                color: '#222',
                fontSize: 28
            }}>
                {title}
            </h3>
            <ResponsiveContainer width="100%" height={400}>
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                        dataKey="data"
                        tickFormatter={formatDate}
                        style={{ fontSize: 12 }}
                    />
                    <YAxis
                        label={{ value: 'Quantidade de Usuários', angle: -90, position: 'insideLeft' }}
                        style={{ fontSize: 12 }}
                    />
                    <Tooltip
                        formatter={formatTooltip}
                        labelFormatter={formatDate}
                    />
                    <Legend />
                    <Bar
                        dataKey="quantidade"
                        fill="#1976d2"
                        name="Usuários"
                        radius={[4, 4, 0, 0]}
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}