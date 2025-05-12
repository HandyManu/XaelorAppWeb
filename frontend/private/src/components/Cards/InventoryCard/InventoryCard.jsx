// InventoryCard.jsx
import React, { useState } from 'react';
import './InventoryCard.css';

const InventoryCard = ({ data, watchInfo, branchInfo, onEdit, onDelete }) => {
  const [showDeleteIcon, setShowDeleteIcon] = useState(false);
  
  const handleClick = () => {
    if (onEdit) {
      onEdit(data);
    }
  };
  
  const handleDelete = (e) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(data._id);
    }
  };
  
  // Determinar el estado del stock (bajo, medio, alto)
  const getStockStatus = (stock) => {
    if (stock <= 20) return 'low';
    if (stock <= 50) return 'medium';
    return 'high';
  };
  
  const stockStatus = getStockStatus(data.stock);
  
  return (
    <div 
      className="inventory-card"
      onClick={handleClick}
      onMouseEnter={() => setShowDeleteIcon(true)}
      onMouseLeave={() => setShowDeleteIcon(false)}
    >
      <div className="inventory-watch-image">
        {watchInfo?.photos && watchInfo.photos.length > 0 ? (
          <img src={watchInfo.photos[0].url} alt={watchInfo.model} />
        ) : (
          <div className="no-image">Sin imagen</div>
        )}
      </div>
      
      <div className="inventory-info">
        <div className="watch-model">{watchInfo?.model || 'Modelo desconocido'}</div>
        
        <div className="branch-name">
          <i className="branch-icon">📍</i> {branchInfo?.address || 'Sucursal desconocida'}
        </div>
        
        <div className="stock-info">
          <span className="stock-label">Stock:</span>
          <span className={`stock-value ${stockStatus}`}>
            {data.stock} unidades
          </span>
        </div>
        
        <div className={`stock-indicator ${stockStatus}`}>
          <div className="stock-bar">
            <div 
              className="stock-fill" 
              style={{ width: `${Math.min(data.stock, 100)}%` }}
            />
          </div>
        </div>
        
        {watchInfo && (
          <div className="watch-details">
            <div className="watch-price">${watchInfo.price?.toLocaleString() || '0'}</div>
            <div className="watch-category">{watchInfo.category}</div>
          </div>
        )}
      </div>
      
      {showDeleteIcon && (
        <div className="delete-icon" onClick={handleDelete}>
          🗑️
        </div>
      )}
    </div>
  );
};

export default InventoryCard;