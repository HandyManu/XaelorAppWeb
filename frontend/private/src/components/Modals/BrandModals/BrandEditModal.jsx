// BrandEditModal.jsx - Usando TU CSS
import React from 'react';
import './BrandEditModal.css'; // TU CSS EXACTO

const BrandEditModal = ({
  brandName,
  setBrandName,
  previewUrl,
  setPreviewUrl,
  setImage,
  handleImageChange,
  handleSelectImage,
  fileInputRef,
  handleSubmit,
  isLoading,
  isEditing,
  onClose
}) => {
  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2>{isEditing ? 'Editar Marca' : 'Nueva Marca'}</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        <form onSubmit={handleSubmit} className="edit-form">
          <div className="form-group">
            <label htmlFor="brandName">Nombre de la Marca</label>
            <input
              type="text"
              id="brandName"
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
              placeholder="Ingresa el nombre de la marca"
              disabled={isLoading}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Logo de la Marca</label>
            <div className="logo-upload-container">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/jpeg, image/png, image/jpg"
                style={{ display: 'none' }}
              />
              
              <div className="logo-upload" onClick={handleSelectImage}>
                {previewUrl ? (
                  <img src={previewUrl} alt="Vista previa del logo" className="logo-preview" />
                ) : (
                  <div className="upload-placeholder">
                    <div className="upload-icon">📷</div>
                    <div className="upload-text">Seleccionar logo</div>
                  </div>
                )}
              </div>
              
              {previewUrl && (
                <button
                  type="button"
                  className="remove-image-btn"
                  onClick={() => {
                    setPreviewUrl('');
                    setImage(null);
                  }}
                >
                  Cambiar imagen
                </button>
              )}
            </div>
          </div>
          
          <div className="form-actions">
            <button
              type="button"
              className="cancel-button"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="save-button"
              disabled={isLoading}
            >
              {isLoading ? 'Guardando...' : isEditing ? 'Actualizar' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BrandEditModal;