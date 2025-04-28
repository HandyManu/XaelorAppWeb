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
import LogIn from './pages/Login/LogIn.jsx'
import SignUp from './pages/SignUp/signUp.jsx'
import GmailVerify from './pages/forgotPassword/gmailVerify.jsx'
import InsertCode from './pages/forgotPassword/insertCode.jsx'
import ChangePassword from './pages/forgotPassword/changePassword.jsx'  

// Creamos un componente wrapper para usar useLocation
function AppContent() {
  const location = useLocation();
 
  const showHeader = location.pathname !== '/login' && location.pathname !== '/signUp' && location.pathname !== '/gmailVerify'  && location.pathname !== '/insertCode' && location.pathname !== '/changePassword' && location.pathname !== '/contacto' ;
  const showFooter = location.pathname !== '/login' && location.pathname !== '/signUp' && location.pathname !== '/gmailVerify' && location.pathname !== '/insertCode' && location.pathname !== '/changePassword' && location.pathname !== '/contacto' ;
  
  return (
    <>
      {showHeader && <Header />}
      
      <div className='app-container'>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/watches' element={<Relojes />}/> 
          <Route path='/ett-med-naturen' element={<Naturen />}/> 
          <Route path='/nautilus' element={<Nautilus />}/> 
          <Route path='/last-publishes' element={<UltimosLanzamientos />}/> 
          <Route path='/about-us' element={<SobreNosotros />}/> 
          <Route path='/contacto' element={<Contacto />}/> 
          <Route path='/terminos-condiciones' element={<Terminos />}/> 
          <Route path='/login' element={<LogIn />} />
          <Route path='/signUp' element={<SignUp />} />
          <Route path='/gmailVerify' element={<GmailVerify />} />
          <Route path='/insertCode' element={<InsertCode />} />
          <Route path='/changePassword' element={<ChangePassword />} />

          

          </Routes>
      </div>

      {showFooter && <Footer />}
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;