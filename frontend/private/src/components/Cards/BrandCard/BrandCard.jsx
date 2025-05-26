// BrandCard.jsx - Usando TU estructura CSS original
import React from 'react';
import './BrandCard.css';

const BrandCard = ({ data, onEdit, onDelete, isLoading }) => {
  const handleDelete = (e) => {
    e.stopPropagation();
    console.log('Eliminando marca:', data._id);
    onDelete(e);
  };

  const handleEdit = () => {
    console.log('Editando marca:', data);
    onEdit();
  };

  return (
    <div className="brand-card" onClick={handleEdit}>
      {/* Iniciales de fondo */}
      <div className="brand-initials">
        {data.brandName ? data.brandName.substring(0, 2).toUpperCase() : 'BR'}
      </div>
      
      {/* Logo o iniciales principales */}
      {data.photos ? (
        <div className="brand-logo-container">
          <img 
            src={data.photos} 
            alt={data.brandName}
            className="brand-logo-image"
            onLoad={() => console.log('✅ Imagen cargada:', data.brandName)}
            onError={(e) => {
              console.log('❌ Error cargando imagen:', data.photos);
              // Si falla la imagen, mostrar las iniciales
              e.target.style.display = 'none';
              e.target.parentNode.innerHTML = `<div class="brand-logo">${data.brandName.substring(0, 2).toUpperCase()}</div>`;
            }}
          />
        </div>
      ) : (
        <div className="brand-logo">
          {data.brandName ? data.brandName.substring(0, 2).toUpperCase() : 'BR'}
        </div>
      )}
      
      {/* Nombre de la marca */}
      <div className="brand-name">{data.brandName}</div>
      
      {/* Icono de eliminar */}
      <div 
        className="delete-icon"
        onClick={handleDelete}
        title="Eliminar marca"
      >
        ×
      </div>
    </div>
  );
};

export default BrandCard;