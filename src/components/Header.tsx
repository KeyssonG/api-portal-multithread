import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useDashboard } from '../contexts/DashboardContextType';
import { 
  Navbar, 
  NavbarBrand, 
  NavbarCollapse, 
  NavbarLink, 
  NavbarToggle,
  Dropdown,
  DropdownHeader,
  DropdownItem,
  DropdownDivider,
  Avatar 
} from 'flowbite-react';

const Header = () => {
  const { name, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;
  const { setEmpresaSelecionada, setShowEmpresasPendentes, setShowModulos } = useDashboard();

  const isRouteActive = (path: string) => {
    if (path === '/dashboard' && currentPath === '/') return true;
    return currentPath.startsWith(path);
  };

  const getNavTextClass = (path: string) => {
    return `cursor-pointer text-base py-2 relative group transition-colors block ${isRouteActive(path) ? 'text-white font-semibold' : 'text-gray-300 hover:text-white md:hover:text-blue-400'}`;
  };

  const getNavUnderlineClass = (path: string) => {
    return `absolute inset-x-0 -bottom-1 h-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 origin-left transition-transform duration-300 ease-out ${isRouteActive(path) ? 'scale-x-100' : 'transform scale-x-0 group-hover:scale-x-100'}`;
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleVerConsultas = () => {
    setShowEmpresasPendentes(true);
    setShowModulos(false);
    navigate('/consultas');
  };

  const handleVerModulos = () => {
    setShowModulos(true);
    setShowEmpresasPendentes(false);
    navigate('/modulos');
  };

  const handleLogoClick = () => {
    setEmpresaSelecionada(null);
    setShowEmpresasPendentes(false);
    setShowModulos(false);
    navigate('/dashboard');
  };

  return (
    <>
    <style>{`
      div[data-testid="flowbite-tooltip"], div[data-testid="flowbite-dropdown"] {
        background-color: #000 !important;
        border: 1px solid #1f2937 !important;
      }
      div[data-testid="flowbite-dropdown"] > ul {
        background-color: #000 !important;
      }
    `}</style>
    <Navbar fluid rounded={false} className="!bg-black fixed top-0 left-0 right-0 z-50 py-3 px-4 sm:px-8 shadow-lg shadow-black/20 border-b border-gray-800 transition-all duration-300" style={{ backgroundColor: '#000' }}>
      <NavbarBrand onClick={handleLogoClick} className="cursor-pointer group flex items-center gap-2">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-500 text-white shadow-lg shadow-blue-500/20 group-hover:scale-105 group-hover:shadow-blue-500/40 transition-all duration-300 relative overflow-hidden">
          <div className="absolute inset-0 bg-white/20 group-hover:bg-transparent transition-colors duration-300"></div>
          <svg className="w-4 h-4 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <span className="self-center whitespace-nowrap text-xl font-extrabold text-white tracking-tight">
          Multi<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Thread</span>
        </span>
      </NavbarBrand>
      
      <div className="flex md:order-2 items-center gap-4">
        <Dropdown
          arrowIcon={false}
          inline
          label={
            <div className="flex items-center gap-2 cursor-pointer p-1 pr-3 rounded-full hover:bg-gray-900 transition-all duration-300 border border-gray-800 shadow-sm bg-black group">
              <Avatar 
                placeholderInitials={name?.substring(0, 1).toUpperCase() || "U"} 
                rounded 
                size="sm"
                className="ring-2 ring-gray-800 group-hover:ring-blue-500/50 transition-colors shadow-sm"
              />
              <span className="text-sm font-semibold text-gray-200 hidden sm:block">
                Olá, {name?.split(' ')[0] || 'Usuário'}
              </span>
            </div>
          }
        >
          <DropdownHeader className="px-4 py-3 bg-black border-b border-gray-800 rounded-t-lg">
            <span className="block text-sm font-bold text-white">{name || 'Usuário'}</span>
          </DropdownHeader>
          <DropdownItem onClick={() => navigate('/dashboard')} className="bg-black text-gray-200 hover:bg-gray-800 hover:text-white font-medium transition-colors py-2.5">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
              Painel Geral
            </div>
          </DropdownItem>
          <DropdownDivider className="my-0 border-gray-800" />
          <DropdownItem onClick={handleLogout} className="bg-black text-red-500 font-bold hover:bg-gray-800 hover:text-red-400 transition-colors py-2.5 rounded-b-lg">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
              Encerrar Sessão
            </div>
          </DropdownItem>
        </Dropdown>
        <NavbarToggle className="text-gray-400 hover:bg-gray-800 focus:ring-gray-700 border-none transition-colors" />
      </div>

      <NavbarCollapse>
        <div className="flex flex-col md:flex-row md:items-center md:gap-8 mt-4 md:mt-0 font-medium">
          <NavbarLink 
            onClick={handleLogoClick} 
            className={getNavTextClass('/dashboard')}
          >
            <span>Home</span>
            <span className={getNavUnderlineClass('/dashboard')}></span>
          </NavbarLink>
          <NavbarLink 
            onClick={handleVerConsultas} 
            className={getNavTextClass('/consultas')}
          >
            <span>Consultas</span>
            <span className={getNavUnderlineClass('/consultas')}></span>
          </NavbarLink>
          <NavbarLink 
            onClick={handleVerModulos} 
            className={getNavTextClass('/modulos')}
          >
            <span>Gestão de Módulos</span>
            <span className={getNavUnderlineClass('/modulos')}></span>
          </NavbarLink>
        </div>
      </NavbarCollapse>
    </Navbar>
    </>
  );
};

export default Header;
