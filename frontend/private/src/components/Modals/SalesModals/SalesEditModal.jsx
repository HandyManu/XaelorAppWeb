// SalesEditModal.jsx
import React, { useState, useEffect } from 'react';
import './SalesEditModal.css';

const SalesEditModal = ({ 
  sale, 
  isOpen, 
  onClose, 
  onSave, 
  customers, 
  employees, 
  products 
}) => {
  const [formData, setFormData] = useState({
    customerId: '',
    employeeId: '',
    address: '',
    reference: '',
    status: 'Processing',
    selectedPaymentMethod: 'Credit Card',
    selectedProducts: [],
    total: 0
  });
  
  const [selectedProduct, setSelectedProduct] = useState('');
  const [productQuantity, setProductQuantity] = useState(1);
  
  useEffect(() => {
    if (sale) {
      // Si se está editando una venta existente, cargar sus datos
      setFormData({
        customerId: sale.customerId?.$oid || sale.customerId || '',
        employeeId: sale.employeeId?.$oid || sale.employeeId || '',
        address: sale.address || '',
        reference: sale.reference || '',
        status: sale.status || 'Processing',
        selectedPaymentMethod: sale.selectedPaymentMethod || 'Credit Card',
        selectedProducts: sale.selectedProducts || [],
        total: sale.total || 0
      });
    } else {
      // Si es una nueva venta, inicializar con valores por defecto
      setFormData({
        customerId: '',
        employeeId: '',
        address: '',
        reference: '',
        status: 'Processing',
        selectedPaymentMethod: 'Credit Card',
        selectedProducts: [],
        total: 0
      });
    }
  }, [sale]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleAddProduct = () => {
    if (!selectedProduct || productQuantity <= 0) {
      alert('Seleccione un producto y cantidad válida');
      return;
    }
    
    const product = products.find(p => 
      (p._id?.$oid || p._id) === selectedProduct
    );
    
    if (!product) return;
    
    const subtotal = product.price * productQuantity;
    
    const newProduct = {
      watchId: { $oid: selectedProduct },
      quantity: productQuantity,
      subtotal: subtotal
    };
    
    const updatedProducts = [...formData.selectedProducts, newProduct];
    const newTotal = updatedProducts.reduce((sum, p) => sum + p.subtotal, 0);
    
    setFormData({
      ...formData,
      selectedProducts: updatedProducts,
      total: newTotal
    });
    
    // Reset selección
    setSelectedProduct('');
    setProductQuantity(1);
  };
  
  const handleRemoveProduct = (index) => {
    const updatedProducts = formData.selectedProducts.filter((_, i) => i !== index);
    const newTotal = updatedProducts.reduce((sum, p) => sum + p.subtotal, 0);
    
    setFormData({
      ...formData,
      selectedProducts: updatedProducts,
      total: newTotal
    });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validaciones
    if (!formData.customerId) {
      alert('Seleccione un cliente');
      return;
    }
    
    if (!formData.employeeId) {
      alert('Seleccione un empleado');
      return;
    }
    
    if (!formData.address.trim()) {
      alert('Ingrese una dirección de entrega');
      return;
    }
    
    if (formData.selectedProducts.length === 0) {
      alert('Agregue al menos un producto');
      return;
    }
    
    // Preparar los datos para el guardado
    const saleData = {
      ...sale, // Mantener el _id si existe
      customerId: { $oid: formData.customerId },
      employeeId: { $oid: formData.employeeId },
      address: formData.address,
      reference: formData.reference,
      status: formData.status,
      selectedPaymentMethod: formData.selectedPaymentMethod,
      selectedProducts: formData.selectedProducts,
      total: formData.total
    };
    
    onSave(saleData);
  };
  
  // Obtener información del producto
  const getProductInfo = (watchId) => {
    const id = watchId?.$oid || watchId;
    return products.find(p => (p._id?.$oid || p._id) === id);
  };
  
  // Formatear precio
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(price);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2>{sale && sale._id ? 'Editar Venta' : 'Nueva Venta'}</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        <form onSubmit={handleSubmit} className="edit-form">
          <div className="form-row">
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
            
            <div className="form-group">
              <label htmlFor="employeeId">Vendedor</label>
              <select
                id="employeeId"
                name="employeeId"
                value={formData.employeeId}
                onChange={handleChange}
                required
              >
                <option value="">Seleccione un vendedor</option>
                {employees.map((employee) => (
                  <option 
                    key={employee._id} 
                    value={employee._id}
                  >
                    {employee.name} - {employee.position}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="address">Dirección de Entrega</label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Dirección completa"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="reference">Referencia</label>
            <input
              type="text"
              id="reference"
              name="reference"
              value={formData.reference}
              onChange={handleChange}
              placeholder="Ej: Casa azul, cerca del parque"
            />
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="status">Estado</label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
              >
                <option value="Processing">En Proceso</option>
                <option value="Shipped">Enviado</option>
                <option value="Delivered">Entregado</option>
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="selectedPaymentMethod">Método de Pago</label>
              <select
                id="selectedPaymentMethod"
                name="selectedPaymentMethod"
                value={formData.selectedPaymentMethod}
                onChange={handleChange}
                required
              >
                <option value="Credit Card">Tarjeta de Crédito</option>
                <option value="Debit Card">Tarjeta de Débito</option>
                <option value="PayPal">PayPal</option>
                <option value="Cash">Efectivo</option>
              </select>
            </div>
          </div>
          
          <div className="products-section-modal">
            <h3>Productos</h3>
            
            <div className="add-product-form">
              <select
                value={selectedProduct}
                onChange={(e) => setSelectedProduct(e.target.value)}
              >
                <option value="">Seleccione un producto</option>
                {products.map((product) => (
                  <option 
                    key={product._id?.$oid || product._id} 
                    value={product._id?.$oid || product._id}
                  >
                    {product.model} - {formatPrice(product.price)}
                  </option>
                ))}
              </select>
              
              <input
                type="number"
                value={productQuantity}
                onChange={(e) => setProductQuantity(parseInt(e.target.value) || 1)}
                min="1"
                placeholder="Cantidad"
              />
              
              <button 
                type="button" 
                className="add-product-btn"
                onClick={handleAddProduct}
              >
                Agregar
              </button>
            </div>
            
            <div className="selected-products-list">
              {formData.selectedProducts.map((product, index) => {
                const productInfo = getProductInfo(product.watchId);
                
                return (
                  <div key={index} className="selected-product-item">
                    <span className="product-info">
                      {productInfo?.model || 'Producto'} x{product.quantity}
                    </span>
                    <span className="product-subtotal">
                      {formatPrice(product.subtotal)}
                    </span>
                    <button
                      type="button"
                      className="remove-product-btn"
                      onClick={() => handleRemoveProduct(index)}
                    >
                      ×
                    </button>
                  </div>
                );
              })}
            </div>
            
            <div className="total-section">
              <span>Total:</span>
              <span className="total-amount">{formatPrice(formData.total)}</span>
            </div>
          </div>
          
          <div className="form-actions">
            <button type="button" className="cancel-button" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="save-button">
              {sale && sale._id ? 'Actualizar Venta' : 'Crear Venta'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SalesEditModal;