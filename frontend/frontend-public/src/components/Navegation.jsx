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
import LogIn from '../pages/Login/LogIn.jsx';
import SignUp from '../pages/SignUp/signUp.jsx';
import Cart from '../pages/Cart/Cart.jsx'; // Asegúrate de tener este componente

// Componente para proteger la ruta de login
function ProtectedLoginRoute({ children }) {
    const { isAuthenticated, isLoading } = useAuth();

    // Mientras carga, no hacer nada
    if (isLoading) {
        return <div>Cargando...</div>;
    }

    // Si ya está autenticado, redirigir al home
    if (isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    // Si no está autenticado, mostrar el login
    return children;
}

export default function Navegation() {
    const location = useLocation();

    const showHeader = location.pathname !== '/login' && location.pathname !== '/signUp' && location.pathname !== '/contacto';
    const showFooter = location.pathname !== '/login' && location.pathname !== '/signUp' && location.pathname !== '/contacto';

    return (
        <>
            {showHeader && <Header />}

            <div className='app-container'>
                <Routes>
                    <Route path='/' element={<Home />} />
                    <Route path='/watches' element={<Relojes />} />
                    <Route path='/ett-med-naturen' element={<Naturen />} />
                    <Route path='/nautilus' element={<Nautilus />} />
                    <Route path='/about-us' element={<SobreNosotros />} />
                    <Route path='/cart' element={<Cart />} /> {/* Nueva ruta */}
                    <Route path='/contacto' element={<Contacto />} />
                    <Route path='/terminos-condiciones' element={<Terminos />} />
                    <Route path='/login' element={
                        <ProtectedLoginRoute>
                            <LogIn />
                        </ProtectedLoginRoute>
                    } />
                    <Route path='/signUp' element={<SignUp />} />
                </Routes>
            </div>

            {showFooter && <Footer />}
        </>
    );
}

