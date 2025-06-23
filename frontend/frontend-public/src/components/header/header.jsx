import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './header.css';
import './responsive.css';
import 'swiper/css';
import 'swiper/css/effect-fade';
import SearchBox from './searchBox/searchBox.jsx';
import HeroCarousel from './carousel/carousel.jsx';

function Header() {
    const location = useLocation();
    const navigate = useNavigate();
    const { isAuthenticated, user, logout } = useAuth();
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        setMenuOpen(false); // Cierra el menú al cambiar de ruta
    }, [location]);

    const handleLoginClick = () => {
        navigate('/login');
    };

    const handleLogoutClick = async () => {
        try {
            await logout();
            navigate('/');
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
        }
    };

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    // Función para determinar si una ruta está activa
    const isActiveRoute = (path) => {
        if (path === '/' && location.pathname === '/') {
            return true;
        }
        if (path !== '/' && location.pathname.startsWith(path)) {
            return true;
        }
        return false;
    };

    return (
        <header className="header">
            <nav className={`nav ${menuOpen ? 'menu-open' : ''}`}>
                <div className="logo">
                    <img src="/Logo.svg" alt="Logo" />
                    <h2>Xælör</h2>
                </div>
                
                <ul className="nav-menu">
                    <li>
                        <Link 
                            to="/" 
                            onClick={() => setMenuOpen(false)}
                            className={isActiveRoute('/') ? 'active' : ''}
                        >
                            Inicio
                        </Link>
                    </li>
                    <li>
                        <Link 
                            to="/watches" 
                            onClick={() => setMenuOpen(false)}
                            className={isActiveRoute('/watches') ? 'active' : ''}
                        >
                            Relojes
                        </Link>
                    </li>
                    <li>
                        <Link 
                            to="/ett-med-naturen" 
                            onClick={() => setMenuOpen(false)}
                            className={isActiveRoute('/ett-med-naturen') ? 'active' : ''}
                        >
                            Ett Med Naturen
                        </Link>
                    </li>
                    <li>
                        <Link 
                            to="/nautilus" 
                            onClick={() => setMenuOpen(false)}
                            className={isActiveRoute('/nautilus') ? 'active' : ''}
                        >
                            Nautilus
                        </Link>
                    </li>
                    <li>
                        <Link 
                            to="/about-us" 
                            onClick={() => setMenuOpen(false)}
                            className={isActiveRoute('/about-us') ? 'active' : ''}
                        >
                            Sobre Nosotros
                        </Link>
                    </li>
                    <li>
                        <Link 
                            to="/cart" 
                            onClick={() => setMenuOpen(false)}
                            className={isActiveRoute('/cart') ? 'active' : ''}
                        >
                            Carrito
                        </Link>
                    </li>
                </ul>
                
                <div className='divisor'>
                    <SearchBox />
                    
                    {isAuthenticated ? (
                        // Mostrar información del usuario y botón de logout
                        <>
                            <div className="user-info">
                                {user?.email}
                            </div>
                            <button className="Login logout-btn" onClick={handleLogoutClick}>
                                Cerrar Sesión
                            </button>
                        </>
                    ) : (
                        // Mostrar botón de login si no está autenticado
                        <button className="Login" onClick={handleLoginClick}>
                            Iniciar Sesión
                        </button>
                    )}
                    
                    <button className="menu-toggle" onClick={toggleMenu} aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}>
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