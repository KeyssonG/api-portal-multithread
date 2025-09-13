import { useEffect, useState } from "react";
import styles from "../styles/dashboard.module.css"
import Header from "../components/Header";
import Footer from "../components/Footer";
import type { EmpresaPendente, StatusEmpresaData } from "../types/types";
import { useDashboard } from "../contexts/DashboardContextType";
import { fechEmpresaPendentes, getStatusEmpresas, updateEmpresaStatus } from "../services/empresaService";
import EmpresaCard from "../components/EmpresaCard";
import { StatusEmpresaBarChart } from "../components/StatusEmpresaBarChart";

const Dashboard = () => {
  const [empresas, setEmpresas] = useState<EmpresaPendente[]>([]);
  const [statusData, setStatusData] = useState<StatusEmpresaData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { empresaSelecionada, setEmpresaSelecionada, showEmpresasPendentes } = useDashboard();

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const empresasData = await fechEmpresaPendentes();
        setEmpresas(empresasData);

        try {
          const statusData = await getStatusEmpresas();
          setStatusData(statusData);
        } catch (statusError: any) {
          console.error('Erro ao carregar dados de status:', statusError);
          setError(`Erro ao carregar estatísticas: ${statusError.message}`);
        }
        
      } catch (err: any) {
        setError(err.message || 'Erro ao carregar dados');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleCardClick = (empresa: EmpresaPendente) => {
    setEmpresaSelecionada(empresa);
  };

  const handleVoltar = () => {
    setEmpresaSelecionada(null)
  };

  const handleAtualizarStatus = async (newStatus: string) => {
    if (!empresaSelecionada) return;
    
    try {
      await updateEmpresaStatus(empresaSelecionada, newStatus);
      alert(`Status atualizado com sucesso!`);
      setEmpresaSelecionada(null);
      setEmpresas(empresas.filter((e) => e.id !== empresaSelecionada.id));
      
      // Recarregar dados de status
      try {
        const newStatusData = await getStatusEmpresas();
        setStatusData(newStatusData);
      } catch (statusError) {
        console.error('Erro ao atualizar estatísticas:', statusError);
      }
    } catch (err: any) {
      alert(`Falha ao atualizar status: ${err.message}`);
      console.error(err);
    }
  };

const processarDadosGrafico = (data: StatusEmpresaData) => {
  return [
    { name: 'Pendente', value: Number(data?.pendente ?? 0) },
    { name: 'Ativo', value: Number(data?.ativo ?? 0) },
    { name: 'Rejeitado', value: Number(data?.rejeitado ?? 0) }
  ];
};

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', paddingTop: '70px' }}>
      <Header />
      <main className={styles.dashboard} style={{ flex: 1 }}>
        {/* Gráfico sempre visível na página principal */}
        {statusData && !empresaSelecionada && (
          <div className={styles.statusContainer}>
            <h3>Estatísticas de Status das Empresas</h3>
            <StatusEmpresaBarChart data={processarDadosGrafico(statusData)} />
          </div>
        )}

        {/* Empresas pendentes só se solicitado */}
        {showEmpresasPendentes && !empresaSelecionada ? (
          <>
            <h2 className={styles.title}>Empresas Pendentes</h2>
            <p className={styles.subtitle}>
              Confira abaixo a lista de empresas aguardando análise:
            </p>
            {loading && <p className={styles.loading}>Carregando empresas...</p>}
            {error && <p className={styles.error}>{error}</p>}
            {!loading && !error && empresas.length === 0 && (
              <p className={styles.empty}>Nenhuma empresa pendente encontrada.</p>
            )}
            <div className={styles.cards}>
              {empresas.map((empresa) => (
                <EmpresaCard 
                  key={empresa.id}
                  empresa={empresa}
                  onClick={handleCardClick}
                />
              ))}
            </div>
          </>
        ) : empresaSelecionada ? (
          <div className={styles.cardExpanded}>
            <h2>{empresaSelecionada.name}</h2>
            <p><strong>CNPJ:</strong> {empresaSelecionada.cnpj}</p>
            <p><strong>Número da Conta:</strong> {empresaSelecionada.accountNumber}</p>
            <p><strong>Status:</strong> {empresaSelecionada.status === 1 ? '1' : 'Ativo'}</p>
            <p><strong>Descrição:</strong> {empresaSelecionada.description}</p>
            <div className={styles.cardActions}>
              <button
                className={styles.approveButton}
                onClick={() => handleAtualizarStatus("2")}
              >
                <span role="img" aria-label="Aprovar">✅</span> Aprovar
              </button>
              <button
                className={styles.rejectButton}
                onClick={() => handleAtualizarStatus("3")}
              >
                <span role="img" aria-label="Rejeitar">❌</span> Rejeitar
              </button>
              <button
                className={styles.backButton}
                onClick={handleVoltar}
              >
                <span role="img" aria-label="Voltar">🔙</span> Voltar
              </button>
            </div>
          </div>
        ) : null}
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;