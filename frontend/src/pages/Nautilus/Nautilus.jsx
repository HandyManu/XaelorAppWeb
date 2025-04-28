import React from 'react';
import Nautilus from './nautilusComponent/Nautilus.jsx';
import Products from './productsComponent/products.jsx';
import './Nautilus.css';

function NautilusPage() {
  return (
    <div className="nautilus-page-container">
      <Nautilus />
      <Products />
    </div>
  );
}

export default NautilusPage;