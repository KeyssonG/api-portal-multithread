import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { funcionarioService } from '../services/funcionarioService';
import { moduloService } from '../services/moduloService';
import { DepartmentService } from '../services/DepartmentService';
import { getCompaniesByStatus } from '../services/empresaService';
import type { FuncionarioConsulta } from '../types/funcionario';
import type { CompanyModuloDTO, UserModuloResponse } from '../types/modulo';
import type { CompanyResponseDTO } from '../types/types';

interface LinkModuloFormProps {
  onSuccess?: () => void;
  onError?: (message: string) => void;
}

const LinkModuloForm: React.FC<LinkModuloFormProps> = ({ onSuccess, onError }) => {
  const { token } = useAuth();

  // Tabs
  const [activeTab, setActiveTab] = useState<'consultar' | 'vincular'>('consultar');

  // Selection Data
  const [companies, setCompanies] = useState<CompanyResponseDTO[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<CompanyResponseDTO | null>(null);
  const [userLinks, setUserLinks] = useState<UserModuloResponse[]>([]);
  const [funcionarios, setFuncionarios] = useState<FuncionarioConsulta[]>([]);
  const [modulos, setModulos] = useState<CompanyModuloDTO[]>([]);
  const [departamentos, setDepartamentos] = useState<{ nomeDepartamento: string }[]>([]);

  // UI State
  const [loadingDados, setLoadingDados] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false);
  const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);
  const [searchCompany, setSearchCompany] = useState('');
  const [searchModulo, setSearchModulo] = useState('');
  const [searchLinks, setSearchLinks] = useState('');

  // Form State
  const [selectedModulo, setSelectedModulo] = useState<CompanyModuloDTO | null>(null);
  const [selectedFuncionario, setSelectedFuncionario] = useState<FuncionarioConsulta | null>(null);
  const [departamentoSelecionado, setDepartamentoSelecionado] = useState('');
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');

  // Initial load
  useEffect(() => {
    if (activeTab === 'consultar' && selectedCompany) {
      loadUserLinks();
    }
  }, [activeTab, selectedCompany]);

  // Load modules and departments when company is selected
  useEffect(() => {
    const carregarModulosEDepartamentos = async () => {
      if (!token || !selectedCompany) return;

      setLoadingDados(true);
      try {
        const mods = await moduloService.getModulosByCompany(token, selectedCompany.id);
        setModulos(mods || []);

        const depts = await DepartmentService.listarDepartamentosPorEmpresa(selectedCompany.id, token);
        setDepartamentos(depts || []);
      } catch (error) {
        console.error('Erro ao carregar dados iniciais:', error);
      } finally {
        setLoadingDados(false);
      }
    };

    if (selectedCompany) {
      carregarModulosEDepartamentos();
    } else {
      setModulos([]);
      setDepartamentos([]);
      setFuncionarios([]);
    }
  }, [token, selectedCompany]);

  const loadUserLinks = async () => {
    if (!token || !selectedCompany) return;
    setLoadingDados(true);
    try {
      const links = await moduloService.getUsuariosModulosPorEmpresa(selectedCompany.id, token);
      setUserLinks(links || []);
    } catch (error) {
      console.error('Erro ao buscar vínculos:', error);
    } finally {
      setLoadingDados(false);
    }
  };

  const openCompanySelection = async () => {
    setIsCompanyModalOpen(true);
    if (companies.length === 0 && token) {
      try {
        const data = await getCompaniesByStatus(2); // Empresas Ativas
        setCompanies(data);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const buscarFuncionarios = async () => {
    if (!token || !selectedCompany) return;
    setLoadingDados(true);
    try {
      let data = [];
      const finalDataInicio = dataInicio || '2000-01-01';
      const finalDataFim = dataFim || new Date().toISOString().split('T')[0];

      if (departamentoSelecionado === "") {
        data = await funcionarioService.buscarFuncionariosPorEmpresa(selectedCompany.id, finalDataInicio, finalDataFim, token);
      } else {
        data = await funcionarioService.buscarFuncionariosPorEmpresaEDepartamento(selectedCompany.id, departamentoSelecionado, finalDataInicio, finalDataFim, token);
      }
      setFuncionarios(data || []);
      if (data && data.length === 0) {
        alert('Nenhum funcionário encontrado para os filtros informados.');
      }
    } catch (error: any) {
      console.error('Erro ao buscar funcionários:', error);
      alert(error.message || 'Erro ao buscar funcionários.');
    } finally {
      setLoadingDados(false);
    }
  };

  const handleConfirm = async () => {
    if (!selectedModulo || !selectedFuncionario || !token || !selectedCompany) return;

    setLoadingSubmit(true);
    try {
      await moduloService.vincularUsuarioModulo({
        userId: selectedFuncionario.id,
        moduloId: selectedModulo.moduloId,
        companyId: selectedCompany.id
      }, token);

      alert('Módulo vinculado com sucesso ao funcionário!');
      setSelectedFuncionario(null);
      setSelectedModulo(null);
      if (activeTab === 'consultar') loadUserLinks();
      onSuccess?.();
    } catch (error: any) {
      console.error('Erro ao vincular:', error);
      const msg = error.response?.data?.message || 'Erro inesperado ao vincular módulo.';
      onError?.(msg);
      alert(msg);
    } finally {
      setLoadingSubmit(false);
    }
  };

  const filteredModulos = modulos.filter(m =>
    m.moduloName.toLowerCase().includes(searchModulo.toLowerCase())
  );

  const filteredCompanies = companies.filter(c =>
    c.name.toLowerCase().includes(searchCompany.toLowerCase()) ||
    c.id.toString().includes(searchCompany)
  );

  const filteredLinks = userLinks.filter(l =>
    l.userName.toLowerCase().includes(searchLinks.toLowerCase()) ||
    l.moduloName.toLowerCase().includes(searchLinks.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>

      {/* Navigation Tabs */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '1.5rem', backgroundColor: 'white', padding: '8px', borderRadius: '14px', width: 'fit-content', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
        <button
          onClick={() => setActiveTab('consultar')}
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
          onClick={() => setActiveTab('vincular')}
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

      {/* Top Bar: Company Selection */}
      <div style={{ marginBottom: '2rem', backgroundColor: 'white', padding: '1.5rem', borderRadius: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h3 style={{ margin: 0, color: '#1a237e', fontSize: '1.1rem', fontWeight: '800' }}>EMPRESA SELECIONADA</h3>
          {selectedCompany ? (
            <p style={{ margin: '5px 0 0 0', fontSize: '1.2rem', color: '#333', fontWeight: '700' }}>{selectedCompany.name} <span style={{ color: '#999', fontSize: '0.9rem', fontWeight: '400' }}>(ID: {selectedCompany.id})</span></p>
          ) : (
            <p style={{ margin: '5px 0 0 0', fontSize: '1rem', color: '#e53935', fontWeight: '600' }}>Nenhuma empresa selecionada</p>
          )}
        </div>
        <button
          onClick={openCompanySelection}
          style={{ padding: '12px 24px', backgroundColor: '#1a237e', color: 'white', border: 'none', borderRadius: '12px', fontWeight: '700', cursor: 'pointer' }}
        >
          {selectedCompany ? 'Trocar Empresa' : 'Selecionar Empresa'}
        </button>
      </div>

      {activeTab === 'consultar' ? (
        <section style={{ display: 'flex', gap: '2rem', backgroundColor: 'white', borderRadius: '24px', padding: '2rem', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', border: '1px solid #f0f0f0', minHeight: '400px' }}>
          
          {/* Coluna Esquerda: Filtro e Título */}
          <div style={{ width: '320px', display: 'flex', flexDirection: 'column', gap: '1rem', borderRight: '1px solid #f0f0f0', paddingRight: '2rem' }}>
            <h2 style={{ fontSize: '1.4rem', color: '#1a237e', margin: 0, fontWeight: '700', lineHeight: '1' }}>Vínculos de Usuários</h2>
            <p style={{ fontSize: '0.85rem', color: '#666', lineHeight: '1.5' }}>
              Pesquise abaixo para encontrar os módulos vinculados a determinados funcionários de forma rápida.
            </p>
            <div style={{ marginTop: '1rem' }}>
              <label style={{ fontSize: '0.75rem', fontWeight: '800', color: '#999', textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>Filtro de Busca</label>
              <input 
                type="text" 
                placeholder="Por nome ou módulo..." 
                value={searchLinks}
                onChange={(e) => setSearchLinks(e.target.value)}
                style={{ padding: '12px 15px', borderRadius: '10px', border: '1px solid #ddd', width: '100%', outline: 'none', transition: 'border 0.3s' }}
              />
            </div>
          </div>

          {/* Coluna Direita: Tabela de Vínculos */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', marginTop: '-8px' }}>
            {!selectedCompany ? (
              <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#999', fontSize: '1.1rem' }}>Selecione uma empresa superiormente para ver os vínculos.</div>
            ) : loadingDados ? (
              <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#666' }}>Carregando vínculos...</div>
            ) : (
              <div style={{ overflowX: 'auto', flex: 1 }}>
                <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0' }}>
                <thead>
                  <tr style={{ textAlign: 'left' }}>
                    <th style={{ padding: '0 1rem 0.5rem 1rem', color: '#94a3b8', fontSize: '0.75rem', textTransform: 'uppercase' }}>Usuário</th>
                    <th style={{ padding: '0 1rem 0.5rem 1rem', color: '#94a3b8', fontSize: '0.75rem', textTransform: 'uppercase' }}>Módulo</th>
                    <th style={{ padding: '0 1rem 0.5rem 1rem', color: '#94a3b8', fontSize: '0.75rem', textTransform: 'uppercase', textAlign: 'center' }}>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLinks.map(link => (
                    <tr key={link.id} style={{ backgroundColor: '#fcfcfc' }}>
                      <td style={{ padding: '1.2rem 1rem', borderRadius: '12px 0 0 12px', border: '1px solid #f0f0f0', borderRight: 'none', borderTop: 'none' }}>
                        <div style={{ fontWeight: '700', color: '#333' }}>{link.userName}</div>
                        <div style={{ fontSize: '0.75rem', color: '#999' }}>ID: {link.userId}</div>
                      </td>
                      <td style={{ padding: '1.2rem 1rem', borderTop: 'none', borderBottom: '1px solid #f0f0f0' }}>
                        <span style={{ backgroundColor: '#e3f2fd', color: '#1976d2', padding: '6px 12px', borderRadius: '8px', fontWeight: '700', fontSize: '0.9rem' }}>{link.moduloName}</span>
                      </td>
                      <td style={{ padding: '1.2rem 1rem', borderRadius: '0 12px 12px 0', border: '1px solid #f0f0f0', borderLeft: 'none', borderTop: 'none', textAlign: 'center' }}>
                         <button style={{ color: '#e53935', background: 'none', border: 'none', cursor: 'pointer', fontWeight: '700' }}>Remover</button>
                      </td>
                    </tr>
                  ))}
                  {filteredLinks.length === 0 && (
                    <tr>
                      <td colSpan={3} style={{ padding: '3rem', textAlign: 'center', color: '#999' }}>Nenhum vínculo encontrado.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            )}
          </div>
        </section>
      ) : (
        /* Novo Vínculo Layout */
        <div style={{ display: 'flex', gap: '2rem', height: 'calc(100vh - 450px)', minHeight: '400px' }}>
          
          {/* LEFT PANEL: Módulos Disponíveis */}
          <section style={{ flex: 1, backgroundColor: 'white', borderRadius: '20px', padding: '1.5rem', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column' }}>
            <div style={{ marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.4rem', color: '#1a237e', marginBottom: '1rem', fontWeight: '700' }}>Módulos da Empresa</h2>
              <input
                type="text"
                placeholder="Pesquisar módulo..."
                value={searchModulo}
                onChange={(e) => setSearchModulo(e.target.value)}
                style={{ width: '100%', padding: '12px 15px', borderRadius: '10px', border: '1px solid #ddd', outline: 'none' }}
                disabled={!selectedCompany}
              />
            </div>

            <div style={{ flex: 1, overflowY: 'auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem', padding: '10px', alignContent: 'start' }}>
              {!selectedCompany ? (
                <p style={{ gridColumn: '1/-1', textAlign: 'center', color: '#999', padding: '2rem' }}>Selecione uma empresa primeiro.</p>
              ) : loadingDados && modulos.length === 0 ? (
                <p style={{ gridColumn: '1/-1', textAlign: 'center', color: '#666' }}>Carregando...</p>
              ) : filteredModulos.map(modulo => (
                <div
                  key={modulo.moduloId}
                  onClick={() => setSelectedModulo(modulo)}
                  style={{
                    padding: '1.2rem',
                    borderRadius: '14px',
                    border: '2px solid',
                    borderColor: selectedModulo?.moduloId === modulo.moduloId ? '#1976d2' : '#f0f0f0',
                    backgroundColor: selectedModulo?.moduloId === modulo.moduloId ? '#e3f2fd' : 'white',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    boxShadow: selectedModulo?.moduloId === modulo.moduloId ? '0 4px 12px rgba(25, 118, 210, 0.15)' : '0 2px 4px rgba(0,0,0,0.02)',
                  }}
                >
                  <span style={{ fontWeight: '700', color: selectedModulo?.moduloId === modulo.moduloId ? '#1976d2' : '#333' }}>{modulo.moduloName}</span>
                  <div style={{ marginTop: '8px', fontSize: '0.75rem', color: '#999' }}>ID {modulo.moduloId}</div>
                </div>
              ))}
              {selectedCompany && filteredModulos.length === 0 && !loadingDados && (
                <p style={{ gridColumn: '1/-1', textAlign: 'center', color: '#999' }}>Nenhum módulo disponível.</p>
              )}
            </div>
          </section>

          {/* RIGHT PANEL: Configurar Gestão */}
          <section style={{ width: '450px', backgroundColor: 'white', borderRadius: '20px', padding: '2rem', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column' }}>
            <h2 style={{ fontSize: '1.4rem', color: '#1a237e', marginBottom: '2rem', fontWeight: '700' }}>Configurar Gestão</h2>

            <div style={{ flex: 1 }}>
              <div style={{ marginBottom: '2.5rem' }}>
                <p style={{ fontSize: '0.75rem', color: '#1976d2', textTransform: 'uppercase', fontWeight: '800', marginBottom: '10px' }}>1. Módulo</p>
                {selectedModulo ? (
                  <div style={{ padding: '1.2rem', backgroundColor: '#e3f2fd', borderRadius: '12px', border: '1px solid #1976d2', color: '#1a237e', fontWeight: '700' }}>
                    {selectedModulo.moduloName}
                  </div>
                ) : <div style={{ padding: '1.2rem', backgroundColor: '#f9f9f9', borderRadius: '12px', border: '2px dashed #ddd', color: '#aaa', textAlign: 'center' }}>Selecione um módulo</div>}
              </div>

              <div style={{ marginBottom: '2.5rem' }}>
                <p style={{ fontSize: '0.75rem', color: '#2e7d32', textTransform: 'uppercase', fontWeight: '800', marginBottom: '10px' }}>2. Funcionário</p>
                {selectedFuncionario ? (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.2rem', backgroundColor: '#e8f5e9', borderRadius: '12px', border: '1px solid #2e7d32', color: '#1b5e20', fontWeight: '700' }}>
                    {selectedFuncionario.nome}
                    <button onClick={() => setSelectedFuncionario(null)} style={{ background: 'none', border: 'none', color: '#2e7d32', cursor: 'pointer' }}>✕</button>
                  </div>
                ) : (
                  <button
                    disabled={!selectedModulo || loadingSubmit || !selectedCompany}
                    onClick={() => setIsEmployeeModalOpen(true)}
                    style={{ width: '100%', padding: '1.2rem', borderRadius: '12px', border: '2px solid #2e7d32', backgroundColor: 'white', color: '#2e7d32', fontWeight: '700', cursor: (selectedModulo && selectedCompany) ? 'pointer' : 'not-allowed' }}
                  >
                    Selecionar Funcionário
                  </button>
                )}
              </div>
            </div>

            <div style={{ borderTop: '1px solid #eee', paddingTop: '1.5rem' }}>
              <button
                disabled={!selectedModulo || !selectedFuncionario || loadingSubmit || !selectedCompany}
                style={{ width: '100%', padding: '1.2rem', borderRadius: '14px', border: 'none', backgroundColor: (selectedModulo && selectedFuncionario && !loadingSubmit) ? '#1a237e' : '#cfd8dc', color: 'white', fontSize: '1.1rem', fontWeight: '700', cursor: 'pointer' }}
                onClick={handleConfirm}
              >
                {loadingSubmit ? 'Vinculando...' : 'Confirmar Vinculação'}
              </button>
            </div>
          </section>
        </div>
      )}

      {/* Company Selection Modal */}
      {isCompanyModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 3000, backdropFilter: 'blur(5px)', padding: '20px' }}>
          <div style={{ backgroundColor: 'white', width: '100%', maxWidth: '550px', borderRadius: '24px', padding: '2rem', display: 'flex', flexDirection: 'column', maxHeight: '85vh' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ margin: 0, color: '#1a237e', fontWeight: '700' }}>Selecionar Empresa</h3>
              <button onClick={() => setIsCompanyModalOpen(false)} style={{ background: '#f0f0f0', border: 'none', width: '35px', height: '35px', borderRadius: '50%', cursor: 'pointer' }}>✕</button>
            </div>
            <input 
              type="text" 
              placeholder="Pesquisar empresa..." 
              value={searchCompany}
              onChange={(e) => setSearchCompany(e.target.value)}
              style={{ width: '100%', padding: '15px', borderRadius: '12px', border: '1px solid #ddd', marginBottom: '1rem' }}
              autoFocus
            />
            <div style={{ flex: 1, overflowY: 'auto', borderRadius: '12px', border: '1px solid #eee' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <tbody>
                  {filteredCompanies.map(company => (
                    <tr key={company.id} onClick={() => { setSelectedCompany(company); setSelectedModulo(null); setSelectedFuncionario(null); setIsCompanyModalOpen(false); }} style={{ cursor: 'pointer', borderBottom: '1px solid #f8f8f8' }}>
                      <td style={{ padding: '15px', fontWeight: '600' }}>{company.name}</td>
                      <td style={{ padding: '15px', textAlign: 'right', color: '#2e7d32', fontSize: '0.8rem', fontWeight: 'bold' }}>SELECIONAR</td>
                    </tr>
                  ))}
                  {filteredCompanies.length === 0 && (
                    <tr>
                      <td colSpan={2} style={{ padding: '20px', textAlign: 'center', color: '#999' }}>Nenhuma empresa encontrada.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Employee Selection Modal */}
      {isEmployeeModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 3000, backdropFilter: 'blur(5px)', padding: '20px' }}>
          <div style={{ backgroundColor: 'white', width: '100%', maxWidth: '550px', borderRadius: '24px', padding: '2rem', display: 'flex', flexDirection: 'column', maxHeight: '85vh' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ margin: 0, color: '#1a237e', fontWeight: '700' }}>Selecionar Funcionário</h3>
              <button onClick={() => setIsEmployeeModalOpen(false)} style={{ background: '#f0f0f0', border: 'none', width: '35px', height: '35px', borderRadius: '50%', cursor: 'pointer' }}>✕</button>
            </div>

            <div style={{ marginBottom: '1rem', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <select
                style={{ width: '100%', padding: '12px 15px', border: '1px solid #ddd', borderRadius: '10px', fontSize: '0.9rem', outline: 'none', backgroundColor: 'white', color: '#333', cursor: 'pointer' }}
                value={departamentoSelecionado}
                onChange={e => setDepartamentoSelecionado(e.target.value)}
              >
                <option value="">Todos os Departamentos</option>
                {departamentos.map((dept, idx) => (
                  <option key={idx} value={dept.nomeDepartamento}>{dept.nomeDepartamento}</option>
                ))}
              </select>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div style={{ position: 'relative', display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '0.75rem', color: '#666', fontWeight: '600', marginBottom: '4px', marginLeft: '4px' }}>Data Início</span>
                  <input
                    type="date"
                    style={{ width: '100%', padding: '12px 15px', border: '1px solid #ddd', borderRadius: '10px', fontSize: '0.9rem', outline: 'none', backgroundColor: 'white', color: '#333' }}
                    value={dataInicio}
                    onChange={e => setDataInicio(e.target.value)}
                  />
                </div>
                <div style={{ position: 'relative', display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '0.75rem', color: '#666', fontWeight: '600', marginBottom: '4px', marginLeft: '4px' }}>Data Fim</span>
                  <input
                    type="date"
                    style={{ width: '100%', padding: '12px 15px', border: '1px solid #ddd', borderRadius: '10px', fontSize: '0.9rem', outline: 'none', backgroundColor: 'white', color: '#333' }}
                    value={dataFim}
                    onChange={e => setDataFim(e.target.value)}
                  />
                </div>
              </div>

              <button
                onClick={buscarFuncionarios}
                disabled={loadingDados}
                style={{ width: '100%', padding: '12px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '10px', fontWeight: '700', cursor: 'pointer' }}
              >
                {loadingDados ? 'Buscando...' : 'Buscar'}
              </button>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', borderRadius: '12px', border: '1px solid #eee' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <tbody>
                  {funcionarios.length > 0 ? funcionarios.map(f => (
                    <tr key={f.id} onClick={() => { setSelectedFuncionario(f); setIsEmployeeModalOpen(false); }} style={{ cursor: 'pointer', borderBottom: '1px solid #f8f8f8' }}>
                      <td style={{ padding: '15px' }}>
                        <div style={{ fontWeight: '600', color: '#1a237e' }}>{f.nome}</div>
                        <div style={{ fontSize: '0.75rem', color: '#999' }}>{f.departamento} • ID: {f.id}</div>
                      </td>
                      <td style={{ padding: '15px', textAlign: 'right', color: '#2e7d32', fontSize: '0.8rem', fontWeight: 'bold' }}>SELECIONAR</td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={2} style={{ padding: '20px', textAlign: 'center', color: '#999' }}>
                        {loadingDados ? 'Carregando...' : 'Nenhum funcionário encontrado.'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default LinkModuloForm;
