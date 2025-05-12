// ReviewCard.jsx
import React, { useState } from 'react';
import './ReviewsCard.css';

const ReviewCard = ({ 
  data, 
  watchInfo, 
  customerInfo, 
  onEdit, 
  onDelete 
}) => {
  const [showDeleteIcon, setShowDeleteIcon] = useState(false);
  
  const handleClick = () => {
    // No hacer nada al hacer click - solo vista informativa
    return;
  };
  
  const handleDelete = (e) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(data._id.$oid);
    }
  };
  
  // Formatear fecha
  const formatDate = (dateString) => {
    if (!dateString) return 'Sin fecha';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  // Renderizar estrellas
  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i}>{i < rating ? '⭐' : '☆'}</span>
    ));
  };
  
  // Calcular el ancho del indicador de rating
  const getRatingWidth = () => {
    return `${(data.rating / 5) * 100}%`;
  };
  
  return (
    <div 
      className="review-card"
      onClick={handleClick}
      onMouseEnter={() => setShowDeleteIcon(true)}
      onMouseLeave={() => setShowDeleteIcon(false)}
    >
      <div className="rating-indicator" style={{ width: getRatingWidth() }} />
      
      <div className="review-header">
        <div className="product-info">
          <img 
            src={watchInfo?.image || 'https://via.placeholder.com/50'} 
            alt={watchInfo?.model || 'Product'}
            className="product-image"
          />
          <div className="product-details">
            <div className="product-model">
              {watchInfo?.model || 'Producto'}
            </div>
            <div className="review-date">
              {formatDate(data.date?.$date)}
            </div>
          </div>
        </div>
        
        <div className="rating-badge">
          <span className="rating-value">{data.rating}</span>
          <div className="rating-stars">
            {renderStars(data.rating)}
          </div>
        </div>
      </div>
      
      <div className="review-body">
        <div className="customer-section">
          <div className="section-title">Cliente</div>
          <div className="customer-details">
            <div className="customer-name">
              {customerInfo?.name || 'Cliente anónimo'}
            </div>
            <div className="customer-email">
              {customerInfo?.email}
            </div>
          </div>
        </div>
        
        <div className="message-section">
          <div className="section-title">Reseña</div>
          <div className="review-message">
            "{data.message}"
          </div>
        </div>
      </div>
      
      {showDeleteIcon && (
        <div className="delete-icon" onClick={handleDelete}>
          🗑️
        </div>
      )}
    </div>
  );
};

export default ReviewCard;