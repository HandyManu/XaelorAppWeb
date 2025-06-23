// SalesCard.jsx
import React, { useState } from 'react';
import './SalesCard.css';

const SalesCard = ({ 
  data, 
  customerInfo, 
  employeeInfo, 
  productsInfo, 
  onEdit, 
  onDelete 
}) => {
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
  
  // Obtener el color del estado
  const getStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'delivered':
        return '#2ed573';
      case 'shipped':
        return '#ffa502';
      case 'processing':
        return '#4834d4';
      default:
        return '#95afc0';
    }
  };
  
  // Formatear precio
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(price);
  };
  
  // Formatear fecha
  const formatDate = (dateString) => {
    if (!dateString) return 'Sin fecha';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  // Obtener icono del método de pago
  const getPaymentIcon = (method) => {
    switch(method?.toLowerCase()) {
      case 'credit card':
        return '💳';
      case 'debit card':
        return '💳';
      case 'paypal':
        return '🅿️';
      case 'cash':
        return '💵';
      default:
        return '💰';
    }
  };
  
  // Calcular cantidad total de productos
  const getTotalItems = () => {
    return data.selectedProducts?.reduce((sum, product) => sum + product.quantity, 0) || 0;
  };
  
  const statusColor = getStatusColor(data.status);
  
  return (
    <div 
      className="sales-card"
      onClick={handleClick}
      onMouseEnter={() => setShowDeleteIcon(true)}
      onMouseLeave={() => setShowDeleteIcon(false)}
    >
      <div className="sales-header">
        <div className="order-info">
          <span className="order-number">#{data._id?.slice(-6) || '000000'}</span>
          <span className="order-date">{formatDate(data.createdAt?.$date)}</span>
        </div>
        <div 
          className="status-badge"
          style={{ backgroundColor: statusColor }}
        >
          {data.status}
        </div>
      </div>
      
      <div className="sales-body">
        <div className="customer-section">
          <div className="section-title">Cliente</div>
          <div className="customer-details">
            <div className="customer-name">
              {customerInfo?.name || 'Cliente desconocido'}
            </div>
            <div className="customer-email">
              {customerInfo?.email}
            </div>
          </div>
        </div>
        
        <div className="employee-section">
          <div className="section-title">Vendedor</div>
          <div className="employee-name">
            {employeeInfo?.name || 'Empleado no asignado'}
          </div>
        </div>
        
        <div className="delivery-section">
          <div className="section-title">Entrega</div>
          <div className="address">{data.address}</div>
          <div className="reference">{data.reference}</div>
        </div>
        
        <div className="products-section">
          <div className="section-title">Productos</div>
          <div className="products-list">
            {data.selectedProducts?.map((product, index) => {
              const productInfo = productsInfo?.find(p => 
                (p._id === product.watchId?.$oid) || (p._id === product.watchId)
              );
              
              return (
                <div key={index} className="product-item">
                  <span className="product-name">
                    {productInfo?.model || 'Producto'}
                  </span>
                  <span className="product-quantity">x{product.quantity}</span>
                  <span className="product-subtotal">
                    {formatPrice(product.subtotal)}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="products-summary">
            <span>Total productos: {getTotalItems()}</span>
          </div>
        </div>
        
        <div className="payment-section">
          <div className="payment-method">
            <span className="payment-icon">
              {getPaymentIcon(data.selectedPaymentMethod)}
            </span>
            <span>{data.selectedPaymentMethod}</span>
          </div>
          <div className="total-amount">
            {formatPrice(data.total)}
          </div>
        </div>
      </div>
      
      {showDeleteIcon && (
        <div className="delete-icon" onClick={handleDelete}>
          <img src="/basura.svg" alt="Delete Icon" className="delete-icon-img" />
        </div>
      )}
    </div>
  );
};

export default SalesCard;