// App.jsx
import './App.css';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

// Components
import SideNav from './components/SideNav/SideNav.jsx';
import Login from './pages/Login/Login.jsx';
import Dashboard from './pages/Dashboard/Dashboard.jsx';
import Watches from './pages/Watches/Products.jsx';
import Branches from './pages/Branches/Branch.jsx';
import Brands from './pages/Brands/Brands.jsx';
import Customers from './pages/Customers/Customers.jsx';
import Inventory from './pages/Inventory/Inventory.jsx';
import Employees from './pages/Employees/Employees.jsx';
import Memberships from './pages/Memberships/Memberships.jsx';
import Sales from './pages/Sales/Sales.jsx';
import Reviews from './pages/Reviews/Reviews.jsx';

// Wrapper component to use useLocation
function AppContent() {
  const location = useLocation();

  // Do not show SideNav on login
  const showSideNav = location.pathname !== '/';

  // Check authentication
  const isAuthenticated = localStorage.getItem('token');

  // Redirect to login if not authenticated
  if (!isAuthenticated && location.pathname !== '/') {
    return <Route path={location.pathname} element={<Login />} />;
  }

  return (
    <>
      {showSideNav && <SideNav />}

      <div className={`app-container ${showSideNav ? 'with-sidebar' : ''}`}>
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/watches" element={<Watches />} />
          <Route path="/branches" element={<Branches />} />
          <Route path="/brands" element={<Brands />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/employees" element={<Employees />} />
          <Route path="/memberships" element={<Memberships />} />
          <Route path="/sales" element={<Sales />} />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/" element={<Login />} />
        </Routes>
      </div>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navegation />
      </Router>
    </AuthProvider>
  );
}

export default App;