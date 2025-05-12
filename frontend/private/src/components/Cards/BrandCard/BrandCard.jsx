// BrandCard.jsx con soporte para imágenes de logo
import React, { useState } from 'react';
import './BrandCard.css';

const BrandCard = ({ data, onEdit, onDelete }) => {
  const [showDeleteIcon, setShowDeleteIcon] = useState(false);
  const [imageError, setImageError] = useState(false);
  
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
  
  // Obtener las iniciales de la marca para el fondo/fallback
  const getInitials = () => {
    if (!data.brandName) return '';
    const words = data.brandName.split(' ');
    if (words.length === 1) {
      return words[0].charAt(0).toUpperCase();
    } else {
      return (words[0].charAt(0) + words[1].charAt(0)).toUpperCase();
    }
  };
  
  // Manejar errores de carga de imagen
  const handleImageError = () => {
    setImageError(true);
  };
  
  return (
    <div 
      className="brand-card"
      onClick={handleClick}
      onMouseEnter={() => setShowDeleteIcon(true)}
      onMouseLeave={() => setShowDeleteIcon(false)}
    >
      <div className="brand-initials">{getInitials()}</div>
      
      {/* Mostrar imagen de logo si existe y no hay error, o el logo predeterminado si no hay imagen o hay error */}
      {data.logoUrl && !imageError ? (
        <div className="brand-logo-container">
          <img 
            src={data.logoUrl} 
            alt={`Logo de ${data.brandName}`} 
            className="brand-logo-image"
            onError={handleImageError}
          />
        </div>
      ) : (
        <div className="brand-logo">æ</div>
      )}
      
      <div className="brand-name">
        {data.brandName}
      </div>
      
      {showDeleteIcon && (
        <div className="delete-icon" onClick={handleDelete}>
          🗑️
        </div>
      )}
    </div>
  );
};

export default BrandCard;