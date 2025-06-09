import React from 'react';
import styles from '../styles/Header.module.css';

interface HeaderProps {
  userName: string;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ userName, onLogout }) => {
  const [showDropdown, setShowDropdown] = React.useState(false);

  return (
    <header className={styles.header}>
      {/* Logo / Título à esquerda */}
      <h1 className={styles.headerTitle}>MultiThread</h1>

      {/* Menu centralizado */}
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
              <a href="/dashboard/empresas-pendentes">Empresas Pendentes</a>
            </li>
          </ul>
        )}
      </div>

      {/* Nome do usuário e logout à direita */}
      <div className={styles.userActions}>
        <span className={styles.userName}>Olá, <strong>{userName}</strong></span>
        <button className={styles.logoutButton} onClick={onLogout}>
          Sair
        </button>
      </div>
    </header>
  );
};

export default Header;