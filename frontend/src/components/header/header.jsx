import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Cambia Navigate por useNavigate
import './header.css';
import SearchBox from './searchBox/searchBox.jsx'


function Header() {
    const navigate = useNavigate(); // Hook para navegar programáticamente

    useEffect(() => {
        // Cargar scripts externos
        const scriptJQuery = document.createElement('script');
        scriptJQuery.src = 'https://code.jquery.com/jquery-3.6.0.min.js';
        scriptJQuery.async = true;
        document.body.appendChild(scriptJQuery);

        const scriptSwiper = document.createElement('script');
        scriptSwiper.src = 'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js';
        scriptSwiper.async = true;
        document.body.appendChild(scriptSwiper);

        const scriptLocal = document.createElement('script');
        scriptLocal.src = './header.js';
        scriptLocal.defer = true;
        document.body.appendChild(scriptLocal);

        // Limpieza al desmontar el componente
        return () => {
            document.body.removeChild(scriptJQuery);
            document.body.removeChild(scriptSwiper);
            document.body.removeChild(scriptLocal);
        };
    }, []);

    const handleLoginClick = () => {
        navigate('/login'); // Navega a la ruta de login
    };

    return (
        <header className="header">
            <nav>
                <div className="logo">
                    <img src="/Logo.svg" alt="Logo" />
                    <h2>Xælör</h2>
                </div>

                <ul>
                    <li><Link to="/">Inicio</Link></li>
                    <li><Link to="/watches">Relojes</Link></li>
                    <li><Link to="/ett-med-naturen">Ett Med Naturen</Link></li>
                    <li><Link to="/nautilus">Nautilus</Link></li>
                    <li><Link to="/last-publishes">Últimos Lanzamientos</Link></li>
                    <li><Link to="/about-us">Sobre Nosotros</Link></li>
                </ul>

                <SearchBox />
                <button className="Login" onClick={handleLoginClick}>Login</button>
            </nav>

        </header>
    );
}

export default Header;