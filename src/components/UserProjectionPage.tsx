import { useState } from "react";
import { useUserProjection } from "../hooks/useUserProjection";
import { UserProjectionBarChart } from "./UserProjectionBarChart";
import { useNavigate } from "react-router";


export function UserProjectionPage() {
    const [dataInicio, setDataInicio] = useState<string>('');
    const [dataFim, setDataFim] = useState<string>('');
    const [periodos, setPeriodos] = useState<number>(7);


    const navigate = useNavigate();

    const { data, loading, error, refetch } = useUserProjection({
        dataInicio,
        periodos
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        refetch();
    };

    return (
        <div>
            <header />
            <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
                <button
                onClick={() => navigate('/dashboard')}
                style={{
                    marginBottom: 24,
                    padding: '8px 20px',
                    backgroundColor:  '#1976d2',
                    color: 'white',
                    border: 'none',
                    borderRadius: 4,
                    cursor: 'pointer',
                    fontWeight: 'bold'
                }}
                >
                    ← Voltar
                </button>
                <div style={{
                    background: '#fff',
                    borderRadius: 16,
                    boxShadow: '0 2px 16px rgba(0,0,0,0.10)',
                    padding: 24,
                    marginBottom: 24
                }}>
                    <h2 style={{ marginBottom: 24, color: '#222' }}>Projeção de Usuários</h2>

                    <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 16, alignItems: 'end', flexWrap: 'wrap' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: 8, fontWeight: 'bold]' }}>
                                Data início:
                            </label>
                            <input type="date"
                                value={dataInicio}
                                onChange={(e) => setDataInicio(e.target.value)}
                                style={{
                                    padding: '8px 12px',
                                    border: '1px solid #ddd',
                                    borderRadius: 4,
                                    fontSize: 14
                                }}
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: 8, fontWeight: 'bold' }}>
                                Data Fim:
                            </label>
                            <input
                                type="date"
                                value={dataFim}
                                onChange={(e) => setDataFim(e.target.value)}
                                style={{
                                    padding: '8px 12px',
                                    border: '1px solid #ddd',
                                    borderRadius: 4,
                                    fontSize: 14
                                }}
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: 8, fontWeight: 'bold' }}>
                                Períodos:
                            </label>
                            <select
                                value={periodos}
                                onChange={(e) => setPeriodos(Number(e.target.value))}
                                style={{
                                    padding: '8px 12px',
                                    border: '1px solid #ddd',
                                    borderRadius: 4,
                                    fontSize: 14
                                }}
                            >
                                <option value={3}>3 dias</option>
                                <option value={7}>7 dias</option>
                                <option value={14}>14 dias</option>
                                <option value={30}>30 dias</option>
                            </select>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                padding: '10px 20px',
                                backgroundColor: '#1976d2',
                                color: 'white',
                                border: 'none',
                                borderRadius: 4,
                                cursor: loading ? 'not-allowed' : 'pointer',
                                opacity: loading ? 0.6 : 1
                            }}
                        >
                            {loading ? 'Carregando...' : 'Buscar Dados'}
                        </button>
                    </form>

                    {error && (
                        <div style={{
                            marginTop: 16,
                            padding: 12,
                            backgroundColor: '#ff3dbee',
                            color: '#c62828',
                            borderRadius: 4
                        }}>
                            Erro: {error}
                        </div>
                    )}
                </div>

                {data.length > 0 && (
                    <UserProjectionBarChart
                        data={data}
                        title="Projeção de Usuários por Período"
                    />
                )}

                {loading && (
                    <div style={{
                        textAlign: 'center',
                        padding: 40,
                        color: '#666'
                    }}>
                        Carregando dados...
                    </div>
                )}
            </div>
        </div>
    );
}