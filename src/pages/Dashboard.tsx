import { useEffect, useState } from "react";
import styles from "../styles/dashboard.module.css"
import Header from "../components/Header";
import Footer from "../components/Footer";
import type { StatusEmpresaData } from "../types/types";
import { getStatusEmpresas } from "../services/empresaService";
import { StatusEmpresaBarChart } from "../components/StatusEmpresaBarChart";

const Dashboard = () => {
  const [statusData, setStatusData] = useState<StatusEmpresaData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const data = await getStatusEmpresas();
        setStatusData(data);
      } catch (err: any) {
        setError(err.message || 'Erro ao carregar dados');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const processarDadosGrafico = (data: StatusEmpresaData) => {
    return [
      { name: 'Pendente', value: Number(data?.pendente ?? 0) },
      { name: 'Ativo', value: Number(data?.ativo ?? 0) },
      { name: 'Rejeitado', value: Number(data?.rejeitado ?? 0) }
    ];
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#f9f9f9' }}>
      <Header />
      <main className={styles.dashboard} style={{ flex: 1 }}>
        <h2 className={styles.title}>Painel de Controle</h2>
        
        {loading && <p className={styles.loading}>Carregando estatísticas...</p>}
        {error && <p className={styles.error}>{error}</p>}
        
        {statusData && (
          <div className="w-full mt-4">
            <StatusEmpresaBarChart data={processarDadosGrafico(statusData)} />
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
