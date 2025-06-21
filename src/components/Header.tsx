import { useState } from 'react';

import { useNavigate } from 'react-router-dom';
import styles from '../styles/Header.module.css';
import { useAuth } from '../contexts/AuthContext';

import { useDashboard } from '../contexts/DashboardContextType';

const Header = () => {
  const { name, logout } = useAuth();
  const navigate = useNavigate();
  const { setShowEmpresasPendentes } = useDashboard();

  const [showDropdown, setShowDropdown] = useState(false);

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

  const handleClickOutside = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (!target.closest(`.${styles.menuContainer}`)) {
      setShowDropdown(false);
    }
  }

  useState(() => {
    document.addEventListener('click', handleClickOutside as any);
    return () => {
      document.removeEventListener('click', handleClickOutside as any);
    }
  })

  return (
    <header className={styles.header}>
      <h1 className={styles.headerTitle}>MultiThread</h1>

      <div className={styles.menuContainer}>
        <button
          className={styles.dropdownButton}
          onClick={() => setShowDropdown(!showDropdown)}
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