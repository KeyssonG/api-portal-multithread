import { useState, useEffect } from "react";
import styles from "../styles/dashboard.module.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import type { Modulo, CompanyResponseDTO } from "../types/types";
import { fetchModulos } from "../services/moduloService";
import { getCompaniesByStatus, linkCompanyModulo } from "../services/empresaService";

const Modulos = () => {
  const [modulos, setModulos] = useState<Modulo[]>([]);
  const [companies, setCompanies] = useState<CompanyResponseDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingCompanies, setLoadingCompanies] = useState(false);
  const [linking, setLinking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  // States de Seleção e UI
  const [selectedModulo, setSelectedModulo] = useState<Modulo | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<CompanyResponseDTO | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // States de Busca
  const [searchTerm, setSearchTerm] = useState("");
  const [moduleSearch, setModuleSearch] = useState("");

  useEffect(() => {
    const carregarModulos = async () => {
      setLoading(true);
      try {
        const data = await fetchModulos("");
        setModulos(data);
      } catch (err) {
        setError("Erro ao carregar módulos.");
      } finally {
        setLoading(false);
      }
    };
    carregarModulos();
  }, []);

  const openCompanySelection = async () => {
    setIsModalOpen(true);
    setSuccessMessage(null);
    if (companies.length === 0) {
      setLoadingCompanies(true);
      try {
        const data = await getCompaniesByStatus(2);
        setCompanies(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingCompanies(false);
      }
    }
  };

  const handleConfirmLink = async () => {
    if (!selectedModulo || !selectedCompany) return;
    
    setLinking(true);
    setError(null);
    setSuccessMessage(null);
    try {
      await linkCompanyModulo(selectedCompany.id, selectedModulo.id, 2);
      setSuccessMessage(`Vínculo realizado com sucesso: ${selectedCompany.name} ↔ ${selectedModulo.nome}`);
      setSelectedModulo(null);
      setSelectedCompany(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao realizar vínculo';
      setError(errorMessage);
    } finally {
      setLinking(false);
    }
  };

  const filteredCompanies = companies.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.id.toString().includes(searchTerm)
  );

  const filteredModulos = modulos.filter(m => 
    m.nome.toLowerCase().includes(moduleSearch.toLowerCase()) || 
    m.id.toString().includes(moduleSearch)
  );

  return (
    <div style={{ backgroundColor: '#f4f7fa', minHeight: '100vh' }}>
      <Header />
      
      <main className={styles.dashboard} style={{ padding: '100px 2rem 40px', maxWidth: '1400px', margin: '0 auto' }}>
        
        <div style={{ display: 'flex', gap: '2rem', minHeight: '75vh' }}>
          
          {/* SEÇÃO 1: Módulos Disponíveis (Esquerda) */}
          <section style={{ flex: 1, backgroundColor: 'white', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column' }}>
            <div style={{ marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.4rem', color: '#1a237e', marginBottom: '1rem', fontWeight: '700' }}>Módulos Disponíveis</h2>
              <div style={{ position: 'relative' }}>
                <input 
                  type="text" 
                  placeholder="Pesquisar módulo..." 
                  value={moduleSearch}
                  onChange={(e) => {
                    setModuleSearch(e.target.value);
                    setSuccessMessage(null);
                  }}
                  style={{ width: '100%', padding: '12px 15px', borderRadius: '10px', border: '1px solid #ddd', outline: 'none', fontSize: '0.95rem' }}
                />
              </div>
            </div>
            
            <div style={{ flex: 1, overflowY: 'auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem', padding: '10px 10px 10px 0', alignContent: 'start' }}>
              {loading ? (
                <p style={{ gridColumn: '1/-1', textAlign: 'center', color: '#666' }}>Carregando módulos...</p>
              ) : filteredModulos.map(modulo => (
                <div 
                  key={modulo.id}
                  onClick={() => {
                    setSelectedModulo(modulo);
                    setSuccessMessage(null);
                    setError(null);
                  }}
                  style={{
                    padding: '1.2rem',
                    borderRadius: '14px',
                    border: '2px solid',
                    borderColor: selectedModulo?.id === modulo.id ? '#1976d2' : '#f0f0f0',
                    backgroundColor: selectedModulo?.id === modulo.id ? '#e3f2fd' : 'white',
                    cursor: 'pointer',
                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    boxShadow: selectedModulo?.id === modulo.id ? '0 4px 12px rgba(25, 118, 210, 0.15)' : '0 2px 4px rgba(0,0,0,0.02)',
                    transform: selectedModulo?.id === modulo.id ? 'translateY(-2px)' : 'none'
                  }}
                >
                  <span style={{ fontWeight: '700', color: selectedModulo?.id === modulo.id ? '#1976d2' : '#333', fontSize: '1rem', lineHeight: '1.3' }}>{modulo.nome}</span>
                  <div style={{ marginTop: '8px' }}>
                    <span style={{ fontSize: '0.75rem', color: '#999', backgroundColor: '#f5f5f5', padding: '2px 8px', borderRadius: '4px', fontWeight: '600' }}>ID {modulo.id}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* SEÇÃO 2: Configuração de Vínculo (Direita) */}
          <section style={{ width: '450px', backgroundColor: 'white', borderRadius: '16px', padding: '2rem', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', border: '1px solid #e0e0e0' }}>
            <h2 style={{ fontSize: '1.4rem', color: '#1a237e', marginBottom: '2rem', fontWeight: '700' }}>Configurar Vínculo</h2>
            
            <div style={{ flex: 1 }}>
              {successMessage && (
                <div style={{ padding: '1rem', backgroundColor: '#e8f5e9', border: '1px solid #43a047', borderRadius: '12px', color: '#2e7d32', marginBottom: '1.5rem', fontSize: '0.9rem', fontWeight: '500', animation: 'fadeIn 0.3s ease' }}>
                  {successMessage}
                </div>
              )}
              
              {error && (
                <div style={{ padding: '1rem', backgroundColor: '#ffebee', border: '1px solid #e53935', borderRadius: '12px', color: '#c62828', marginBottom: '1.5rem', fontSize: '0.9rem', fontWeight: '500', animation: 'fadeIn 0.3s ease' }}>
                  {error}
                </div>
              )}

              {/* Step 1: Módulo */}
              <div style={{ marginBottom: '2.5rem' }}>
                <p style={{ fontSize: '0.75rem', color: '#1976d2', textTransform: 'uppercase', fontWeight: '800', marginBottom: '10px', letterSpacing: '0.5px' }}>1. Módulo Selecionado</p>
                {selectedModulo ? (
                  <div style={{ padding: '1.2rem', backgroundColor: '#e3f2fd', borderRadius: '12px', border: '1px solid #1976d2', color: '#1a237e', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ backgroundColor: '#1976d2', color: 'white', padding: '2px 8px', borderRadius: '6px', fontSize: '0.8rem' }}>ID {selectedModulo.id}</span>
                    {selectedModulo.nome}
                  </div>
                ) : (
                  <div style={{ padding: '1.2rem', backgroundColor: '#f9f9f9', borderRadius: '12px', border: '2px dashed #ddd', color: '#aaa', fontStyle: 'italic', textAlign: 'center' }}>
                    Escolha um módulo ao lado
                  </div>
                )}
              </div>

              {/* Step 2: Empresa */}
              <div style={{ marginBottom: '2.5rem' }}>
                <p style={{ fontSize: '0.75rem', color: '#2e7d32', textTransform: 'uppercase', fontWeight: '800', marginBottom: '10px', letterSpacing: '0.5px' }}>2. Empresa Destinatária</p>
                {selectedCompany ? (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.2rem', backgroundColor: '#e8f5e9', borderRadius: '12px', border: '1px solid #2e7d32', color: '#1b5e20', fontWeight: '700' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                       <span style={{ backgroundColor: '#2e7d32', color: 'white', padding: '2px 8px', borderRadius: '6px', fontSize: '0.8rem' }}>ID {selectedCompany.id}</span>
                       {selectedCompany.name}
                    </div>
                    <button onClick={() => setSelectedCompany(null)} style={{ background: 'none', border: 'none', color: '#2e7d32', cursor: 'pointer', fontSize: '1.2rem' }}>✕</button>
                  </div>
                ) : (
                  <button 
                    disabled={!selectedModulo || linking}
                    onClick={openCompanySelection}
                    style={{ 
                      width: '100%', 
                      padding: '1.2rem', 
                      borderRadius: '12px', 
                      border: '2px solid #2e7d32', 
                      backgroundColor: selectedModulo ? 'white' : '#f5f5f5', 
                      color: '#2e7d32', 
                      fontWeight: '700',
                      cursor: (selectedModulo && !linking) ? 'pointer' : 'not-allowed',
                      transition: 'all 0.2s',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px'
                    }}
                  >
                    <span>+</span> Selecionar Empresa Ativa
                  </button>
                )}
              </div>
            </div>

            {/* Ação Final */}
            <div style={{ borderTop: '1px solid #eee', paddingTop: '1.5rem' }}>
              <button
                disabled={!selectedModulo || !selectedCompany || linking}
                style={{
                  width: '100%',
                  padding: '1.2rem',
                  borderRadius: '14px',
                  border: 'none',
                  backgroundColor: (selectedModulo && selectedCompany && !linking) ? '#1a237e' : '#cfd8dc',
                  color: 'white',
                  fontSize: '1.1rem',
                  fontWeight: '700',
                  cursor: (selectedModulo && selectedCompany && !linking) ? 'pointer' : 'not-allowed',
                  boxShadow: (selectedModulo && selectedCompany && !linking) ? '0 10px 20px rgba(26, 35, 126, 0.2)' : 'none',
                  transition: 'all 0.3s'
                }}
                onClick={handleConfirmLink}
              >
                {linking ? 'Vinculando...' : 'Confirmar Vinculação'}
              </button>
              {(selectedModulo || selectedCompany) && (
                <button 
                  disabled={linking}
                  onClick={() => { setSelectedModulo(null); setSelectedCompany(null); setError(null); setSuccessMessage(null); }}
                  style={{ width: '100%', background: 'none', border: 'none', color: '#999', marginTop: '1rem', cursor: linking ? 'not-allowed' : 'pointer', fontSize: '0.9rem' }}
                >
                  Limpar Seleção
                </button>
              )}
            </div>
          </section>
        </div>

        {/* LISTA FLUTUANTE (MODAL) DE SELEÇÃO DE EMPRESAS */}
        {isModalOpen && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0,0,0,0.6)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 2000,
            backdropFilter: 'blur(5px)',
            padding: '20px'
          }}>
            <div style={{
              backgroundColor: 'white',
              width: '100%',
              maxWidth: '550px',
              borderRadius: '24px',
              padding: '2rem',
              boxShadow: '0 25px 50px rgba(0,0,0,0.3)',
              display: 'flex',
              flexDirection: 'column',
              maxHeight: '85vh',
              animation: 'modalFadeIn 0.3s ease-out'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ margin: 0, color: '#1a237e', fontSize: '1.5rem', fontWeight: '700' }}>Selecionar Empresa</h3>
                <button 
                  onClick={() => setIsModalOpen(false)} 
                  style={{ background: '#f0f0f0', border: 'none', width: '35px', height: '35px', borderRadius: '50%', cursor: 'pointer', fontSize: '1rem', color: '#666' }}
                >
                  ✕
                </button>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <input 
                  type="text" 
                  placeholder="Pesquisar por nome ou ID..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ width: '100%', padding: '15px', borderRadius: '12px', border: '1px solid #ddd', outline: 'none', fontSize: '1rem', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)' }}
                  autoFocus
                />
              </div>

              <div style={{ flex: 1, overflowY: 'auto', borderRadius: '12px', border: '1px solid #eee' }}>
                {loadingCompanies ? (
                  <div style={{ padding: '2rem', textAlign: 'center', color: '#666' }}>Carregando empresas ativas...</div>
                ) : (
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <tbody>
                      {filteredCompanies.map(company => (
                        <tr 
                          key={company.id}
                          onClick={() => { setSelectedCompany(company); setIsModalOpen(false); }}
                          style={{ 
                            borderBottom: '1px solid #f8f8f8', 
                            cursor: 'pointer',
                            transition: 'background 0.2s'
                          }}
                          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#f4fbf4')}
                          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                        >
                          <td style={{ padding: '15px', fontSize: '0.9rem', color: '#999', width: '60px' }}>#{company.id}</td>
                          <td style={{ padding: '15px', fontWeight: '600', color: '#333', fontSize: '1.05rem' }}>{company.name}</td>
                          <td style={{ padding: '15px', textAlign: 'right' }}>
                            <span style={{ fontSize: '0.8rem', color: '#2e7d32', fontWeight: 'bold' }}>SELECIONAR</span>
                          </td>
                        </tr>
                      ))}
                      {filteredCompanies.length === 0 && (
                        <tr>
                          <td colSpan={3} style={{ padding: '3rem', textAlign: 'center', color: '#999' }}>Nenhuma empresa ativa encontrada.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />

      <style>{`
        @keyframes modalFadeIn {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        ::-webkit-scrollbar {
          width: 8px;
        }
        ::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        ::-webkit-scrollbar-thumb {
          background: #ccc;
          border-radius: 10px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #bbb;
        }
      `}</style>
    </div>
  );
};

export default Modulos;
