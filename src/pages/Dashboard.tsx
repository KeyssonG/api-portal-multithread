import { useEffect, useState } from "react";
import styles from "../styles/Dashboard.module.css"
import Header from "../components/Header";
import Footer from "../components/Footer";


// Tipo da resposta da API
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

  return (
    <div>
      <Header />
      <main className={styles.dashboard}>
        <p className={styles.subtitle}>
          Confira abaixo a lista de empresas aguardando análise:
        </p>

        {loading && <p className={styles.loading}>Carregando empresas pendentes...</p>}
        {error && <p className={styles.error}>{error}</p>}

        {!loading && !error && empresas.length === 0 && (
          <p className={styles.empty}>Nenhuma empresa pendente encontrada.</p>
        )}

        <div className={styles.cards}>
          {empresas.map((empresa) => (
            <div key={empresa.id} className={styles.card}>
              <h3>{empresa.nome}</h3>
              <p><strong>CNPJ:</strong> {empresa.cnpj}</p>
              <p><strong>Conta:</strong> {empresa.numeroConta}</p>
              <p><strong>Status:</strong> {empresa.status === 1 ? '1' : 'Pendente'}</p>
              <p><strong>Descrição:</strong> {empresa.descricao}</p>

            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;