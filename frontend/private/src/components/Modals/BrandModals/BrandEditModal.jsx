// BrandEditModal.jsx con subida de imágenes
import React, { useState, useEffect, useRef } from 'react';
import './BrandEditModal.css';

const BrandEditModal = ({ brand, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    brandName: '',
    logoUrl: ''
  });
  
  // Referencia para el input de tipo file
  const fileInputRef = useRef(null);
  
  // Estado para previsualización de imagen
  const [previewUrl, setPreviewUrl] = useState('');
  
  // Estado para validación
  const [errors, setErrors] = useState({});
  const [isDuplicate, setIsDuplicate] = useState(false);

  useEffect(() => {
    if (brand) {
      setFormData({
        brandName: brand.brandName || '',
        logoUrl: brand.logoUrl || ''
      });
      setPreviewUrl(brand.logoUrl || '');
      setErrors({});
      setIsDuplicate(false);
    }
  }, [brand]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Limpia el error para este campo cuando el usuario empieza a escribir
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
    
    // Resetea el estado de duplicado
    setIsDuplicate(false);
  };
  
  // Manejo de carga de imágenes
  const handleImageClick = () => {
    // Activa el input de tipo file al hacer clic en la imagen
    fileInputRef.current.click();
  };
  
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    
    if (!file) return;
    
    // Validar el tipo de archivo
    const validFileTypes = ['image/jpeg', 'image/png', 'image/svg+xml', 'image/gif'];
    if (!validFileTypes.includes(file.type)) {
      setErrors({
        ...errors,
        logoUrl: 'Tipo de archivo no válido. Usar PNG, JPG, SVG o GIF.'
      });
      return;
    }
    
    // Validar tamaño del archivo (máx 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setErrors({
        ...errors,
        logoUrl: 'La imagen no debe exceder los 2MB.'
      });
      return;
    }
    
    // En una aplicación real, aquí subirías la imagen a un servidor
    // y obtendrías la URL de la imagen para guardarla en la base de datos
    
    // Para esta demostración, creamos una URL local para la previsualización
    const imageUrl = URL.createObjectURL(file);
    
    setPreviewUrl(imageUrl);
    setFormData({
      ...formData,
      logoUrl: imageUrl // En una aplicación real, esta sería la URL del servidor
    });
    
    // Limpiar error si existía
    if (errors.logoUrl) {
      setErrors({
        ...errors,
        logoUrl: ''
      });
    }
  };
  
  const removeImage = () => {
    setPreviewUrl('');
    setFormData({
      ...formData,
      logoUrl: ''
    });
    
    // Resetear el input de tipo file
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.brandName.trim()) {
      newErrors.brandName = 'El nombre de la marca es obligatorio';
    } else if (formData.brandName.length < 2) {
      newErrors.brandName = 'El nombre debe tener al menos 2 caracteres';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    // En una aplicación real, aquí verificarías si la marca ya existe
    // Por ahora, simulamos un check básico
    const isValid = true; // Simular validación
    
    if (!isValid) {
      setIsDuplicate(true);
      return;
    }
    
    if (onSave) {
      onSave({
        ...brand,
        ...formData
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2>{brand && brand._id ? 'Editar Marca' : 'Nueva Marca'}</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        <form onSubmit={handleSubmit} className="edit-form">
          <div className={`form-group ${errors.brandName ? 'has-error' : ''}`}>
            <label htmlFor="brandName">Nombre de la Marca</label>
            <input
              type="text"
              id="brandName"
              name="brandName"
              value={formData.brandName}
              onChange={handleChange}
              placeholder="Ej: Rolex, Casio, Omega"
              className={errors.brandName ? 'input-error' : ''}
            />
            {errors.brandName && (
              <div className="error-message">{errors.brandName}</div>
            )}
            {isDuplicate && (
              <div className="error-message">Esta marca ya existe</div>
            )}
          </div>
          
          <div className={`form-group ${errors.logoUrl ? 'has-error' : ''}`}>
            <label>Logo de la Marca</label>
            <div className="logo-upload-container">
              <div
                className="logo-upload"
                onClick={handleImageClick}
              >
                {previewUrl ? (
                  <img 
                    src={previewUrl} 
                    alt="Vista previa del logo" 
                    className="logo-preview"
                  />
                ) : (
                  <div className="upload-placeholder">
                    <span className="upload-icon">+</span>
                    <span className="upload-text">Subir logo</span>
                  </div>
                )}
              </div>
              
              {/* Input de archivo oculto */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/png, image/jpeg, image/svg+xml, image/gif"
                style={{ display: 'none' }}
              />
              
              {previewUrl && (
                <button 
                  type="button" 
                  className="remove-image-btn"
                  onClick={removeImage}
                >
                  Eliminar logo
                </button>
              )}
            </div>
            
            {errors.logoUrl && (
              <div className="error-message">{errors.logoUrl}</div>
            )}
            
            <div className="logo-hint">
              Formatos aceptados: PNG, JPG, SVG, GIF. Tamaño máximo: 2MB.
            </div>
          </div>
          
          <div className="brand-preview">
            <div className="preview-label">Vista previa:</div>
            <div className="preview-box">
              {previewUrl ? (
                <img src={previewUrl} alt="Logo de la marca" className="preview-logo-image" />
              ) : (
                <div className="preview-logo">æ</div>
              )}
              <div className="preview-name">{formData.brandName || 'Nombre de la marca'}</div>
            </div>
          </div>
          
          <div className="form-actions">
            <button type="button" className="cancel-button" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="save-button">
              Guardar Cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BrandEditModal;