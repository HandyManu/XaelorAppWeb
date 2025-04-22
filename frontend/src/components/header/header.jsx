import { Link, useNavigate } from 'react-router-dom'; // Cambia Navigate por useNavigate
import './header.css';
import './responsive.css';
import 'swiper/css';
import 'swiper/css/effect-fade';
import SearchBox from './searchBox/searchBox.jsx';
import HeroCarousel from './carousel/carousel.jsx'; // Asegúrate de que la ruta sea correcta


function Header() {
    const navigate = useNavigate(); // Hook para navegar programáticamente

    const handleLoginClick = () => {
        navigate('/login'); // Navega a la ruta de login
    };

    return (

        <header className="relative w-full h-screen overflow-hidden ">
            <nav className="absolute top-0 w-full z-50 bg-gradient-to-b from-black/70 to-transparent px-6 py-4 flex justify-between items-center text-white backdrop-blur-md">
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
                <SearchBox /> {/* Componente de búsqueda */}
                <button className="Login" onClick={handleLoginClick}>Iniciar Sesión</button>
            </nav>

            <HeroCarousel />

            <div className="absolute bottom-0 left-0 w-full h-32 z-20 backdrop-blur-sm bg-gradient-to-t from-black/80 to-transparent"></div>
        </header>
    );
}

export default Header;