import './App.css'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import Header from './components/header/header.jsx'
import Footer from './components/footer/footer.jsx'
import Home from './pages/homePage.jsx'
import LogIn from './pages/LogIn.jsx'

// Creamos un componente wrapper para usar useLocation
function AppContent() {
  const location = useLocation();
  const showHeader = location.pathname !== '/login';
  const showFooter = location.pathname !== '/login';

  return (
    <>
      {showHeader && <Header />}
      <div className='app-container'>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<LogIn />} />
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
