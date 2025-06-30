import { useState, useEffect, useRef } from 'react';

import { useNavigate } from 'react-router-dom';
import styles from '../styles/Header.module.css';
import { useAuth } from '../contexts/AuthContext';

import { useDashboard } from '../contexts/DashboardContextType';

const Header = () => {
  const { name, logout } = useAuth();
  const navigate = useNavigate();
  const { setEmpresaSelecionada, setShowEmpresasPendentes } = useDashboard();

  const [showDropdown, setShowDropdown] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setShowDropdown(false);
  };

  const handleVerEmpresasPendentes = () => {
    setShowEmpresasPendentes(true);
    setShowDropdown(false);
    navigate('/dashboard');
  };

  const handleLogoClick = () => {
    setEmpresaSelecionada(null);
    setShowEmpresasPendentes(false);
    navigate('/dashboard');
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className={styles.header}>
      <h1 className={styles.headerTitle} onClick={handleLogoClick} style={{ cursor: 'pointer' }}>MultiThread</h1>
      <div className={styles.menuContainer} ref={menuRef}>
        <button
          className={styles.dropdownButton}
          onClick={() => setShowDropdown((prev) => !prev)}
        >
          Consultas ▼
        </button>
        {showDropdown && (
          <ul className={styles.dropdownMenu}>
            <li>
              <button
                className={styles.dropdownItem}
                onClick={handleVerEmpresasPendentes}
                type="button"
              >
                <span role="img" aria-label="empresas" style={{ marginRight: 8 }}>🏢</span>
                Empresas Pendentes
              </button>
            </li>
          </ul>
        )}
      </div>

      <div className={styles.userActions}>
        <span className={styles.userName}>
          Olá, <strong>{name || 'Usuário'}</strong>
        </span>
        <button className={styles.logoutButton} onClick={handleLogout}>
          Sair
        </button>
      </div>
    </header>
  );
};

export default Header;