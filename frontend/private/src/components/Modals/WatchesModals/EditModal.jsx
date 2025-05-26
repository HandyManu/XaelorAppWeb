// EditModal.jsx con funcionalidad para agregar y eliminar imágenes de forma segura
import React, { useState, useEffect, useRef } from 'react';
import './EditModal.css';

const EditModal = ({ product, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    model: '',
    price: 0,
    category: '',
    description: '',
    availability: true,
    photos: []
  });
  
  // Estado para seguir el índice de la foto que está siendo mostrada en el carrusel
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  
  // Referencia para el input de archivos oculto
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (product) {
      setFormData({
        model: product.model || '',
        price: product.price || 0,
        category: product.category || '',
        description: product.description || '',
        availability: product.availability !== undefined ? product.availability : true,
        photos: product.photos || []
      });
      
      // Asegurarse de que activePhotoIndex esté dentro de los límites
      if (product.photos && product.photos.length > 0) {
        setActivePhotoIndex(prev => Math.min(prev, product.photos.length - 1));
      } else {
        setActivePhotoIndex(0);
      }
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  // Función para manejar la eliminación de fotos de forma segura
  const handleDeletePhoto = (index) => {
    const updatedPhotos = [...formData.photos];
    updatedPhotos.splice(index, 1);
    
    // Actualizar el estado con las fotos actualizadas
    setFormData({
      ...formData,
      photos: updatedPhotos
    });
    
    // Manejar el índice activo para evitar errores
    if (updatedPhotos.length === 0) {
      // Si no quedan fotos, reiniciar el índice
      setActivePhotoIndex(0);
    } else if (index <= activePhotoIndex) {
      // Si eliminamos la foto activa o una anterior, ajustar el índice
      if (index === activePhotoIndex && index === updatedPhotos.length) {
        // Si eliminamos la última foto y era la activa, mostrar la nueva última
        setActivePhotoIndex(Math.max(0, updatedPhotos.length - 1));
      } else if (index === activePhotoIndex) {
        // Si eliminamos la foto activa pero no es la última, mantenemos el mismo índice
        // (que ahora apuntará a la siguiente foto)
        setActivePhotoIndex(Math.min(activePhotoIndex, updatedPhotos.length - 1));
      } else {
        // Si eliminamos una foto antes de la activa, decrementar el índice
        setActivePhotoIndex(activePhotoIndex - 1);
      }
    }
    // Si eliminamos una foto después de la activa, no necesitamos cambiar el índice
  };
  
  // Función para activar el selector de archivos al hacer clic en "+"
  const handleAddPhotoClick = () => {
    fileInputRef.current.click();
  };
  
  // Función para manejar la selección de nuevas imágenes
  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length === 0) return;
    
    // Aquí en una aplicación real harías la subida al servidor
    // Para esta demo, creamos URLs locales
    
    const newPhotos = files.map(file => {
      // Validación de tipo de archivo
      const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
      if (!validTypes.includes(file.type)) {
        alert(`El archivo ${file.name} no es una imagen válida. Use JPG, PNG, WebP o GIF.`);
        return null;
      }
      
      // Crear URL temporal para vista previa
      const photoUrl = URL.createObjectURL(file);
      
      return {
        url: photoUrl,
        // En una aplicación real, aquí subirías el archivo al servidor
        // y devolverías la URL real, más metadatos como el nombre del archivo
        file: file, // Guardamos una referencia al archivo para una posible subida posterior
        name: file.name
      };
    }).filter(photo => photo !== null); // Filtrar posibles archivos inválidos
    
    if (newPhotos.length === 0) return;
    
    // Actualizamos el estado añadiendo las nuevas fotos
    const updatedPhotos = [...formData.photos, ...newPhotos];
    setFormData({
      ...formData,
      photos: updatedPhotos
    });
    
    // Si no había fotos antes, seleccionamos la primera nueva
    if (formData.photos.length === 0 && newPhotos.length > 0) {
      setActivePhotoIndex(0);
    }
    
    // Limpiamos el input para permitir seleccionar el mismo archivo nuevamente
    e.target.value = '';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // En una aplicación real, aquí subirías primero las imágenes al servidor
    // y luego guardarías el producto con las URLs de las imágenes
    
    // Preparamos los datos para guardar, incluyendo el índice activo para el carrusel
    const updatedProduct = {
      ...product,
      ...formData,
      price: Number(formData.price),
      photos: formData.photos.map(photo => {
        // Eliminamos la propiedad file que solo usamos para la vista previa
        const { file, ...photoData } = photo;
        return photoData;
      }),
      // Añadimos un campo para el índice activo para el producto
      activePhotoIndex: activePhotoIndex
    };
    
    if (onSave) {
      onSave(updatedProduct);
    }
  };

  // Renderizar nada si el modal no está abierto
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2>{product && product._id ? 'Editar Producto' : 'Nuevo Producto'}</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        <form onSubmit={handleSubmit} className="edit-form">
          <div className="form-group">
            <label htmlFor="model">Modelo</label>
            <input
              type="text"
              id="model"
              name="model"
              value={formData.model}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="price">Precio</label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="category">Categoría</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
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
              value={formData.description}
              onChange={handleChange}
              rows="4"
            />
          </div>
          
          <div className="form-group checkbox-group">
            <label>
              <input
                type="checkbox"
                name="availability"
                checked={formData.availability}
                onChange={handleChange}
              />
              Disponible
            </label>
          </div>
          
          <div className="form-group photo-upload">
            <label>Fotos</label>
            <div className="photo-grid">
              {formData.photos && formData.photos.map((photo, index) => (
                <div 
                  key={index} 
                  className={`photo-thumbnail ${index === activePhotoIndex ? 'active' : ''}`}
                  onClick={() => setActivePhotoIndex(index)}
                >
                  <img src={photo.url} alt={`Product ${index + 1}`} />
                  <button 
                    type="button" 
                    className="delete-photo"
                    onClick={(e) => {
                      e.stopPropagation(); // Evitar que se seleccione la imagen al mismo tiempo
                      handleDeletePhoto(index);
                    }}
                  >
                    ×
                  </button>
                </div>
              ))}
              
              <div className="add-photo" onClick={handleAddPhotoClick}>
                <span>+</span>
              </div>
              
              {/* Input oculto para seleccionar archivos */}
              <input
                type="file"
                accept="image/jpeg, image/png, image/webp, image/gif"
                style={{ display: 'none' }}
                ref={fileInputRef}
                onChange={handleFileSelect}
                multiple
              />
            </div>
            
            {/* Contador de imágenes y guía */}
            <div className="photo-info">
              <span className="photo-count">
                {formData.photos.length} {formData.photos.length === 1 ? 'imagen' : 'imágenes'}
              </span>
              <span className="photo-guide">
                Formatos aceptados: JPG, PNG, WebP, GIF
              </span>
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

export default EditModal;