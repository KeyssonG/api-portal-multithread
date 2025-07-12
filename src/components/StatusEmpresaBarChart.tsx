// StatusEmpresaBarChart.tsx
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface StatusData {
  name: string;
  value: number;
}

export function StatusEmpresaBarChart({ data }: { data: StatusData[] }) {
  const getPieColor = (name: string) => {
    if (name === 'Pendente') return '#ffc107'; // amarelo
    if (name === 'Ativo') return '#43a047'; // verde
    if (name === 'Rejeitado') return '#e53935'; // vermelho
    return '#1976d2';
  };

  return (
    <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 16px rgba(0,0,0,0.10)', padding: 32, margin: '0 auto', maxWidth: 900 }}>
      <h3 style={{ textAlign: 'center', marginBottom: 32, color: '#222', fontSize: 28 }}>Estatísticas de Status das Empresas</h3>
      <ResponsiveContainer width="100%" height={400}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={80}
            outerRadius={140}
            label={({ name, percent }) => `${name}: ${((percent || 0) * 100).toFixed(0)}%`}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getPieColor(entry.name)} />
            ))}
          </Pie>
          <Tooltip formatter={(value: number) => `${value}`} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}