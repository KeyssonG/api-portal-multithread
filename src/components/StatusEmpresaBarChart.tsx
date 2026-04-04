// StatusEmpresaBarChart.tsx
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface StatusData {
  name: string;
  value: number;
}

export function StatusEmpresaBarChart({ data }: { data: StatusData[] }) {
  const getBarColor = (name: string) => {
    // Cores fiéis à estética limpa da imagem, tons vibrantes de azul
    if (name === 'Ativo') return '#3b82f6'; // dark blue
    if (name === 'Pendente') return '#bfdbfe'; // light blue
    if (name === 'Rejeitado') return '#60a5fa'; // mid blue
    return '#3b82f6'; 
  };

  const total = data.reduce((acc, curr) => acc + curr.value, 0);
  const totalAtivas = data.find(d => d.name === 'Ativo')?.value || 0;
  const porcentagem = total > 0 ? ((totalAtivas / total) * 100).toFixed(1) : '0.0';

  return (
    <div className="bg-[#111827] rounded-3xl p-6 sm:p-8 mx-auto w-full shadow-xl border border-[#1f2937] box-border font-sans mt-2">
      <div className="mb-6 flex flex-col gap-4">
        
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-[#1f2937] flex items-center justify-center border border-[#374151]">
               <svg className="w-7 h-7 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
               </svg>
            </div>
            <div>
               <h3 className="text-3xl font-extrabold text-white tracking-tight">
                  {total}
               </h3>
               <p className="text-sm font-medium text-gray-400 mt-0.5">Empresas registradas</p>
            </div>
          </div>
          <div className="bg-emerald-900/40 text-emerald-400 px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1 border border-emerald-800/50">
             <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 10l7-7m0 0l7 7m-7-7v18" />
             </svg>
             {porcentagem}%
          </div>
        </div>

        <div className="flex items-center gap-8 mt-2 pt-5 border-t border-[#1f2937]">
           <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400">Ativas:</span>
              <span className="text-sm font-bold text-white">{totalAtivas}</span>
           </div>
           <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400">Pendentes:</span>
              <span className="text-sm font-bold text-white">{data.find(d => d.name === 'Pendente')?.value || 0}</span>
           </div>
        </div>

      </div>
      
      <div className="w-full h-[320px] mt-8">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 0, left: 0, bottom: 25 }} barSize={40}>
            
            <XAxis 
              dataKey="name" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#9ca3af', fontSize: 13, fontWeight: 500 }}
              dy={15}
            />
            
            <Tooltip 
              cursor={{ fill: '#1f2937', opacity: 0.5 }}
              contentStyle={{ 
                backgroundColor: '#1f2937',
                borderRadius: '8px', 
                border: '1px solid #374151', 
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.4)',
                color: '#f3f4f6',
                padding: '8px 12px'
              }}
              itemStyle={{ fontWeight: '600', color: '#fff', fontSize: '14px' }}
            />
            
            <Bar dataKey="value" radius={[50, 50, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getBarColor(entry.name)} />
              ))}
            </Bar>
            
          </BarChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
}