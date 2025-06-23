import './App.css'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import Header from './components/header/header.jsx'
import Footer from './components/footer/footer.jsx'
import Home from './pages/homePage/homePage.jsx'
import Relojes from './pages/Relojes/Relojes.jsx'
import Naturen from './pages/ettMedNaturen/ettMedNaturen.jsx'
import Nautilus from './pages/Nautilus/Nautilus.jsx'
import UltimosLanzamientos from './pages/ultimosLanzamientos/latestLaunches.jsx'
import SobreNosotros from './pages/sobreNosotros/sobreNosotros.jsx'
import Terminos from './pages/terminosYcondiciones/terminos.jsx'
import Contacto from './pages/contactanos/contactanos.jsx'
import Infoproducto from './pages/Relojes/Relojes.jsx'
import LogIn from './pages/Login/LogIn.jsx'
import SignUp from './pages/SignUp/signUp.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import Navegation from './components/Navegation.jsx'
import PasswordRecovery from './pages/PasswordRecovery/passwordRecovery.jsx'
import { Toaster } from 'react-hot-toast';


// Creamos un componente wrapper para usar useLocation
function AppContent() {
  const location = useLocation();

  const showHeader = location.pathname !== '/login' && location.pathname !== '/signUp' && location.pathname !== '/contacto';
  const showFooter = location.pathname !== '/login' && location.pathname !== '/signUp' && location.pathname !== '/contacto';

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
          <Route path='/login' element={<LogIn />} />
          <Route path='/signUp' element={<SignUp />} />
          <Route path='/watchInfo/:id' element={<Infoproducto />} />
          <Route path='/recuperar' element={<PasswordRecovery />} />
        </Routes>
      </div>

      {showFooter && <Footer />}
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navegation>
          <AppContent />
        </Navegation>
      </Router>
    </AuthProvider>
  );
}

export default App;