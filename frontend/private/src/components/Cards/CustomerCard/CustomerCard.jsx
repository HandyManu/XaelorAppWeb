// CustomerCard.jsx - Componente para mostrar información de clientes
import React, { useState } from 'react';
import './CustomerCard.css';

const CustomerCard = ({ data, onEdit, onDelete, isLoading, getMembershipName }) => {
  const [showDeleteIcon, setShowDeleteIcon] = useState(false);
  
  // Extraer información del cliente
  const {
    _id,
    name = 'Sin nombre',
    email = 'Sin email',
    phone = 'Sin teléfono',
    membership = {},
    createdAt
  } = data || {};

  // Obtener información de la membresía
  const membershipId = membership?.membershipId?._id || membership?.membershipId;
  const membershipName = getMembershipName ? getMembershipName(membershipId) : 'Sin membresía';
  const startDate = membership?.startDate ? new Date(membership.startDate).toLocaleDateString('es-ES') : 'Sin fecha';
  
  // Obtener las iniciales del nombre para el avatar
  const getInitials = (name) => {
    if (!name || name === 'Sin nombre') return '??';
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  // Determinar el color de la membresía
  const getMembershipColor = (membershipName) => {
    switch (membershipName?.toLowerCase()) {
      case 'bronze':
        return '#cd7f32';
      case 'silver':
        return '#c0c0c0';
      case 'gold':
        return '#ffd700';
      default:
        return '#666';
    }
  };

  const handleClick = () => {
    if (onEdit) {
      onEdit(data);
    }
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(_id);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Sin fecha';
    try {
      return new Date(dateString).toLocaleDateString('es-ES');
    } catch {
      return 'Fecha inválida';
    }
  };

  return (
    <div 
      className="customer-card"
      onClick={handleClick}
      onMouseEnter={() => setShowDeleteIcon(true)}
      onMouseLeave={() => setShowDeleteIcon(false)}
    >
      {/* Avatar del cliente */}
      <div className="customer-avatar">
        <span className="customer-initials">{getInitials(name)}</span>
      </div>

      {/* Información del cliente */}
      <div className="customer-info">
        <div className="customer-header">
          <h3 className="customer-name">{name}</h3>
          <div 
            className="membership-badge"
            style={{ backgroundColor: getMembershipColor(membershipName) }}
          >
            {membershipName}
          </div>
        </div>
        
        <div className="customer-details">
          <div className="detail-item">
            <span className="detail-icon">📧</span>
            <span className="detail-text">{email}</span>
          </div>
          
          <div className="detail-item">
            <span className="detail-icon">📱</span>
            <span className="detail-text">{phone}</span>
          </div>
          
          <div className="detail-item">
            <span className="detail-icon">📅</span>
            <span className="detail-text">Inicio: {startDate}</span>
          </div>
          
          {createdAt && (
            <div className="detail-item">
              <span className="detail-icon">👤</span>
              <span className="detail-text">Registro: {formatDate(createdAt)}</span>
            </div>
          )}
        </div>
      </div>

      {/* Botón de eliminar */}
      {showDeleteIcon && (
        <div className="delete-icon" onClick={handleDelete} disabled={isLoading}>
          🗑️
        </div>
      )}
    </div>
  );
};

export default CustomerCard;