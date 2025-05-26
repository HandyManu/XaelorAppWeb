// ProductCard.jsx con manejo seguro del carrusel
import React, { useState, useEffect } from 'react';
import './ProductCard.css';

const ProductCard = ({ data, onEdit, onDelete }) => {
  const [showDeleteIcon, setShowDeleteIcon] = useState(false);
  // Usamos el índice activo del producto si existe, o empezamos en 0
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(
    data.activePhotoIndex !== undefined ? data.activePhotoIndex : 0
  );
  
  // Actualizar el índice si cambian los datos externos
  useEffect(() => {
    // Si el producto tiene un índice activo definido, usarlo
    if (data.activePhotoIndex !== undefined) {
      setCurrentPhotoIndex(data.activePhotoIndex);
    } else {
      // Si no tiene índice pero sí tiene fotos, asegurarnos de que el índice sea válido
      if (data.photos && data.photos.length > 0) {
        setCurrentPhotoIndex(prevIndex => 
          prevIndex >= data.photos.length ? 0 : prevIndex
        );
      } else {
        // Si no tiene fotos, resetear a 0
        setCurrentPhotoIndex(0);
      }
    }
  }, [data]);
  
  // Manejar la navegación entre fotos de forma segura
  const nextPhoto = (e) => {
    e.stopPropagation(); // Evitar que se active el onEdit
    if (data.photos && data.photos.length > 1) {
      setCurrentPhotoIndex((prevIndex) => {
        // Asegurar que el nuevo índice esté dentro de los límites
        const nextIndex = prevIndex === data.photos.length - 1 ? 0 : prevIndex + 1;
        return nextIndex;
      });
    }
  };
  
  const prevPhoto = (e) => {
    e.stopPropagation(); // Evitar que se active el onEdit
    if (data.photos && data.photos.length > 1) {
      setCurrentPhotoIndex((prevIndex) => {
        // Asegurar que el nuevo índice esté dentro de los límites
        const prevIdxValue = prevIndex === 0 ? data.photos.length - 1 : prevIndex - 1;
        return prevIdxValue;
      });
    }
  };
  
  const handleClick = () => {
    if (onEdit) {
      // Pasar el índice actual de la foto al editor
      const dataWithCurrentIndex = {
        ...data,
        activePhotoIndex: currentPhotoIndex
      };
      onEdit(dataWithCurrentIndex);
    }
  };
  
  const handleDelete = (e) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(data._id);
    }
  };
  
  // Obtener la imagen actual para mostrar de forma segura
  const getCurrentImage = () => {
    if (data.photos && data.photos.length > 0) {
      // Asegurar que el índice esté dentro de los límites
      const safeIndex = Math.min(currentPhotoIndex, data.photos.length - 1);
      return data.photos[safeIndex]?.url;
    }
    return 'https://via.placeholder.com/300x300?text=No+Image';
  };
  
  // Si el producto no tiene fotos o si el índice actual es inválido, 
  // mostrar un placeholder y no los controles de navegación
  const hasValidPhotos = data.photos && data.photos.length > 0;
  const hasMultiplePhotos = hasValidPhotos && data.photos.length > 1;
  
  return (
    <div 
      className="product-card"
      onClick={handleClick}
      onMouseEnter={() => setShowDeleteIcon(true)}
      onMouseLeave={() => setShowDeleteIcon(false)}
    >
      <div className="product-image-container">
        {/* Imagen del producto */}
        <img 
          src={getCurrentImage()}
          alt={data.model}
          className="product-image"
        />
        
        {/* Controles de navegación entre fotos (solo visibles si hay más de una foto) */}
        {hasMultiplePhotos && (
          <>
            <button className="nav-button prev" onClick={prevPhoto}>&#10094;</button>
            <button className="nav-button next" onClick={nextPhoto}>&#10095;</button>
            
            {/* Indicadores de foto actual */}
            <div className="photo-indicators">
              {data.photos.map((_, index) => (
                <span 
                  key={index} 
                  className={`indicator ${index === currentPhotoIndex ? 'active' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentPhotoIndex(index);
                  }}
                />
              ))}
            </div>
          </>
        )}
      </div>
      
      <div className="product-info">
        <div className="product-title">{data.model}</div>
        
        <div className="product-price">
          ${data.price ? data.price.toLocaleString() : '0'}
        </div>
        
        <div className="product-category">{data.category}</div>
        
        <div className="product-description">
          <p>{data.description}</p>
        </div>
      </div>
      
      {showDeleteIcon && (
        <div className="delete-icon" onClick={handleDelete}>
          🗑️
        </div>
      )}
      
      {!data.availability && (
        <div className="unavailable-badge">No disponible</div>
      )}
    </div>
  );
};

export default ProductCard;