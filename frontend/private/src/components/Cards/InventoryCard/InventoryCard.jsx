// InventoryCard.jsx - Actualizado para manejar imágenes de Cloudinary
import React, { useState } from 'react';
import './InventoryCard.css';

const InventoryCard = ({ data, watchInfo, branchInfo, onEdit, onDelete, isLoading }) => {
  const [showDeleteIcon, setShowDeleteIcon] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  // Función para procesar URL de Cloudinary
  const getCloudinaryUrl = (photo) => {
    if (!photo) return null;
    
    // Si ya es una URL completa, la devolvemos
    if (typeof photo === 'string' && photo.includes('res.cloudinary.com')) {
      return photo;
    }
    
    // Si es un objeto con url
    if (typeof photo === 'object' && photo.url) {
      if (photo.url.includes('res.cloudinary.com')) {
        return photo.url;
      }
    }
    
    // Si es solo el public_id, construir la URL
    const CLOUD_NAME = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME || 'demo';
    const publicId = typeof photo === 'string' ? photo : (photo.url || photo);
    
    return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/w_400,h_300,c_fill,f_auto,q_auto/${publicId}`;
  };
  
  const handleClick = () => {
    if (onEdit && !isLoading) {
      onEdit(data);
    }
  };
  
  const handleDelete = (e) => {
    e.stopPropagation();
    if (onDelete && !isLoading) {
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
  
  // Obtener la URL de la primera imagen del reloj
  const getWatchImageUrl = () => {
    if (!watchInfo?.photos || watchInfo.photos.length === 0) {
      return null;
    }
    
    return getCloudinaryUrl(watchInfo.photos[0]);
  };
  
  const watchImageUrl = getWatchImageUrl();
  
  const handleImageError = () => {
    console.error('Error cargando imagen de inventario:', watchImageUrl);
    setImageError(true);
  };
  
  return (
    <div 
      className={`inventory-card ${isLoading ? 'loading' : ''}`}
      onClick={handleClick}
      onMouseEnter={() => setShowDeleteIcon(true)}
      onMouseLeave={() => setShowDeleteIcon(false)}
    >
      <div className="inventory-watch-image">
        {watchImageUrl && !imageError ? (
          <img 
            src={watchImageUrl} 
            alt={watchInfo?.model || 'Reloj'} 
            onError={handleImageError}
          />
        ) : (
          <div className="no-image">
            {imageError ? 'Error al cargar imagen' : 'Sin imagen'}
          </div>
        )}
      </div>
      
      <div className="inventory-info">
        <div className="watch-model">{watchInfo?.model || 'Modelo desconocido'}</div>
        
        <div className="branch-name">
          <i className="branch-icon">📍</i> 
          {branchInfo?.branch_name || branchInfo?.address || 'Sucursal desconocida'}
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
      
      {showDeleteIcon && !isLoading && (
        <div className="delete-icon" onClick={handleDelete}>
          🗑️
        </div>
      )}
    </div>
  );
};

export default InventoryCard;