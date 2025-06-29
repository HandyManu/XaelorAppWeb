// ProductCard.jsx con manejo seguro del carrusel y Cloudinary
import React, { useState, useEffect } from 'react';
import './ProductCard.css';

const ProductCard = ({ data, onEdit, onDelete }) => {
  const [showDeleteIcon, setShowDeleteIcon] = useState(false);
  const [fade, setFade] = useState(false);
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
  
  // Función para procesar URL de Cloudinary
  const getCloudinaryUrl = (photo) => {
    if (!photo) return 'https://via.placeholder.com/300x300?text=No+Image';
    
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
    // IMPORTANTE: Reemplaza 'demo' con tu cloud name real
    const CLOUD_NAME = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME || 'demo';
    const publicId = typeof photo === 'string' ? photo : (photo.url || photo);
    
    return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/w_400,h_300,c_fill,f_auto,q_auto/${publicId}`;
  };
  
  // Manejar la navegación entre fotos de forma segura
  const nextPhoto = (e) => {
    e.stopPropagation(); // Evitar que se active el onEdit
    if (data.photos && data.photos.length > 1) {
      setFade(true);
      setTimeout(() => {
        setCurrentPhotoIndex((prevIndex) =>
          prevIndex === data.photos.length - 1 ? 0 : prevIndex + 1
        );
        setFade(false);
      }, 200);
    }
  };
  
  const prevPhoto = (e) => {
    e.stopPropagation(); // Evitar que se active el onEdit
    if (data.photos && data.photos.length > 1) {
      setFade(true);
      setTimeout(() => {
        setCurrentPhotoIndex((prevIndex) =>
          prevIndex === 0 ? data.photos.length - 1 : prevIndex - 1
        );
        setFade(false);
      }, 200);
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
      return getCloudinaryUrl(data.photos[safeIndex]);
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
          className={`product-image${fade ? ' fade' : ''}`}
          src={getCurrentImage()}
          alt={data.model}
          onError={e => {
            e.target.onerror = null;
            e.target.src = "https://www.svgrepo.com/show/508699/landscape-placeholder.svg";
          }}
        />
        
        {/* Controles de navegación entre fotos (solo visibles si hay más de una foto) */}
        {hasMultiplePhotos && (
          <>
            <button className="nav-button prev" onClick={prevPhoto}>&#10094;</button>
            <button className="nav-button next" onClick={nextPhoto}>&#10095;</button>
            
            {/* Indicadores de foto currente */}
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
          <img src="/basura.svg" alt="Delete Icon" className="delete-icon-img" />
        </div>
      )}
      
      {!data.availability && (
        <div className="unavailable-badge">No disponible</div>
      )}
    </div>
  );
};

export default ProductCard;