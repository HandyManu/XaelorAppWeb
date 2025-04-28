import React from 'react';
import CategoriasRelojes from './categoriasRelojes/categoriasRelojes.jsx';
import MasVendidos from './masVendidos/masVendidos.jsx';
import './Relojes.css'; // Nuevo archivo CSS para el contenedor principal

function showWatches() {
  return (
    <div className="relojes-page-container">
      <CategoriasRelojes />
      <MasVendidos />
    </div>
  );
}

export default showWatches;