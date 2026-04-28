import { useState, useEffect } from "react";
import styles from "../styles/dashboard.module.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import type { EmpresaPendente } from "../types/types";
import { fechEmpresaPendentes, updateEmpresaStatus } from "../services/empresaService";
import EmpresaCard from "../components/EmpresaCard";

const Consultas = () => {
  const [empresas, setEmpresas] = useState<EmpresaPendente[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [empresaSelecionada, setEmpresaSelecionada] = useState<EmpresaPendente | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      setEmpresaSelecionada(null);
      try {
        const data = await fechEmpresaPendentes();
        setEmpresas(data);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar dados';
        setError(errorMessage);
        setEmpresas([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleCardClick = (empresa: EmpresaPendente) => {
    setEmpresaSelecionada(empresa);
  };

  const handleVoltar = () => {
    setEmpresaSelecionada(null);
  };

  const handleAtualizarStatus = async (newStatus: string) => {
    if (!empresaSelecionada) return;
    
    try {
      await updateEmpresaStatus(empresaSelecionada, newStatus);
      alert(`Status atualizado com sucesso!`);
      setEmpresaSelecionada(null);
      setEmpresas(empresas.filter((e) => e.id !== empresaSelecionada.id));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      alert(`Falha ao atualizar status: ${errorMessage}`);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#f9f9f9' }}>
      <Header />
      <main className={styles.dashboard} style={{ flex: 1 }}>
        {!empresaSelecionada ? (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <div>
                <h2 className={styles.title}>Consultar Empresas Pendentes</h2>
                <p className={styles.subtitle}>
                  Gerencie as empresas que aguardam análise de cadastro:
                </p>
              </div>
            </div>

            {loading && <p className={styles.loading}>Buscando empresas...</p>}
            {error && <p className={styles.error}>{error}</p>}
            {!loading && !error && empresas.length === 0 && (
              <p className={styles.empty}>Nenhuma empresa pendente no momento.</p>
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
            <h2>{empresaSelecionada.name}</h2>
            <p><strong>CNPJ:</strong> {empresaSelecionada.cnpj}</p>
            <p><strong>Número da Conta:</strong> {empresaSelecionada.accountNumber}</p>
            <p><strong>Descrição:</strong> {empresaSelecionada.description}</p>
            <div className={styles.cardActions}>
              <button className={styles.approveButton} onClick={() => handleAtualizarStatus("2")}>
                ✅ Aprovar
              </button>
              <button className={styles.rejectButton} onClick={() => handleAtualizarStatus("3")}>
                ❌ Rejeitar
              </button>
              <button className={styles.backButton} onClick={handleVoltar}>
                🔙 Voltar
              </button>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Consultas;
