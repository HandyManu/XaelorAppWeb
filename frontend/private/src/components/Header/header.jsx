// Header.jsx
import React, { useState } from 'react';
import './Header.css';

const Header = ({ title = 'Relojes', onAddNew, onRefresh }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [sortBy, setSortBy] = useState('Nombre');
  
  const handleSortSelect = (option) => {
    setSortBy(option);
    setShowDropdown(false);
  };
  
  return (
    <div className="header">
      <div className="header-title">
        <h1>{title}</h1>
      </div>
      
      <div className="header-actions">
        <div className="sort-container">
          <label>Ordenar por</label>
          <div className="sort-dropdown-container">
            <div 
              className="sort-dropdown-toggle"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <span>{sortBy}</span>
              <span className="dropdown-arrow">▼</span>
            </div>
            
            {showDropdown && (
              <div className="sort-dropdown-menu">
                <div className="sort-option" onClick={() => handleSortSelect('Nombre')}>
                  Nombre
                </div>
                <div className="sort-option" onClick={() => handleSortSelect('Precio')}>
                  Precio
                </div>
                <div className="sort-option" onClick={() => handleSortSelect('Categoría')}>
                  Categoría
                </div>
                <div className="sort-option" onClick={() => handleSortSelect('Fecha')}>
                  Fecha de agregación
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="search-container">
          <input type="text" className="search-input" placeholder="Buscar..." />
        </div>
        
        <div className="header-buttons">
          <button className="btn btn-primary" onClick={onAddNew}>
            <span className="btn-icon">+</span>
            <span className="btn-text">Nuevo reloj</span>
          </button>
          
          <button className="btn btn-secondary" onClick={onRefresh}>
            <span className="btn-text">Refresh</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Header;