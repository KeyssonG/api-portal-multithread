import { useState } from "react";


interface HeaderProps {
    userName: string;
    onLogout: () => void;
}

const Header = ({userName, onLogout}: HeaderProps) => {
    const [showDropdown, setShowDropdown] = useState(false);

    return (
            <header>
                <h1>Dashboard</h1>

                <div>
                    <span>Olá, <strong>{userName}</strong></span>

                    <div>
                        <button onClick={() => setShowDropdown(!showDropdown)}>
                            Consultas
                        </button>

                        {showDropdown && (
                            <ul style={{
                                position: 'absolute',
                                top: '100%',
                                left: 0,
                                background: 'white',
                                border: '1px solid #ccc',
                                listStyle: 'none',
                                margin: 0,
                                padding: 0,
                                zIndex: 1000
                            }}>
                                <li>
                                    <a href="/dashboard/empresas-pendentes" style={{padding: '0.5rem 1rem', display: 'block'}}>
                                        Empresas Pendentes
                                    </a>
                                </li>
                            </ul>
                        )}
                    </div>

                    <button onClick={onLogout}>Sair</button>
                </div>
            </header>
    );
};

export default Header;

