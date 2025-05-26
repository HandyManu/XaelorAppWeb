// CustomerEditModal.jsx
import React, { useState, useEffect } from 'react';
import './CustomerEditModal.css';

const CustomerEditModal = ({ customer, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    membership: {
      membershipId: { $oid: '' },
      startDate: { $date: new Date().toISOString() }
    }
  });
  
  // Opciones de membresía para el select
  const membershipOptions = [
    { id: '67acd69ae1fa12d45243dc76', name: 'Bronze' },
    { id: '67acd69ae1fa12d45243dc77', name: 'Silver' },
    { id: '67acd69ae1fa12d45243dc78', name: 'Gold' }
  ];

  useEffect(() => {
    if (customer) {
      // Si se está editando un cliente existente, cargar sus datos
      setFormData({
        name: customer.name || '',
        email: customer.email || '',
        // Por seguridad, no incluimos la contraseña actual al editar
        password: '',
        phone: customer.phone || '',
        membership: {
          membershipId: customer.membership?.membershipId || { $oid: '67acd69ae1fa12d45243dc76' },
          startDate: customer.membership?.startDate || { $date: new Date().toISOString() }
        }
      });
    } else {
      // Si es un nuevo cliente, inicializar con valores por defecto
      setFormData({
        name: '',
        email: '',
        password: '',
        phone: '',
        membership: {
          membershipId: { $oid: '67acd69ae1fa12d45243dc76' }, // Bronze por defecto
          startDate: { $date: new Date().toISOString() }
        }
      });
    }
  }, [customer]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Para los campos anidados en membership
    if (name === 'membershipId') {
      setFormData({
        ...formData,
        membership: {
          ...formData.membership,
          membershipId: { $oid: value }
        }
      });
    } else if (name === 'startDate') {
      setFormData({
        ...formData,
        membership: {
          ...formData.membership,
          startDate: { $date: new Date(value).toISOString() }
        }
      });
    } else {
      // Para los campos de nivel superior
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validaciones básicas
    if (!formData.name.trim()) {
      alert('El nombre es obligatorio');
      return;
    }
    
    if (!formData.email.trim() || !formData.email.includes('@')) {
      alert('Por favor, ingrese un email válido');
      return;
    }
    
    // Si es un cliente nuevo, la contraseña es obligatoria
    if (!customer?._id && !formData.password) {
      alert('La contraseña es obligatoria para nuevos clientes');
      return;
    }
    
    // Preparar los datos para el guardado
    const customerData = {
      ...customer, // Mantener el _id si existe
      ...formData,
      // Si la contraseña está vacía y estamos editando, no la actualizamos
      password: formData.password || (customer ? customer.password : '')
    };
    
    onSave(customerData);
  };

  // Formateamos la fecha para el campo input de tipo date
  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2>{customer && customer._id ? 'Editar Cliente' : 'Nuevo Cliente'}</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        <form onSubmit={handleSubmit} className="edit-form">
          <div className="form-group">
            <label htmlFor="name">Nombre Completo</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Nombre del cliente"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Correo Electrónico</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="correo@ejemplo.com"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">
              {customer && customer._id ? 'Contraseña (dejar en blanco para mantener la actual)' : 'Contraseña'}
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder={customer && customer._id ? '••••••••' : 'Nueva contraseña'}
              required={!customer || !customer._id}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="phone">Teléfono</label>
            <input
              type="text"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="0000-0000"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="membershipId">Tipo de Membresía</label>
            <select
              id="membershipId"
              name="membershipId"
              value={formData.membership.membershipId.$oid}
              onChange={handleChange}
              required
            >
              {membershipOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="startDate">Fecha de Inicio de Membresía</label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={formatDateForInput(formData.membership.startDate.$date)}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-actions">
            <button type="button" className="cancel-button" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="save-button">
              {customer && customer._id ? 'Actualizar Cliente' : 'Crear Cliente'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CustomerEditModal;