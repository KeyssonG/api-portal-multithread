import { useState, useEffect } from "react";
import styles from "../styles/dashboard.module.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import type { Modulo } from "../types/types";
import { fetchModulos } from "../services/moduloService";

const Modulos = () => {
  const [modulos, setModulos] = useState<Modulo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchId, setSearchId] = useState("");

  useEffect(() => {
    const carregarModulosIniciais = async () => {
      setLoading(true);
      setError(null);
      try {
        const modulosData = await fetchModulos("");
        setModulos(modulosData);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar dados';
        setError(errorMessage);
        setModulos([]);
      } finally {
        setLoading(false);
      }
    };
    carregarModulosIniciais();
  }, []);

  const handleConsultar = async () => {
    setLoading(true);
    setError(null);
    try {
      const modulosData = await fetchModulos(searchId);
      setModulos(modulosData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar dados';
      setError(errorMessage);
      setModulos([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Header />
      <main className={styles.dashboard}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <h2 className={styles.title}>Módulos Disponíveis</h2>
            <p className={styles.subtitle}>
              Consulte os módulos de serviço disponíveis no portal:
            </p>
          </div>
          
          <div style={{ display: 'flex', gap: '10px' }}>
            <input
              type="text"
              placeholder="ID do Módulo (opcional)"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              style={{
                padding: '12px 20px',
                borderRadius: '8px',
                border: '1px solid #ddd',
                width: '200px',
                fontSize: '1rem',
                outline: 'none',
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
              }}
            />
            <button
              onClick={handleConsultar}
              style={{
                padding: '12px 24px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: '#1976d2',
                color: 'white',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                transition: 'background-color 0.2s'
              }}
              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#1565c0')}
              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#1976d2')}
            >
              Consultar
            </button>
          </div>
        </div>

        {loading && <p className={styles.loading}>Buscando módulos...</p>}
        {error && <p className={styles.error}>{error}</p>}
        {!loading && !error && modulos.length === 0 && searchId && (
          <p className={styles.empty}>Nenhum módulo encontrado para o filtro "{searchId}".</p>
        )}
        {!loading && !error && modulos.length === 0 && !searchId && (
          <p className={styles.empty}>Nenhum módulo disponível no momento.</p>
        )}

        <div className={styles.cards}>
          {modulos.map((modulo) => (
            <div key={modulo.id} className={modulo.id === 1 ? styles.moduloCard : styles.moduloCard}>
              <div>
                <h2>{modulo.nome}</h2>
                <p>ID: {modulo.id}</p>
              </div>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Modulos;
