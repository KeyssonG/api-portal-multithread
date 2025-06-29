// StatusEmpresaBarChart.tsx
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface StatusData {
  name: string;
  value: number;
}

export function StatusEmpresaBarChart({ data }: { data: StatusData[] }) {
  return (
    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={data}>
        <XAxis dataKey="name" />
        <YAxis allowDecimals={false} domain={[0, 'dataMax']} />
        <Tooltip />
        <Bar dataKey="value" fill="#1976d2" />
      </BarChart>
    </ResponsiveContainer>
  );
}