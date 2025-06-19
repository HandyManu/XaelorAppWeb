import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import SideNav from "./SideNav/SideNav.jsx";
import Login from "../pages/Login/Login.jsx";
import Dashboard from "../pages/Dashboard/Dashboard.jsx";
import Relojes from "../pages/Watches/Products.jsx";
import Sucursales from "../pages/Branches/Branch.jsx";
import Marcas from "../pages/Brands/Brands.jsx";
import Clientes from "../pages/Customers/Customers.jsx";
import Inventario from "../pages/Inventory/Inventory.jsx";
import Empleados from "../pages/Employees/Employees.jsx";
import Membresias from "../pages/Memberships/Memberships.jsx";
import Ventas from "../pages/Sales/Sales.jsx";
import Resenas from "../pages/Reviews/Reviews.jsx";
import PrivateRoute from "./PrivateRoute";
import { useAuth } from "../context/AuthContext";

export default function AppRoutes() {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  const showSideNav = location.pathname !== "/";

  console.log("Navigation render:", { isAuthenticated, pathname: location.pathname, isLoading }); // Debug

  // Mientras carga la autenticación inicial, no renderizamos nada o un spinner
  if (isLoading) {
    return <div>Cargando...</div>;
  }

  return (
    <>
      {showSideNav && isAuthenticated && <SideNav />}
      <div className={`app-container ${showSideNav && isAuthenticated ? "with-sidebar" : ""}`}>
        <Routes>
          {!isAuthenticated && <Route path="/" element={<Login />} />}
          {isAuthenticated && <Route path="/" element={<Navigate to="/dashboard" replace />} />}
          <Route element={<PrivateRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/relojes" element={<Relojes />} />
            <Route path="/sucursales" element={<Sucursales />} />
            <Route path="/marcas" element={<Marcas />} />
            <Route path="/clientes" element={<Clientes />} />
            <Route path="/inventario" element={<Inventario />} />
            <Route path="/empleados" element={<Empleados />} />
            <Route path="/membresias" element={<Membresias />} />
            <Route path="/ventas" element={<Ventas />} />
            <Route path="/resenas" element={<Resenas />} />
          </Route>
        </Routes>
      </div>
    </>
  );
} 