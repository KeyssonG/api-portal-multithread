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
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR');
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