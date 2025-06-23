// ReviewCard.jsx - Actualizado para manejar IDs de base de datos
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
      // Manejar tanto el formato de MongoDB ($oid) como el ID directo
      const reviewId = data._id?.$oid || data._id;
      onDelete(reviewId);
    }
  };
  
  // Formatear fecha
  const formatDate = (dateString) => {
    if (!dateString) return 'Sin fecha';
    
    // Manejar tanto el formato de MongoDB ($date) como el ISO string directo
    const dateToFormat = dateString?.$date || dateString;
    const date = new Date(dateToFormat);
    
    // Verificar que la fecha sea válida
    if (isNaN(date.getTime())) return 'Fecha inválida';
    
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
  
  // Validar datos mínimos
  if (!data) {
    return (
      <div className="review-card">
        <div className="review-body">
          <div className="message-section">
            <div className="review-message">
              Error: Datos de reseña no disponibles
            </div>
          </div>
        </div>
      </div>
    );
  }
  
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
            src={watchInfo?.image || 'https://www.svgrepo.com/show/508699/landscape-placeholder.svg'} 
            alt={watchInfo?.model || 'Producto'}
            className="product-image"
            onError={(e) => {
              e.target.src = 'https://www.svgrepo.com/show/508699/landscape-placeholder.svg';
            }}
          />
          <div className="product-details">
            <div className="product-model">
              {watchInfo?.model || 'Producto no encontrado'}
            </div>
            <div className="review-date">
              {formatDate(data.date)}
            </div>
          </div>
        </div>
        
        <div className="rating-badge">
          <span className="rating-value">{data.rating || 0}</span>
          <div className="rating-stars">
            {renderStars(data.rating || 0)}
          </div>
        </div>
      </div>
      
      <div className="review-body">
        <div className="customer-section">
          <div className="section-title">Cliente</div>
          <div className="customer-details">
            <div className="customer-name">
              {customerInfo?.name || 'Cliente no encontrado'}
            </div>
            <div className="customer-email">
              {customerInfo?.email || 'Email no disponible'}
            </div>
          </div>
        </div>
        
        <div className="message-section">
          <div className="section-title">Reseña</div>
          <div className="review-message">
            "{data.message || 'Sin mensaje'}"
          </div>
        </div>
      </div>
      
      {showDeleteIcon && onDelete && (
        <div className="delete-icon" onClick={handleDelete} title="Eliminar reseña">
          <img src="/basura.svg" alt="Delete Icon" className="delete-icon-img" />
        </div>
      )}
    </div>
  );
};

export default ReviewCard;