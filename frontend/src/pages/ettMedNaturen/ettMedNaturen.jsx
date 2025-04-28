import React from 'react';
import EttMedNaturenInfo from './ettMedNaturenInfo/ettMedNaturenInfo.jsx';
import ProductosEcologicos from './productosEcologicos/productosEcologicos.jsx';
import './ettMedNaturen.css';

function showEttMedNaturen() {
  return (
    <div className="ettmednature-page-container">
      <EttMedNaturenInfo />
      <ProductosEcologicos />
    </div>
  );
}

export default showEttMedNaturen;