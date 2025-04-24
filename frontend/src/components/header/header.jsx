import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './header.css';
import './responsive.css';
import 'swiper/css';
import 'swiper/css/effect-fade';
import SearchBox from './searchBox/searchBox.jsx';
import HeroCarousel from './carousel/carousel.jsx';

function Header() {
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);

    const handleLoginClick = () => {
        navigate('/login');
    };

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    return (
        <header className="header">
            <nav className={`nav ${menuOpen ? 'menu-open' : ''}`}>
                <div className="logo">
                    <img src="/Logo.svg" alt="Logo" />
                    <h2>Xælör</h2>
                </div>
                
                <ul className="nav-menu">
                    <li><Link to="/" onClick={() => setMenuOpen(false)}>Inicio</Link></li>
                    <li><Link to="/watches" onClick={() => setMenuOpen(false)}>Relojes</Link></li>
                    <li><Link to="/ett-med-naturen" onClick={() => setMenuOpen(false)}>Ett Med Naturen</Link></li>
                    <li><Link to="/nautilus" onClick={() => setMenuOpen(false)}>Nautilus</Link></li>
                    <li><Link to="/last-publishes" onClick={() => setMenuOpen(false)}>Últimos Lanzamientos</Link></li>
                    <li><Link to="/about-us" onClick={() => setMenuOpen(false)}>Sobre Nosotros</Link></li>
                </ul>
                
                <div className='divisor'>
                    <SearchBox />
                    <button className="Login" onClick={handleLoginClick}>Iniciar Sesión</button>
                    <button className="menu-toggle" onClick={toggleMenu} aria-label="Menú">
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>
                </div>
            </nav>

            <HeroCarousel />

            <div className="footer-gradient"></div>
        </header>
    );
}

export default Header;