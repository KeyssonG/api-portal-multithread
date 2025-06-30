// StatusEmpresaBarChart.tsx
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LabelList, Cell } from 'recharts';

interface StatusData {
  name: string;
  value: number;
}

export function StatusEmpresaBarChart({ data }: { data: StatusData[] }) {
  const getBarColor = (name: string) => {
    if (name === 'Pendente') return '#ffc107'; // amarelo
    if (name === 'Ativo') return '#43a047'; // verde
    if (name === 'Rejeitado') return '#e53935'; // vermelho
    return '#1976d2';
  };

  return (
    <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 16px rgba(0,0,0,0.10)', padding: 32, margin: '0 auto', maxWidth: 900 }}>
      <h3 style={{ textAlign: 'center', marginBottom: 32, color: '#222', fontSize: 28 }}>Estatísticas de Status das Empresas</h3>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={data} barSize={96}>
          <XAxis dataKey="name" tick={{ fontWeight: 600, fontSize: 20 }} />
          <YAxis allowDecimals={false} tick={{ fontSize: 18 }} />
          <Tooltip />
          <Bar dataKey="value" radius={[12, 12, 0, 0]}>
            <LabelList dataKey="value" position="top" style={{ fontWeight: 700, fontSize: 22 }} />
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getBarColor(entry.name)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}