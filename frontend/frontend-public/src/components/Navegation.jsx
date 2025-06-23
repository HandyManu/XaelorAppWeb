import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { useAuth } from '../context/AuthContext';
import Header from '../components/header/header.jsx';
import Footer from '../components/footer/footer.jsx';
import Home from '../pages/homePage/homePage.jsx';
import Relojes from '../pages/Relojes/Relojes.jsx';
import Naturen from '../pages/ettMedNaturen/ettMedNaturen.jsx';
import Nautilus from '../pages/Nautilus/Nautilus.jsx';
import UltimosLanzamientos from '../pages/ultimosLanzamientos/latestLaunches.jsx';
import SobreNosotros from '../pages/sobreNosotros/sobreNosotros.jsx';
import Terminos from '../pages/terminosYcondiciones/terminos.jsx';
import Contacto from '../pages/contactanos/contactanos.jsx';
import ProductDetail from '../pages/ProductDetail/ProductDetail.jsx';
import LogIn from '../pages/Login/LogIn.jsx';
import SignUp from '../pages/SignUp/signUp.jsx';
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

export default function Navegation() {
    const location = useLocation();

    const showHeader = location.pathname !== '/login' && location.pathname !== '/signUp' && location.pathname !== '/contacto' && location.pathname !== '/recuperar';
    const showFooter = location.pathname !== '/login' && location.pathname !== '/signUp' && location.pathname !== '/contacto' && location.pathname !== '/recuperar';

    return (
        <>
            <Toaster position="top-right" /> {/* <-- Agrega esto aquí */}
            {showHeader && <Header />}

            <div className='app-container'>
                <Routes>
                    <Route path='/' element={<Home />} />
                    <Route path='/watches' element={<Relojes />} />
                    <Route path='/ett-med-naturen' element={<Naturen />} />
                    <Route path='/nautilus' element={<Nautilus />} />
                    <Route path='/last-publishes' element={<UltimosLanzamientos />} />
                    <Route path='/about-us' element={<SobreNosotros />} />
                    <Route path='/contacto' element={<Contacto />} />
                    <Route path='/terminos-condiciones' element={<Terminos />} />
                    <Route path='/recuperar' element={<PasswordRecovery />} />
                    <Route path='/carrito' element={<Cart />} />

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
                </Routes>
            </div>

            {showFooter && <Footer />}
        </>
    );
}