import { useEffect, useState } from "react";
import styles from "../styles/Dashboard.module.css"
import Header from "../components/Header";
import Footer from "../components/Footer";


interface EmpresaPendente {
  id: number;
  cnpj: string;
  status: number;
  descricao: string;
  nome: string;
  numeroConta: number;
}

const Dashboard = () => {
  const [empresas, setEmpresas] = useState<EmpresaPendente[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [empresaSelecionada, setEmpresaSelecionada] = useState<EmpresaPendente | null>(null);

  useEffect(() => {
    const fetchEmpresasPendentes = async () => {
      try {
        const response = await fetch('http://localhost:31000/administracao/empresa/pendente/?numeroConta=');

        if (!response.ok) {
          throw new Error('Erro ao buscar empresas pendentes');
        }

        const data: EmpresaPendente[] = await response.json();
        setEmpresas(data);
      } catch (err: any) {
        setError(err.message || 'Erro ao carregar empresas');
      } finally {
        setLoading(false);
      }
    };

    fetchEmpresasPendentes();
  }, []);

  const handleCardClick = (empresa: EmpresaPendente) => {
    setEmpresaSelecionada(empresa);
  };

  const handleVoltar = () => {
    setEmpresaSelecionada(null)
  }

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
                <div
                  key={empresa.id}
                  className={styles.card}
                  onClick={() => handleCardClick(empresa)}
                  style={{ cursor: 'pointer' }}
                >
                  <h3>{empresa.nome}</h3>
                  <p><strong>CNPJ:</strong> {empresa.cnpj}</p>
                  <p><strong>Número da Conta:</strong> {empresa.numeroConta}</p>
                  <p><strong>Status:</strong> {empresa.status === 1 ? '1' : 'Pendente'}</p>
                  <p><strong>Descrição:</strong> {empresa.descricao}</p>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className={styles.cardExpanded}>
            <h2>{empresaSelecionada.nome}</h2>
            <p><strong>CNPJ:</strong> {empresaSelecionada.cnpj}</p>
            <p><strong>Número da Conta:</strong> {empresaSelecionada.numeroConta}</p>
            <p><strong>Status:</strong> {empresaSelecionada.status === 1 ? '1' : 'Pendente'}</p>
            <p><strong>Descrição:</strong> {empresaSelecionada.descricao}</p>

            <div className={styles.cardActions}>
              <button className={styles.approveButton}>Aprovar</button>
              <button className={styles.rejectButton}>Rejeitar</button>
              <button className={styles.backButton} onClick={handleVoltar}>
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