import React from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Cambia Navigate por useNavigate
import './header.css';
import SearchBox from './searchBox/searchBox.jsx'

function showHeader() {
    const navigate = useNavigate(); // Hook para navegar programáticamente

    const handleLoginClick = () => {
        navigate('/login'); // Navega a la ruta de login
    };

    return (
        <header className="header">
            <div className="logo">
                <img src="/Logo.svg" alt="Logo" />
                <h2>Xælör</h2>
            </div>
            <nav>
                <ul>
                    <li><Link to="/">Inicio</Link></li>
                    <li><Link to="/watches">Relojes</Link></li>
                    <li><Link to="/ett-med-naturen">Ett Med Naturen</Link></li>
                    <li><Link to="/nautilus">Nautilus</Link></li>
                    <li><Link to="/last-publishes">Últimos Lanzamientos</Link></li>
                    <li><Link to="/about-us">Sobre Nosotros</Link></li>
                </ul>
            </nav>
            <SearchBox />
            <button className="Login" onClick={handleLoginClick}>Login</button>
        </header>
    );
}

export default showHeader;