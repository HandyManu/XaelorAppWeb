// CustomerEditModal.jsx - Actualizado para trabajar con el hook
import React from 'react';
import './CustomerEditModal.css';

const CustomerEditModal = ({
  // Estados del formulario
  name,
  setName,
  email,
  setEmail,
  password,
  setPassword,
  phone,
  setPhone,
  membershipId,
  setMembershipId,
  startDate,
  setStartDate,
  memberships,
  
  // Funciones
  handleSubmit,
  isLoading,
  isEditing,
  onClose
}) => {

  // Función temporal para mapear IDs a nombres hasta que sepamos la estructura real
  const getMembershipDisplayName = (membership) => {
    // Primero intentar las propiedades normales
    if (membership.membershipName) return membership.membershipName;
    if (membership.name) return membership.name;
    if (membership.brandName) return membership.brandName;
    
    // Si no tiene nombre, mapear por ID conocidos (temporal)
    const membershipNames = {
      '67acd69ae1fa12d45243dc76': 'Bronze',
      '67acd69ae1fa12d45243dc77': 'Silver', 
      '67acd69ae1fa12d45243dc78': 'Gold'
    };
    
    return membershipNames[membership._id] || `Membresía ${membership._id.slice(-4)}`;
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    
    // Validaciones básicas
    if (!name.trim()) {
      alert('El nombre es obligatorio');
      return;
    }
    
    if (!email.trim() || !email.includes('@')) {
      alert('Por favor, ingrese un email válido');
      return;
    }
    
    // Si es un cliente nuevo, la contraseña es obligatoria
    if (!isEditing && !password.trim()) {
      alert('La contraseña es obligatoria para nuevos clientes');
      return;
    }

    // Si se proporciona contraseña, validar longitud
    if (password.trim() && password.trim().length < 6) {
      alert('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    if (!phone.trim()) {
      alert('El teléfono es obligatorio');
      return;
    }

    if (!membershipId) {
      alert('Debe seleccionar una membresía');
      return;
    }
    
    // Preparar los datos para el submit
    const formData = {
      name: name.trim(),
      email: email.trim(),
      password: password.trim(),
      phone: phone.trim(),
      membershipId,
      startDate
    };
    
    handleSubmit(formData);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2>{isEditing ? 'Editar Cliente' : 'Nuevo Cliente'}</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        <form onSubmit={handleFormSubmit} className="edit-form">
          <div className="form-group">
            <label htmlFor="name">Nombre Completo</label>
            <input
              type="text"
              id="name"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nombre del cliente"
              disabled={isLoading}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Correo Electrónico</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="correo@ejemplo.com"
              disabled={isLoading}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">
              {isEditing ? 'Nueva Contraseña (dejar en blanco para mantener la actual)' : 'Contraseña'}
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={isEditing ? 'Nueva contraseña (opcional)' : 'Contraseña'}
              disabled={isLoading}
              required={!isEditing}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="phone">Teléfono</label>
            <input
              type="text"
              id="phone"
              name="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="0000-0000"
              disabled={isLoading}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="membershipId">Tipo de Membresía</label>
            <select
              id="membershipId"
              name="membershipId"
              value={membershipId}
              onChange={(e) => setMembershipId(e.target.value)}
              disabled={isLoading}
              required
            >
              <option value="">Seleccionar membresía</option>
              {memberships && memberships.length > 0 ? (
                memberships.map((membership) => (
                  <option key={membership._id} value={membership._id}>
                    {getMembershipDisplayName(membership)}
                  </option>
                ))
              ) : (
                <option value="" disabled>Cargando membresías...</option>
              )}
            </select>
            {/* Debug: Mostrar cuántas membresías se cargaron */}
            {process.env.NODE_ENV === 'development' && (
              <small style={{color: '#666', fontSize: '0.75rem'}}>
                {memberships ? `${memberships.length} membresías cargadas` : 'No hay membresías'}
              </small>
            )}
          </div>
          
          <div className="form-group">
            <label htmlFor="startDate">Fecha de Inicio de Membresía</label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              disabled={isLoading}
              required
            />
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
              {isLoading ? 'Guardando...' : isEditing ? 'Actualizar Cliente' : 'Crear Cliente'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CustomerEditModal;