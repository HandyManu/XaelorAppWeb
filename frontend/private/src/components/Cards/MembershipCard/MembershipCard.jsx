// MembershipCard.jsx
import React, { useState } from 'react';
import './MembershipCard.css';

const MembershipCard = ({ data, onEdit, onDelete }) => {
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
  
  // Función para formatear el precio
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };
  
  // Función para obtener el color del tier
  const getTierColor = (tier) => {
    switch(tier.toLowerCase()) {
      case 'bronze':
        return '#cd7f32';
      case 'silver':
        return '#c0c0c0';
      case 'gold':
        return '#ffd700';
      default:
        return '#e6c068';
    }
  };
  
  // Función para obtener el icono del tier
  const getTierIcon = (tier) => {
    switch(tier.toLowerCase()) {
      case 'bronze':
        return '🥉';
      case 'silver':
        return '🥈';
      case 'gold':
        return '🥇';
      default:
        return '⭐';
    }
  };
  
  // Formatear el porcentaje de descuento
  const formatDiscount = (discount) => {
    return `${Math.round(discount * 100)}%`;
  };
  
  // Parsear los beneficios
  const parseBenefits = (benefits) => {
    if (!benefits) return [];
    return benefits.split(' - ').filter(benefit => benefit.trim() !== '');
  };
  
  const tierColor = getTierColor(data.membershipTier);
  const benefits = parseBenefits(data.benefits);
  
  return (
    <div 
      className="membership-card"
      onClick={handleClick}
      onMouseEnter={() => setShowDeleteIcon(true)}
      onMouseLeave={() => setShowDeleteIcon(false)}
      style={{
        borderColor: tierColor
      }}
    >
      <div className="membership-header" style={{ backgroundColor: tierColor }}>
        <div className="tier-icon">{getTierIcon(data.membershipTier)}</div>
        <h3 className="tier-name">{data.membershipTier}</h3>
      </div>
      
      <div className="membership-body">
        <div className="membership-price">
          <span className="price-value">{formatPrice(data.price)}</span>
          <span className="price-period">/ año</span>
        </div>
        
        <div className="discount-badge" style={{ borderColor: tierColor, color: tierColor }}>
          {formatDiscount(data.discount)} OFF
        </div>
        
        <div className="benefits-section">
          <h4 className="benefits-title">Beneficios</h4>
          <ul className="benefits-list">
            {benefits.map((benefit, index) => (
              <li key={index} className="benefit-item">
                <span className="benefit-icon" style={{ color: tierColor }}>✓</span>
                {benefit}
              </li>
            ))}
          </ul>
        </div>
        
        <div className="membership-footer">
          <div className="member-count">
            <span className="count-label">Miembros activos</span>
            <span className="count-value">--</span>
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

export default MembershipCard;