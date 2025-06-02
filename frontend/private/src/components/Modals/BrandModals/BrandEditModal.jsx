// BrandEditModal.jsx - Usando TU CSS
import React from 'react';
import './BrandEditModal.css'; // TU CSS EXACTO

const BrandEditModal = ({
  isEditing,
  onClose,
  children
}) => {
  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2>{isEditing ? 'Editar Marca' : 'Nueva Marca'}</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
          {children}
      </div>
    </div>
  );
};

export default BrandEditModal;