import './App.css'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import Header from './components/header/header.jsx'
import Footer from './components/footer/footer.jsx'
import Home from './pages/homePage/homePage.jsx'
import Relojes from './pages/Relojes/Relojes.jsx'
import Naturen from './pages/ettMedNaturen/ettMedNaturen.jsx'
import LogIn from './pages/Login/LogIn.jsx'
import SignUp from './pages/SignUp/signUp.jsx'

// Creamos un componente wrapper para usar useLocation
function AppContent() {
  const location = useLocation();
  const showHeader = location.pathname !== '/login' && location.pathname !== '/signUp';
  const showFooter = location.pathname !== '/login' && location.pathname !== '/signUp';
  
  return (
    <>
      {showHeader && <Header />}
      
      <div className='app-container'>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/watches' element={<Relojes />}/> 
          <Route path='/ett-med-naturen' element={<Naturen />}/> 
          <Route path='/login' element={<LogIn />} />
          <Route path='/signUp' element={<SignUp />} />
      
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