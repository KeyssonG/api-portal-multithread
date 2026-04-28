import { useState, useEffect } from "react";
import styles from "../styles/dashboard.module.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import type { Modulo, CompanyResponseDTO, CompanyModuloResponse } from "../types/types";
import { fetchModulos } from "../services/moduloService";
import { getCompaniesByStatus, linkCompanyModulo, getCompanyModulos, deleteLinkCompanyModulo } from "../services/empresaService";

const Modulos = () => {
  // UI Control
  const [activeTab, setActiveTab] = useState<'consultar' | 'vincular'>('consultar');
  const [loading, setLoading] = useState(false);
  const [linking, setLinking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Data
  const [modulos, setModulos] = useState<Modulo[]>([]);
  const [companies, setCompanies] = useState<CompanyResponseDTO[]>([]);
  const [links, setLinks] = useState<CompanyModuloResponse[]>([]);
  
  // Selection
  const [selectedModulo, setSelectedModulo] = useState<Modulo | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<CompanyResponseDTO | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Search
  const [searchTerm, setSearchTerm] = useState("");
  const [moduleSearch, setModuleSearch] = useState("");
  const [linksSearch, setLinksSearch] = useState("");

  // Confirmation Popup State
  const [confirmPopup, setConfirmPopup] = useState<{
    show: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({ show: false, title: '', message: '', onConfirm: () => {} });

  // Load Initial Data
  useEffect(() => {
    if (activeTab === 'consultar') {
      loadLinks();
    } else {
      loadModulos();
    }
  }, [activeTab]);

  const loadLinks = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getCompanyModulos();
      setLinks(data);
    } catch (err) {
      setError("Erro ao carregar vínculos.");
    } finally {
      setLoading(false);
    }
  };

  const loadModulos = async () => {
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

  const openCompanySelection = async () => {
    setIsModalOpen(true);
    setSuccessMessage(null);
    if (companies.length === 0) {
      try {
        const data = await getCompaniesByStatus(2);
        setCompanies(data);
      } catch (err) {
        console.error(err);
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
      setSuccessMessage(`Vínculo realizado com sucesso!`);
      setSelectedModulo(null);
      setSelectedCompany(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao realizar vínculo';
      setError(errorMessage);
    } finally {
      setLinking(false);
    }
  };

  const handleDeleteLink = (companyId: number, moduloId: number) => {
    setConfirmPopup({
      show: true,
      title: "Confirmar Remoção",
      message: "Tem certeza que deseja remover este vínculo? Esta ação também removerá todos os usuários vinculados a este módulo nesta empresa.",
      onConfirm: async () => {
        setConfirmPopup(prev => ({ ...prev, show: false }));
        setLoading(true);
        setError(null);
        try {
          await deleteLinkCompanyModulo(companyId, moduloId);
          setSuccessMessage("Vínculo removido com sucesso!");
          await loadLinks();
        } catch (err) {
          setError("Erro ao remover vínculo.");
        } finally {
          setLoading(false);
        }
      }
    });
  };

  // Filters
  const filteredLinks = links.filter(l => 
    l.companyName.toLowerCase().includes(linksSearch.toLowerCase()) || 
    l.moduloName.toLowerCase().includes(linksSearch.toLowerCase())
  );

  const filteredModulos = modulos.filter(m => 
    m.nome.toLowerCase().includes(moduleSearch.toLowerCase()) || 
    m.id.toString().includes(moduleSearch)
  );

  const filteredCompanies = companies.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.id.toString().includes(searchTerm)
  );

  return (
    <div style={{ backgroundColor: '#f4f7fa', display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      
      <main className={styles.dashboard} style={{ flex: 1, padding: '100px 2rem 40px', maxWidth: '1400px', margin: '0 auto', width: '100%' }}>
        
        {/* Navigation Tabs */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '2.5rem', backgroundColor: 'white', padding: '8px', borderRadius: '14px', width: 'fit-content', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
          <button 
            onClick={() => { setActiveTab('consultar'); setError(null); setSuccessMessage(null); }}
            style={{
              padding: '12px 25px',
              borderRadius: '10px',
              border: 'none',
              backgroundColor: activeTab === 'consultar' ? '#1a237e' : 'transparent',
              color: activeTab === 'consultar' ? 'white' : '#666',
              fontWeight: '700',
              cursor: 'pointer',
              transition: 'all 0.3s'
            }}
          >
            📋 Consultar Vínculos
          </button>
          <button 
            onClick={() => { setActiveTab('vincular'); setError(null); setSuccessMessage(null); }}
            style={{
              padding: '12px 25px',
              borderRadius: '10px',
              border: 'none',
              backgroundColor: activeTab === 'vincular' ? '#1a237e' : 'transparent',
              color: activeTab === 'vincular' ? 'white' : '#666',
              fontWeight: '700',
              cursor: 'pointer',
              transition: 'all 0.3s'
            }}
          >
            🔗 Novo Vínculo
          </button>
        </div>

        {/* Content Area */}
        {activeTab === 'consultar' ? (
          <div style={{ display: 'flex', gap: '3rem', alignItems: 'start', justifyContent: 'flex-start' }}>
            {/* Coluna de Filtros (Lateral) */}
            <aside style={{ width: '300px', position: 'sticky', top: '120px', flexShrink: 0 }}>
              <div style={{ backgroundColor: 'white', borderRadius: '24px', padding: '2rem', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', border: '1px solid #f0f0f0' }}>
                <h2 style={{ fontSize: '1.6rem', color: '#1a237e', margin: '0 0 1.5rem 0', fontWeight: '800' }}>Vínculos Ativos</h2>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                  <label style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>Pesquisar</label>
                  <div style={{ position: 'relative' }}>
                    <input 
                      type="text" 
                      placeholder="Empresa ou módulo..." 
                      value={linksSearch}
                      onChange={(e) => setLinksSearch(e.target.value)}
                      style={{ 
                        width: '100%', 
                        padding: '14px 18px', 
                        borderRadius: '14px', 
                        border: '1px solid #e2e8f0', 
                        outline: 'none', 
                        backgroundColor: '#f8fafc',
                        fontSize: '0.9rem',
                        transition: 'all 0.3s',
                        paddingRight: '40px'
                      }}
                    />
                    <span style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>🔍</span>
                  </div>
                </div>
              </div>
            </aside>

            {/* Coluna de Dados (Tabela Proporcional) */}
            <section style={{ 
              flex: '0 1 950px', 
              backgroundColor: 'white', 
              borderRadius: '24px', 
              padding: '1.5rem', 
              boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
              border: '1px solid #f0f0f0'
            }}>
              {loading ? (
                <div style={{ padding: '4rem', textAlign: 'center', color: '#666' }}>Carregando vínculos...</div>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 10px', tableLayout: 'fixed' }}>
                    <thead>
                      <tr style={{ textAlign: 'left' }}>
                        <th style={{ padding: '1rem', color: '#94a3b8', fontSize: '0.75rem', textTransform: 'uppercase', width: '6%', textAlign: 'center' }}>ID</th>
                        <th style={{ padding: '1rem', color: '#94a3b8', fontSize: '0.75rem', textTransform: 'uppercase', width: '28%' }}>Empresa</th>
                        <th style={{ padding: '1rem', color: '#94a3b8', fontSize: '0.75rem', textTransform: 'uppercase', width: '40%' }}>Módulo</th>
                        <th style={{ padding: '1rem', color: '#94a3b8', fontSize: '0.75rem', textTransform: 'uppercase', width: '14%', textAlign: 'center' }}>Status</th>
                        <th style={{ padding: '1rem', color: '#94a3b8', fontSize: '0.75rem', textTransform: 'uppercase', width: '12%', textAlign: 'center' }}>Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredLinks.map(link => (
                        <tr key={link.id} style={{ backgroundColor: '#fcfcfc', transition: 'all 0.2s' }}>
                          <td style={{ padding: '1.2rem 1rem', borderRadius: '12px 0 0 12px', border: '1px solid #f0f0f0', borderRight: 'none', textAlign: 'center' }}>
                            <span style={{ fontWeight: '800', color: '#1a237e', backgroundColor: '#eef2ff', padding: '4px 8px', borderRadius: '6px', fontSize: '0.85rem' }}>#{link.id}</span>
                          </td>
                          <td style={{ padding: '1.2rem 1rem', borderTop: '1px solid #f0f0f0', borderBottom: '1px solid #f0f0f0' }}>
                            <div>
                              <div style={{ fontWeight: '700', color: '#333', fontSize: '1.05rem', lineHeight: '1.2' }}>{link.companyName}</div>
                              <div style={{ fontSize: '0.75rem', color: '#999' }}>Cód: {link.companyId}</div>
                            </div>
                          </td>
                          <td style={{ padding: '1.2rem 1rem', borderTop: '1px solid #f0f0f0', borderBottom: '1px solid #f0f0f0' }}>
                            <span style={{ 
                              backgroundColor: '#e3f2fd', 
                              color: '#1976d2', 
                              padding: '6px 12px', 
                              borderRadius: '8px', 
                              fontWeight: '700', 
                              fontSize: '0.9rem', 
                              border: '1px solid #bbdefb',
                              display: 'inline-block',
                              lineHeight: '1.4'
                            }}>
                              {link.moduloName}
                            </span>
                          </td>
                          <td style={{ padding: '1.2rem 1rem', borderTop: '1px solid #f0f0f0', borderBottom: '1px solid #f0f0f0', textAlign: 'center' }}>
                            <span style={{ backgroundColor: '#e8f5e9', color: '#2e7d32', padding: '6px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase', display: 'inline-block', whiteSpace: 'nowrap' }}>
                              {link.statusDescription}
                            </span>
                          </td>
                          <td style={{ padding: '1.2rem 1rem', borderRadius: '0 12px 12px 0', border: '1px solid #f0f0f0', borderLeft: 'none', textAlign: 'center' }}>
                            <button 
                              onClick={() => handleDeleteLink(link.companyId, link.moduloId)}
                              style={{ color: '#e53935', background: 'none', border: 'none', cursor: 'pointer', fontWeight: '700', fontSize: '0.85rem' }}
                            >
                              Remover
                            </button>
                          </td>
                        </tr>
                      ))}
                      {filteredLinks.length === 0 && (
                        <tr>
                          <td colSpan={4} style={{ padding: '4rem', textAlign: 'center', color: '#999' }}>Nenhum vínculo encontrado.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '2rem', minHeight: '70vh' }}>
            <section style={{ flex: 1, backgroundColor: 'white', borderRadius: '20px', padding: '1.5rem', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column' }}>
              <div style={{ marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.4rem', color: '#1a237e', marginBottom: '1rem', fontWeight: '700' }}>Módulos Disponíveis</h2>
                <input 
                  type="text" 
                  placeholder="Pesquisar módulo..." 
                  value={moduleSearch}
                  onChange={(e) => { setModuleSearch(e.target.value); setSuccessMessage(null); }}
                  style={{ width: '100%', padding: '12px 15px', borderRadius: '10px', border: '1px solid #ddd', outline: 'none' }}
                />
              </div>
              
              <div style={{ flex: 1, overflowY: 'auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem', padding: '10px', alignContent: 'start' }}>
                {loading ? (
                  <p style={{ gridColumn: '1/-1', textAlign: 'center', color: '#666' }}>Carregando...</p>
                ) : filteredModulos.map(modulo => (
                  <div 
                    key={modulo.id}
                    onClick={() => { setSelectedModulo(modulo); setSuccessMessage(null); setError(null); }}
                    style={{
                      padding: '1.2rem',
                      borderRadius: '14px',
                      border: '2px solid',
                      borderColor: selectedModulo?.id === modulo.id ? '#1976d2' : '#f0f0f0',
                      backgroundColor: selectedModulo?.id === modulo.id ? '#e3f2fd' : 'white',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      boxShadow: selectedModulo?.id === modulo.id ? '0 4px 12px rgba(25, 118, 210, 0.15)' : '0 2px 4px rgba(0,0,0,0.02)',
                    }}
                  >
                    <span style={{ fontWeight: '700', color: selectedModulo?.id === modulo.id ? '#1976d2' : '#333' }}>{modulo.nome}</span>
                    <div style={{ marginTop: '8px', fontSize: '0.75rem', color: '#999' }}>ID {modulo.id}</div>
                  </div>
                ))}
              </div>
            </section>

            <section style={{ width: '450px', backgroundColor: 'white', borderRadius: '20px', padding: '2rem', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column' }}>
              <h2 style={{ fontSize: '1.4rem', color: '#1a237e', marginBottom: '2rem', fontWeight: '700' }}>Configurar Gestão</h2>
              
              <div style={{ flex: 1 }}>
                {successMessage && (
                  <div style={{ padding: '1rem', backgroundColor: '#e8f5e9', border: '1px solid #43a047', borderRadius: '12px', color: '#2e7d32', marginBottom: '1.5rem', fontWeight: '600' }}>
                    {successMessage}
                  </div>
                )}
                {error && (
                  <div style={{ padding: '1rem', backgroundColor: '#ffebee', border: '1px solid #e53935', borderRadius: '12px', color: '#c62828', marginBottom: '1.5rem', fontWeight: '600' }}>
                    {error}
                  </div>
                )}

                <div style={{ marginBottom: '2.5rem' }}>
                  <p style={{ fontSize: '0.75rem', color: '#1976d2', textTransform: 'uppercase', fontWeight: '800', marginBottom: '10px' }}>1. Módulo</p>
                  {selectedModulo ? (
                    <div style={{ padding: '1.2rem', backgroundColor: '#e3f2fd', borderRadius: '12px', border: '1px solid #1976d2', color: '#1a237e', fontWeight: '700' }}>
                      {selectedModulo.nome}
                    </div>
                  ) : <div style={{ padding: '1.2rem', backgroundColor: '#f9f9f9', borderRadius: '12px', border: '2px dashed #ddd', color: '#aaa', textAlign: 'center' }}>Selecione um módulo</div>}
                </div>

                <div style={{ marginBottom: '2.5rem' }}>
                  <p style={{ fontSize: '0.75rem', color: '#2e7d32', textTransform: 'uppercase', fontWeight: '800', marginBottom: '10px' }}>2. Empresa</p>
                  {selectedCompany ? (
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.2rem', backgroundColor: '#e8f5e9', borderRadius: '12px', border: '1px solid #2e7d32', color: '#1b5e20', fontWeight: '700' }}>
                      {selectedCompany.name}
                      <button onClick={() => setSelectedCompany(null)} style={{ background: 'none', border: 'none', color: '#2e7d32', cursor: 'pointer' }}>✕</button>
                    </div>
                  ) : (
                    <button 
                      disabled={!selectedModulo || linking}
                      onClick={openCompanySelection}
                      style={{ width: '100%', padding: '1.2rem', borderRadius: '12px', border: '2px solid #2e7d32', backgroundColor: 'white', color: '#2e7d32', fontWeight: '700', cursor: selectedModulo ? 'pointer' : 'not-allowed' }}
                    >
                      Selecionar Empresa
                    </button>
                  )}
                </div>
              </div>

              <div style={{ borderTop: '1px solid #eee', paddingTop: '1.5rem' }}>
                <button
                  disabled={!selectedModulo || !selectedCompany || linking}
                  style={{ width: '100%', padding: '1.2rem', borderRadius: '14px', border: 'none', backgroundColor: (selectedModulo && selectedCompany && !linking) ? '#1a237e' : '#cfd8dc', color: 'white', fontSize: '1.1rem', fontWeight: '700', cursor: 'pointer' }}
                  onClick={handleConfirmLink}
                >
                  {linking ? 'Vinculando...' : 'Confirmar Vinculação'}
                </button>
              </div>
            </section>
          </div>
        )}

        {isModalOpen && (
          <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2000, backdropFilter: 'blur(5px)', padding: '20px' }}>
            <div style={{ backgroundColor: 'white', width: '100%', maxWidth: '550px', borderRadius: '24px', padding: '2rem', display: 'flex', flexDirection: 'column', maxHeight: '85vh', animation: 'modalFadeIn 0.3s ease-out' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ margin: 0, color: '#1a237e', fontWeight: '700' }}>Selecionar Empresa</h3>
                <button onClick={() => setIsModalOpen(false)} style={{ background: '#f0f0f0', border: 'none', width: '35px', height: '35px', borderRadius: '50%', cursor: 'pointer' }}>✕</button>
              </div>
              <input 
                type="text" 
                placeholder="Pesquisar empresa..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ width: '100%', padding: '15px', borderRadius: '12px', border: '1px solid #ddd', marginBottom: '1rem' }}
                autoFocus
              />
              <div style={{ flex: 1, overflowY: 'auto', borderRadius: '12px', border: '1px solid #eee' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <tbody>
                    {filteredCompanies.map(company => (
                      <tr key={company.id} onClick={() => { setSelectedCompany(company); setIsModalOpen(false); }} style={{ cursor: 'pointer', borderBottom: '1px solid #f8f8f8' }}>
                        <td style={{ padding: '15px', fontWeight: '600' }}>{company.name}</td>
                        <td style={{ padding: '15px', textAlign: 'right', color: '#2e7d32', fontSize: '0.8rem', fontWeight: 'bold' }}>SELECIONAR</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Confirmation Popup */}
      {confirmPopup.show && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 5000, padding: '20px', backdropFilter: 'blur(3px)' }}>
          <div style={{ backgroundColor: 'white', padding: '2.5rem', borderRadius: '16px', maxWidth: '450px', width: '100%', textAlign: 'center', boxShadow: '0 10px 40px rgba(0,0,0,0.2)', animation: 'fadeIn 0.3s ease-out' }}>
            <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>⚠️</div>
            <h3 style={{ margin: '0 0 1rem 0', color: '#1a237e', fontSize: '1.4rem', fontWeight: '800' }}>{confirmPopup.title}</h3>
            <p style={{ color: '#666', marginBottom: '2rem', lineHeight: '1.5', fontSize: '1rem' }}>{confirmPopup.message}</p>
            <div style={{ display: 'flex', gap: '15px' }}>
              <button 
                onClick={() => setConfirmPopup(prev => ({ ...prev, show: false }))}
                style={{ flex: 1, padding: '12px', backgroundColor: '#f0f0f0', color: '#333', border: 'none', borderRadius: '10px', fontWeight: '700', fontSize: '1.1rem', cursor: 'pointer' }}
              >
                Cancelar
              </button>
              <button 
                onClick={confirmPopup.onConfirm}
                style={{ flex: 1, padding: '12px', backgroundColor: '#e53935', color: 'white', border: 'none', borderRadius: '10px', fontWeight: '700', fontSize: '1.1rem', cursor: 'pointer' }}
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
      <style>{`
        @keyframes modalFadeIn { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      `}</style>
    </div>
  );
};

export default Modulos;
