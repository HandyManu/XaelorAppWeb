// CustomerCard.jsx
import React, { useState } from 'react';
import './CustomerCard.css';

const CustomerCard = ({ data, onEdit, onDelete }) => {
  const [showDeleteIcon, setShowDeleteIcon] = useState(false);
  
  const handleClick = () => {
    if (onEdit) {
      onEdit(data);
    }
  };
  
  const handleDelete = (e) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(data._id);
    }
  };
  
  // Función para formatear la fecha
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  // Función para determinar el tipo de membresía
  const getMembershipType = (membershipId) => {
    if (!membershipId) return 'Sin membresía';
    
    // Para esta demo, asignaremos nombres basados en los IDs proporcionados
    switch(membershipId.$oid) {
      case '67acd69ae1fa12d45243dc76':
        return 'Bronze';
      case '67acd69ae1fa12d45243dc77':
        return 'Silver';
      case '67acd69ae1fa12d45243dc78':
        return 'Gold';
      default:
        return 'Estándar';
    }
  };
  
  // Función para determinar el color de la tarjeta según la membresía
  const getMembershipColor = (membershipId) => {
    if (!membershipId) return '#1a1a1a'; // Color base para sin membresía
    
    switch(membershipId.$oid) {
      case '67acd69ae1fa12d45243dc76':
        return 'linear-gradient(135deg, #cd7f32 0%, #1a1a1a 80%)';
      case '67acd69ae1fa12d45243dc77':
        return 'linear-gradient(135deg, #c0c0c0 0%, #1a1a1a 80%)';
      case '67acd69ae1fa12d45243dc78':
        return 'linear-gradient(135deg, #ffd700 0%, #1a1a1a 80%)';
      default:
        return '#1a1a1a';
    }
  };
  
  return (
    <div 
      className="customer-card"
      onClick={handleClick}
      onMouseEnter={() => setShowDeleteIcon(true)}
      onMouseLeave={() => setShowDeleteIcon(false)}
      style={{
        background: getMembershipColor(data.membership?.membershipId)
      }}
    >
      <div className="customer-avatar">
        {data.name.charAt(0).toUpperCase()}
      </div>
      
      <div className="customer-info">
        <div className="customer-name">{data.name}</div>
        
        <div className="customer-email">
          <i className="email-icon">✉</i> {data.email}
        </div>
        
        <div className="customer-phone">
          <i className="phone-icon">☏</i> {data.phone}
        </div>
        
        <div className="customer-membership">
          <div className="membership-badge">
            {getMembershipType(data.membership?.membershipId)}
          </div>
          <div className="membership-date">
            Desde: {formatDate(data.membership?.startDate?.$date)}
          </div>
        </div>
      </div>
      
      {showDeleteIcon && (
        <div className="delete-icon" onClick={handleDelete}>
          🗑️
        </div>
      )}
    </div>
  );
};

export default CustomerCard;