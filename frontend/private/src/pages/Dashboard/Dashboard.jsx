// Dashboard.jsx
import React from 'react';
import SideNav from '../../components/SideNav/SideNav';
import './Dashboard.css';

const Dashboard = () => {
  return (
    <div className="dashboard">
      <SideNav activePage="Dashboard" />
      <div className="dashboard-content">
        <div className="dashboard-welcome">
          <h1>Dashboard</h1>
          <p>Bienvenido al panel de administración de Xælör</p>
          <p>Selecciona una opción del menú lateral para comenzar.</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;