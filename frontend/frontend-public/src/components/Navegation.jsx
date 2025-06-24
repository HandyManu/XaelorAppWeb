import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { useAuth } from '../context/AuthContext';
import Header from '../components/header/header.jsx';
import Footer from '../components/footer/footer.jsx';
import Home from '../pages/homePage/homePage.jsx';
import Relojes from '../pages/Relojes/Relojes.jsx';
import Naturen from '../pages/ettMedNaturen/ettMedNaturen.jsx';
import Nautilus from '../pages/Nautilus/Nautilus.jsx';
import SobreNosotros from '../pages/sobreNosotros/sobreNosotros.jsx';
import Terminos from '../pages/terminosYcondiciones/terminos.jsx';
import Contacto from '../pages/contactanos/contactanos.jsx';
import ProductDetail from '../pages/ProductDetail/ProductDetail.jsx';
import LogIn from '../pages/Login/LogIn.jsx';
import SignUp from '../pages/SignUp/signUp.jsx';
import SalesPage from '../pages/Sales/Sales.jsx';
import PasswordRecovery from '../pages/PasswordRecovery/passwordRecovery.jsx';
import Cart from '../pages/Cart/Cart.jsx';
import { Toaster } from 'react-hot-toast';

// Componente para proteger las rutas de login y signup
function ProtectedAuthRoute({ children }) {
    const { isAuthenticated, isLoading } = useAuth();

    // Mientras carga, mostrar loading
    if (isLoading) {
        return <div>Cargando...</div>;
    }

    // Si ya está autenticado, redirigir al home
    if (isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    // Si no está autenticado, mostrar el componente
    return children;
}

// Componente para proteger rutas que requieren autenticación
function ProtectedRoute({ children }) {
    const { isAuthenticated, isLoading } = useAuth();

    // Mientras carga, mostrar loading
    if (isLoading) {
        return (
            <div className="loading-container" style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '50vh',
                flexDirection: 'column'
            }}>
                <div className="spinner" style={{
                    width: '40px',
                    height: '40px',
                    border: '4px solid #f3f3f3',
                    borderTop: '4px solid #3498db',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                }}></div>
                <p style={{ marginTop: '10px' }}>Verificando sesión...</p>
            </div>
        );
    }

    // Si no está autenticado, redirigir al login
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // Si está autenticado, mostrar el componente
    return children;
}

export default function Navegation() {
    const location = useLocation();

    const showHeader = location.pathname !== '/login' && location.pathname !== '/signUp' && location.pathname !== '/contacto' && location.pathname !== '/recuperar';
    const showFooter = location.pathname !== '/login' && location.pathname !== '/signUp' && location.pathname !== '/contacto' && location.pathname !== '/recuperar';

    return (
        <>
            <Toaster position="top-right" />
            {showHeader && <Header />}

            <div className='app-container'>
                <Routes>
                    <Route path='/' element={<Home />} />
                    <Route path='/watches' element={<Relojes />} />
                    <Route path='/ett-med-naturen' element={<Naturen />} />
                    <Route path='/nautilus' element={<Nautilus />} />
                    <Route path='/about-us' element={<SobreNosotros />} />
                    <Route path='/contacto' element={<Contacto />} />
                    <Route path='/terminos-condiciones' element={<Terminos />} />
                    <Route path='/recuperar' element={<PasswordRecovery />} />
                    
                    {/* Carrito - también debería estar protegido */}
                    <Route path='/carrito' element={
                        <ProtectedRoute>
                            <Cart />
                        </ProtectedRoute>
                    } />

                    {/* Rutas de autenticación - solo para usuarios no autenticados */}
                    <Route path='/login' element={
                        <ProtectedAuthRoute>
                            <LogIn />
                        </ProtectedAuthRoute>
                    } />
                    <Route path='/signUp' element={
                        <ProtectedAuthRoute>
                            <SignUp />
                        </ProtectedAuthRoute>
                    } />
                    
                    <Route path='/watchInfo/:id' element={<ProductDetail />} />

                    {/* Historial de Compras - PROTEGIDA para usuarios autenticados */}
                    <Route path='/sales' element={
                        <ProtectedRoute>
                            <SalesPage />
                        </ProtectedRoute>
                    } />
                </Routes>
            </div>

            {showFooter && <Footer />}
            
            {/* CSS para la animación del spinner */}
            <style>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
        </>
    );
}