// App.jsx
import './App.css';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

// Componentes
import SideNav from './components/SideNav/SideNav.jsx';
import Login from './pages/Login/Login.jsx';
import Dashboard from './pages/Dashboard/Dashboard.jsx';
import Relojes from './pages/Watches/Products.jsx';
import Sucursales from './pages/Branches/Branch.jsx';
import Marcas from './pages/Brands/Brands.jsx';
import Clientes from './pages/Customers/Customers.jsx';
//import Inventario from './pages/Inventario/Inventario.jsx';
//import Empleados from './pages/Empleados/Empleados.jsx';
//import Membresias from './pages/Membresias/Membresias.jsx';
//import Ventas from './pages/Ventas/Ventas.jsx';
//import Resenas from './pages/Resenas/Resenas.jsx';

// Componente wrapper para usar useLocation
function AppContent() {
  const location = useLocation();

  // No mostrar SideNav en login
  const showSideNav = location.pathname !== '/';

  // Verificar autenticación
  const isAuthenticated = localStorage.getItem('token');

  // Redirigir a login si no está autenticado y no está en login
  if (!isAuthenticated && location.pathname !== '/') {
    return <Route path={location.pathname} element={<Login />} />;
  }

  return (
    <>
      {showSideNav && <SideNav />}

      <div className={`app-container ${showSideNav ? 'with-sidebar' : ''}`}>
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/relojes" element={<Relojes />} />
          <Route path="/sucursales" element={<Sucursales />} />
          <Route path="/marcas" element={<Marcas />} />
          <Route path="/clientes" element={<Clientes />} />
          {/*
          
                  

          <Route path="/inventario" element={<Inventario />} />
          <Route path="/empleados" element={<Empleados />} />
          <Route path="/membresias" element={<Membresias />} />
          <Route path="/ventas" element={<Ventas />} />
          <Route path="/resenas" element={<Resenas />} />*/}
          <Route path="/" element={<Login />} />
        </Routes>
      </div>
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