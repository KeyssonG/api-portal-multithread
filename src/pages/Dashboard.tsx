import { useEffect, useState } from "react";
import styles from "../styles/dashboard.module.css"
import Header from "../components/Header";
import Footer from "../components/Footer";
import type { EmpresaPendente } from "../types/types";
import { useDashboard } from "../contexts/DashboardContextType";
import { fechEmpresaPendentes, updateEmpresaStatus } from "../services/apiService";
import EmpresaCard from "../components/EmpresaCard";


const Dashboard = () => {
  const [empresas, setEmpresas] = useState<EmpresaPendente[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { empresaSelecionada, setEmpresaSelecionada } = useDashboard();

  useEffect(() => {
    const loadEmpresas = async () => {
      setLoading(true);
      try {
        const data = await fechEmpresaPendentes();
        setEmpresas(data);
      } catch (err: any) {
        setError(err.message || 'Erro ao carregar empresas');
      } finally {
        setLoading(false);
      }
    };


    loadEmpresas();
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
    } catch (err: any) {
      alert(`Falha ao atualizar status: ${err.message}`);
      console.error(err);
    }
  };

  return (
    <div>
      <Header />
      <main className={styles.dashboard}>
        {!empresaSelecionada ? (
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
        ) : (
          <div className={styles.cardExpanded}>
            <h2>{empresaSelecionada.nome}</h2>
            <p><strong>CNPJ:</strong> {empresaSelecionada.cnpj}</p>
            <p><strong>Número da Conta:</strong> {empresaSelecionada.numeroConta}</p>
            <p><strong>Status:</strong> {empresaSelecionada.status === 1 ? '1' : 'Ativo'}</p>
            <p><strong>Descrição:</strong> {empresaSelecionada.descricao}</p>

            <div className={styles.cardActions}>
              <button
                className={styles.approveButton}
                onClick={() => handleAtualizarStatus("2")}
              >
                Aprovar
              </button>
              <button
                className={styles.rejectButton}
                onClick={() => handleAtualizarStatus("3")}
              >
                Rejeitar
              </button>
              <button
                className={styles.backButton}
                onClick={handleVoltar}
              >
                Voltar
              </button>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;