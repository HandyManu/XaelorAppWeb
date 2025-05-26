// ReviewEditModal.jsx
import React, { useState, useEffect } from 'react';
import './ReviewsEditModal.css';

const ReviewEditModal = ({ 
  review, 
  isOpen, 
  onClose, 
  onSave, 
  watches, 
  customers 
}) => {
  const [formData, setFormData] = useState({
    watchId: '',
    customerId: '',
    message: '',
    rating: 5
  });
  
  const [selectedWatch, setSelectedWatch] = useState(null);
  
  useEffect(() => {
    if (review) {
      // Si se está editando un review existente, cargar sus datos
      setFormData({
        watchId: review.watchId?.$oid || review.watchId || '',
        customerId: review.customerId?.$oid || review.customerId || '',
        message: review.message || '',
        rating: review.rating || 5
      });
      
      // Set selected watch
      const watchId = review.watchId?.$oid || review.watchId;
      const watch = watches.find(w => w._id === watchId);
      setSelectedWatch(watch);
    } else {
      // Si es un nuevo review, inicializar con valores por defecto
      setFormData({
        watchId: '',
        customerId: '',
        message: '',
        rating: 5
      });
      setSelectedWatch(null);
    }
  }, [review, watches]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Si cambia el watch, actualizar la preview
    if (name === 'watchId') {
      const watch = watches.find(w => w._id === value);
      setSelectedWatch(watch);
    }
  };
  
  const handleRatingChange = (newRating) => {
    setFormData({
      ...formData,
      rating: newRating
    });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validaciones
    if (!formData.watchId) {
      alert('Seleccione un reloj');
      return;
    }
    
    if (!formData.customerId) {
      alert('Seleccione un cliente');
      return;
    }
    
    if (!formData.message.trim()) {
      alert('Ingrese un mensaje para la reseña');
      return;
    }
    
    // Preparar los datos para el guardado
    const reviewData = {
      ...review, // Mantener el _id si existe
      watchId: { $oid: formData.watchId },
      customerId: { $oid: formData.customerId },
      message: formData.message,
      rating: formData.rating
    };
    
    onSave(reviewData);
  };
  
  // Renderizar estrellas para selección
  const renderRatingSelector = () => {
    return Array.from({ length: 5 }, (_, i) => {
      const starValue = i + 1;
      const isFilled = starValue <= formData.rating;
      
      return (
        <span
          key={i}
          className={`rating-star ${isFilled ? 'filled' : 'empty'}`}
          onClick={() => handleRatingChange(starValue)}
          onMouseEnter={() => {
            // Preview de rating en hover
            const stars = document.querySelectorAll('.rating-star');
            stars.forEach((star, index) => {
              if (index < starValue) {
                star.classList.add('filled');
                star.classList.remove('empty');
              } else {
                star.classList.remove('filled');
                star.classList.add('empty');
              }
            });
          }}
          onMouseLeave={() => {
            // Restaurar rating actual
            const stars = document.querySelectorAll('.rating-star');
            stars.forEach((star, index) => {
              if (index < formData.rating) {
                star.classList.add('filled');
                star.classList.remove('empty');
              } else {
                star.classList.remove('filled');
                star.classList.add('empty');
              }
            });
          }}
        >
          ⭐
        </span>
      );
    });
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2>{review && review._id ? 'Editar Reseña' : 'Nueva Reseña'}</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        <form onSubmit={handleSubmit} className="edit-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="watchId">Reloj</label>
              <select
                id="watchId"
                name="watchId"
                value={formData.watchId}
                onChange={handleChange}
                required
              >
                <option value="">Seleccione un reloj</option>
                {watches.map((watch) => (
                  <option 
                    key={watch._id} 
                    value={watch._id}
                  >
                    {watch.model}
                  </option>
                ))}
              </select>
              {selectedWatch && (
                <div className="watch-preview">
                  <img 
                    src={selectedWatch.image || 'https://via.placeholder.com/50'} 
                    alt={selectedWatch.model}
                    className="watch-preview-image"
                  />
                  <span className="watch-preview-name">{selectedWatch.model}</span>
                </div>
              )}
            </div>
            
            <div className="form-group">
              <label htmlFor="customerId">Cliente</label>
              <select
                id="customerId"
                name="customerId"
                value={formData.customerId}
                onChange={handleChange}
                required
              >
                <option value="">Seleccione un cliente</option>
                {customers.map((customer) => (
                  <option 
                    key={customer._id} 
                    value={customer._id}
                  >
                    {customer.name} - {customer.email}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="rating">Calificación</label>
            <div className="rating-selector">
              {renderRatingSelector()}
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="message">Mensaje de la Reseña</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Escriba la reseña del producto..."
              required
              maxLength={500}
            />
            <small style={{ color: '#888', marginTop: '0.25rem' }}>
              {formData.message.length}/500 caracteres
            </small>
          </div>
          
          <div className="form-actions">
            <button type="button" className="cancel-button" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="save-button">
              {review && review._id ? 'Actualizar Reseña' : 'Crear Reseña'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReviewEditModal;