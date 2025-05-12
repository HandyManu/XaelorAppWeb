// Header.jsx
import React, { useState } from 'react';
import './Header.css';

const Header = ({ 
  title = 'Relojes', 
  onAddNew, 
  onRefresh,
  sortOptions,
  onSort,
  showSearch = true,
  showAddButton = true // Nueva prop para controlar visibilidad del botón añadir
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [sortBy, setSortBy] = useState('Nombre');
  
  const defaultSortOptions = [
    { label: 'Nombre', value: 'nombre' },
    { label: 'Precio', value: 'precio' },
    { label: 'Categoría', value: 'categoria' },
    { label: 'Fecha de agregación', value: 'fecha' }
  ];
  
  const finalSortOptions = sortOptions || defaultSortOptions;
  
  const handleSortSelect = (option) => {
    setSortBy(option.label);
    setShowDropdown(false);
    
    if (onSort) {
      onSort(option.value);
    }
  };
  
  // Determinar texto del botón basado en el título
  const getAddButtonText = () => {
    switch(title.toLowerCase()) {
      case 'clientes':
        return 'Nuevo cliente';
      case 'relojes':
        return 'Nuevo reloj';
      default:
        return `Nuevo ${title.toLowerCase()}`;
    }
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
                {finalSortOptions.map((option, index) => (
                  <div 
                    key={index} 
                    className="sort-option" 
                    onClick={() => handleSortSelect(option)}
                  >
                    {option.label}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        {showSearch && (
          <div className="search-container">
            <input type="text" className="search-input" placeholder="Buscar..." />
          </div>
        )}
        
        <div className="header-buttons">
          {showAddButton && (
            <button className="btn btn-primary" onClick={onAddNew}>
              <span className="btn-icon">+</span>
              <span className="btn-text">{getAddButtonText()}</span>
            </button>
          )}
          
          <button className="btn btn-secondary" onClick={onRefresh}>
            <span className="btn-text">Refresh</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Header;