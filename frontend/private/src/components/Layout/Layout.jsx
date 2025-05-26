// Layout.jsx
import React from 'react';
import SideNav from './SideNav';
import './Layout.css';

// Este componente sirve como un layout compartido para todas las páginas que requieren la barra lateral
const Layout = ({ children, title }) => {
  return (
    <div className="layout">
      <SideNav />
      <div className="layout-content">
        {children}
      </div>
    </div>
  );
};

export default Layout;