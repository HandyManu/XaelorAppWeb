// SideNav.jsx
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from "../../context/AuthContext";
import './SideNav.css';

// Función para leer cookies
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
}

function SideNav() {
    const location = useLocation();
    const navigate = useNavigate();
    const { logout } = useAuth();

    // Lee el tipo de usuario de la cookie (ajusta el nombre si es diferente)
    const userType = getCookie('userType');

    // Determinamos la página activa directamente usando la ruta actual
    const isActive = (path) => {
        return location.pathname.includes(path);
    };
    
    const handleLogout = async () => {
        try {
            await logout(); // Usa el método logout del AuthContext que ya maneja la limpieza
            navigate('/');
        } catch (error) {
            console.error('Error durante logout:', error);
            // En caso de error, igual limpiamos localmente y redirigimos
            navigate('/');
        }
    };

    return (
        <div className="sidenav">
            <Link to="/dashboard" className="logo-container">
                <div className="logo">
                    <span className="logo-icon">æ</span>
                    <span className="logo-text">Xælör</span>
                </div>
            </Link>
            
            <nav className="nav-menu">
                <ul className="nav-list">
                    <li>
                        <Link 
                            to="/dashboard" 
                            className={`nav-item ${isActive('/dashboard') ? 'active' : ''}`}
                        >
                            <img 
                                src="/Home.svg"
                                alt="Home"
                                className="nav-icon"
                                style={{ width: 22, height: 22, objectFit: 'contain' }}
                            />
                            <span className="nav-text">Dashboard</span>
                        </Link>
                    </li>
                    
                    {/* Solo mostrar Sucursales y Empleados si el usuario es admin */}
                    {userType === 'admin' && (
                        <>
                            <li>
                                <Link 
                                    to="/sucursales" 
                                    className={`nav-item ${isActive('/sucursales') ? 'active' : ''}`}
                                >
                                    <img
                                        src="/store.svg"
                                        alt="Sucursales"
                                        className="nav-icon"
                                        style={{ width: 22, height: 22, objectFit: 'contain' }}
                                    />
                                    <span className="nav-text">Sucursales</span>
                                </Link>
                            </li>
                            <li>
                                <Link 
                                    to="/empleados" 
                                    className={`nav-item ${isActive('/empleados') ? 'active' : ''}`}
                                >
                                    <i className="nav-icon">👨‍💼</i>
                                    <span className="nav-text">Empleados</span>
                                </Link>
                            </li>
                        </>
                    )}

                    <li>
                        <Link 
                            to="/marcas" 
                            className={`nav-item ${isActive('/marcas') ? 'active' : ''}`}
                        >
                            <i className="nav-icon">🏷️</i>
                            <span className="nav-text">Marcas</span>
                        </Link>
                    </li>
                    
                    <li>
                        <Link 
                            to="/relojes" 
                            className={`nav-item ${isActive('/relojes') ? 'active' : ''}`}
                        >
                            <i className="nav-icon">⌚</i>
                            <span className="nav-text">Relojes</span>
                        </Link>
                    </li>
                    
                    <li>
                        <Link 
                            to="/clientes" 
                            className={`nav-item ${isActive('/clientes') ? 'active' : ''}`}
                        >
                            <i className="nav-icon">👥</i>
                            <span className="nav-text">Clientes</span>
                        </Link>
                    </li>
                    
                    <li>
                        <Link 
                            to="/inventario" 
                            className={`nav-item ${isActive('/inventario') ? 'active' : ''}`}
                        >
                            <i className="nav-icon">📦</i>
                            <span className="nav-text">Inventario</span>
                        </Link>
                    </li>
                    
                    <li>
                        <Link 
                            to="/membresias" 
                            className={`nav-item ${isActive('/membresias') ? 'active' : ''}`}
                        >
                            <i className="nav-icon vip-icon">VIP</i>
                            <span className="nav-text">Membresias</span>
                        </Link>
                    </li>
                    
                    <li>
                        <Link 
                            to="/ventas" 
                            className={`nav-item ${isActive('/ventas') ? 'active' : ''}`}
                        >
                            <i className="nav-icon">💰</i>
                            <span className="nav-text">Ventas</span>
                        </Link>
                    </li>
                    
                    <li>
                        <Link 
                            to="/resenas" 
                            className={`nav-item ${isActive('/resenas') ? 'active' : ''}`}
                        >
                            <i className="nav-icon">⭐</i>
                            <span className="nav-text">Reseñas</span>
                        </Link>
                    </li>
                </ul>
            </nav>
            
            <div className="logout-container">
                <div className="nav-item logout" onClick={handleLogout}>
                    <i className="nav-icon">📤</i>
                    <span className="nav-text">Log Out</span>
                </div>
            </div>
        </div>
    );
}

export default SideNav;