// BranchEditModal.jsx
import { useState, useEffect } from 'react';
import './BranchEditModal.css';

function BranchEditModal({ branch, isOpen, onClose, onSave }) {
  const [formData, setFormData] = useState({
    branch_name: '',
    country: '',
    address: '',
    phone_number: '',
    business_hours: [
      { day: 'Lunes', open: '08:00', close: '18:00' },
      { day: 'Martes', open: '08:00', close: '18:00' }
    ]
  });
  
  // Estado para manejar dinámicamente los horarios comerciales
  const [businessHours, setBusinessHours] = useState([]);

  useEffect(() => {
    if (branch) {
      setFormData({
        branch_name: branch.branch_name || '',
        country: branch.country || '',
        address: branch.address || '',
        phone_number: branch.phone_number || '',
        business_hours: branch.business_hours && branch.business_hours.length > 0 
          ? [...branch.business_hours] 
          : [{ day: 'Lunes', open: '08:00', close: '18:00' }]
      });
      
      setBusinessHours(branch.business_hours && branch.business_hours.length > 0 
        ? [...branch.business_hours] 
        : [{ day: 'Lunes', open: '08:00', close: '18:00' }]);
    }
  }, [branch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  // Manejar cambios en los horarios
  const handleHourChange = (index, field, value) => {
    const updatedHours = [...businessHours];
    updatedHours[index] = {
      ...updatedHours[index],
      [field]: value
    };
    setBusinessHours(updatedHours);
    setFormData({
      ...formData,
      business_hours: updatedHours
    });
  };
  
  // Agregar un nuevo horario
  const addBusinessHour = () => {
    const newHour = { day: 'Lunes', open: '08:00', close: '18:00' };
    setBusinessHours([...businessHours, newHour]);
    setFormData({
      ...formData,
      business_hours: [...formData.business_hours, newHour]
    });
  };
  
  // Eliminar un horario
  const removeBusinessHour = (index) => {
    const updatedHours = businessHours.filter((_, i) => i !== index);
    setBusinessHours(updatedHours);
    setFormData({
      ...formData,
      business_hours: updatedHours
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSave) {
      onSave({
        ...branch,
        ...formData
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2>{branch && branch._id ? 'Editar Sucursal' : 'Nueva Sucursal'}</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        <form onSubmit={handleSubmit} className="edit-form">
          <div className="form-group">
            <label htmlFor="branch_name">Nombre de la Sucursal</label>
            <input
              type="text"
              id="branch_name"
              name="branch_name"
              value={formData.branch_name}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="country">País</label>
            <input
              type="text"
              id="country"
              name="country"
              value={formData.country}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="address">Dirección</label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="phone_number">Número de Teléfono</label>
            <input
              type="text"
              id="phone_number"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Horarios Comerciales</label>
            <div className="business-hours-container">
              {businessHours.map((hour, index) => (
                <div key={index} className="hour-row">
                  <div className="hour-input">
                    <label>Día</label>
                    <input
                      type="text"
                      value={hour.day}
                      onChange={(e) => handleHourChange(index, 'day', e.target.value)}
                      placeholder="Ej: Lunes o Lunes-Viernes"
                    />
                  </div>
                  
                  <div className="hour-input">
                    <label>Apertura</label>
                    <input
                      type="time"
                      value={hour.open}
                      onChange={(e) => handleHourChange(index, 'open', e.target.value)}
                    />
                  </div>
                  
                  <div className="hour-input">
                    <label>Cierre</label>
                    <input
                      type="time"
                      value={hour.close}
                      onChange={(e) => handleHourChange(index, 'close', e.target.value)}
                    />
                  </div>
                  
                  <button 
                    type="button" 
                    className="remove-hour" 
                    onClick={() => removeBusinessHour(index)}
                    disabled={businessHours.length <= 1}
                  >
                    ×
                  </button>
                </div>
              ))}
              
              <button 
                type="button" 
                className="add-hour-btn" 
                onClick={addBusinessHour}
              >
                + Agregar Horario
              </button>
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
}

export default BranchEditModal;