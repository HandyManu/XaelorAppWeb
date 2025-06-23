// EditModal.jsx - Actualizado para manejar imágenes de Cloudinary
import React from 'react';
import './EditModal.css';

const EditModal = ({
  // Estados del formulario
  model,
  setModel,
  brandId,
  setBrandId,
  brands,
  price,
  setPrice,
  category,
  setCategory,
  description,
  setDescription,
  availability,
  setAvailability,
  photos,
  setPhotos,
  activePhotoIndex,
  setActivePhotoIndex,
  fileInputRef,
  
  // Funciones
  handleSubmit,
  handleFileSelect,
  handleDeletePhoto,
  handleSelectImage,
  isLoading,
  isEditing,
  onClose
}) => {
  // Función para procesar URL de Cloudinary
  const getImageUrl = (photo) => {
    if (!photo) return null;
    
    // Si ya es una URL completa
    if (typeof photo.url === 'string' && photo.url.includes('res.cloudinary.com')) {
      return photo.url;
    }
    
    // Si es una URL blob (imagen nueva)
    if (typeof photo.url === 'string' && photo.url.startsWith('blob:')) {
      return photo.url;
    }
    
    // Si necesita construir la URL de Cloudinary
    const CLOUD_NAME = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME || 'demo';
    const publicId = photo.url;
    
    return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/w_300,h_200,c_fill,f_auto,q_auto/${publicId}`;
  };

  // Función para manejar la selección de archivos
  const handleFileChange = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files);
    }
    // Limpiar el input para permitir seleccionar el mismo archivo nuevamente
    e.target.value = '';
  };

  // Función para activar el selector de archivos
  const handleAddPhotoClick = () => {
    if (fileInputRef && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2>{isEditing ? 'Editar Reloj' : 'Nuevo Reloj'}</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        <form onSubmit={handleSubmit} className="edit-form">
          <div className="form-group">
            <label htmlFor="model">Modelo</label>
            <input
              type="text"
              id="model"
              name="model"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="brandId">Marca</label>
            <select
              id="brandId"
              name="brandId"
              value={brandId}
              onChange={(e) => setBrandId(e.target.value)}
              disabled={isLoading}
              required
            >
              <option value="">Seleccionar marca</option>
              {brands && brands.map(brand => (
                <option key={brand._id} value={brand._id}>
                  {brand.brandName}
                </option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="price">Precio</label>
            <input
              type="number"
              id="price"
              name="price"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              disabled={isLoading}
              min="0"
              step="0.01"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="category">Categoría</label>
            <select
              id="category"
              name="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              disabled={isLoading}
              required
            >
              <option value="">Seleccionar categoría</option>
              <option value="Nautilus">Nautilus</option>
              <option value="Ett Med Naturen">Ett Med Naturen</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="description">Descripción</label>
            <textarea
              id="description"
              name="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isLoading}
              rows="4"
            />
          </div>
          
          <div className="form-group checkbox-group">
            <label>
              <input
                type="checkbox"
                name="availability"
                checked={availability}
                onChange={(e) => setAvailability(e.target.checked)}
                disabled={isLoading}
              />
              Disponible
            </label>
          </div>
          
          <div className="form-group photo-upload">
            <label>Fotos</label>
            <div className="photo-grid">
              {photos && photos.map((photo, index) => {
                const imageUrl = getImageUrl(photo);
                return (
                  <div 
                    key={`photo-${index}-${photo.name || 'unnamed'}`}
                    className={`photo-thumbnail ${index === activePhotoIndex ? 'active' : ''}`}
                    onClick={() => setActivePhotoIndex(index)}
                  >
                    {imageUrl ? (
                      <img 
                        src={imageUrl} 
                        alt={`Reloj ${index + 1}`}
                        onError={(e) => {
                          console.error('Error cargando imagen en modal:', imageUrl);
                          e.target.style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="image-error">
                        <span>❌</span>
                        <span>Error</span>
                      </div>
                    )}
                    <button 
                      type="button" 
                      className="delete-photo"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeletePhoto(index);
                      }}
                      disabled={isLoading}
                      title={`Eliminar imagen ${index + 1}`}
                    >
                      ×
                    </button>
                  </div>
                );
              })}
              
              <div className="add-photo" onClick={handleAddPhotoClick}>
                <span>+</span>
                <div style={{ fontSize: '12px', marginTop: '4px' }}>Agregar</div>
              </div>
              
              {/* Input oculto para seleccionar archivos */}
              <input
                type="file"
                accept="image/jpeg, image/png, image/webp, image/gif"
                style={{ display: 'none' }}
                ref={fileInputRef}
                onChange={handleFileChange}
                multiple
                disabled={isLoading}
              />
            </div>
            
            {/* Contador de imágenes y guía */}
            <div className="photo-info">
              <span className="photo-count">
                {photos.length} {photos.length === 1 ? 'imagen' : 'imágenes'}
              </span>
              <span className="photo-guide">
                Formatos aceptados: JPG, PNG, WebP, GIF
              </span>
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

export default EditModal;