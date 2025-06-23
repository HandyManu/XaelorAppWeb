// SalesEditModal.jsx - Actualizado para trabajar con el hook
import React, { useState } from 'react';
import './SalesEditModal.css';

const SalesEditModal = ({
    // Estados del formulario
    customerId,
    setCustomerId,
    employeeId,
    setEmployeeId,
    address,
    setAddress,
    reference,
    setReference,
    status,
    setStatus,
    selectedPaymentMethod,
    setSelectedPaymentMethod,
    selectedProducts,
    setSelectedProducts,
    total,
    setTotal,
    customers,
    employees,
    products,

    // Funciones
    handleSubmit,
    isLoading,
    isEditing,
    onClose
}) => {
    // Estados locales para agregar productos
    const [selectedProduct, setSelectedProduct] = useState('');
    const [productQuantity, setProductQuantity] = useState(1);

    const handleFormSubmit = (e) => {
        e.preventDefault();

        // Validaciones
        if (!customerId) {
            alert('Por favor, seleccione un cliente');
            return;
        }

        if (!employeeId) {
            alert('Por favor, seleccione un empleado');
            return;
        }

        if (!address || address.trim() === '') {
            alert('Por favor, ingrese una dirección de entrega');
            return;
        }

        if (selectedProducts.length === 0) {
            alert('Por favor, agregue al menos un producto');
            return;
        }

        if (total <= 0) {
            alert('El total debe ser mayor a 0');
            return;
        }

        // Preparar los datos para el submit
        const formData = {
            customerId,
            employeeId,
            address: address.trim(),
            reference: reference.trim(),
            status,
            selectedPaymentMethod,
            selectedProducts,
            total
        };

        handleSubmit(formData);
    };

    // Función para agregar un producto a la lista
    const handleAddProduct = () => {
        if (!selectedProduct || productQuantity <= 0) {
            alert('Seleccione un producto y cantidad válida');
            return;
        }
        
        const product = products.find(p => p._id === selectedProduct);
        
        if (!product) {
            alert('Producto no encontrado');
            return;
        }
        
        // Verificar si el producto ya está en la lista
        const existingProductIndex = selectedProducts.findIndex(p => 
            (p.watchId?._id || p.watchId) === selectedProduct
        );
        
        if (existingProductIndex !== -1) {
            // Si ya existe, actualizar la cantidad
            const updatedProducts = [...selectedProducts];
            updatedProducts[existingProductIndex].quantity += productQuantity;
            updatedProducts[existingProductIndex].subtotal = 
                updatedProducts[existingProductIndex].quantity * product.price;
            
            setSelectedProducts(updatedProducts);
        } else {
            // Si no existe, agregar nuevo producto
            const subtotal = product.price * productQuantity;
            
            const newProduct = {
                watchId: selectedProduct,
                quantity: productQuantity,
                subtotal: subtotal
            };
            
            setSelectedProducts([...selectedProducts, newProduct]);
        }
        
        // Recalcular el total
        const newTotal = selectedProducts.reduce((sum, p) => {
            if ((p.watchId?._id || p.watchId) === selectedProduct) {
                return sum + (product.price * (p.quantity + productQuantity));
            }
            return sum + p.subtotal;
        }, 0);
        
        if (selectedProducts.findIndex(p => (p.watchId?._id || p.watchId) === selectedProduct) === -1) {
            setTotal(newTotal + (product.price * productQuantity));
        } else {
            setTotal(newTotal);
        }
        
        // Reset selección
        setSelectedProduct('');
        setProductQuantity(1);
    };
    
    // Función para remover un producto de la lista
    const handleRemoveProduct = (index) => {
        const updatedProducts = selectedProducts.filter((_, i) => i !== index);
        setSelectedProducts(updatedProducts);
        
        // Recalcular el total
        const newTotal = updatedProducts.reduce((sum, p) => sum + p.subtotal, 0);
        setTotal(newTotal);
    };

    // Función para obtener información del producto
    const getProductInfo = (watchId) => {
        const id = watchId?._id || watchId;
        return products.find(p => p._id === id);
    };
    
    // Formatear precio
    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0
        }).format(price);
    };

    // Función para obtener icono del método de pago
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

    return (
        <div className="modal-overlay">
            <div className="modal-container">
                <div className="modal-header">
                    <h2>
                        {isEditing ? 'Editar Venta' : 'Nueva Venta'}
                    </h2>
                    <button className="close-button" onClick={onClose}>×</button>
                </div>

                <form onSubmit={handleFormSubmit} className="edit-form">
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="customerId">Cliente</label>
                            <select
                                id="customerId"
                                name="customerId"
                                value={customerId}
                                onChange={(e) => setCustomerId(e.target.value)}
                                required
                                disabled={isLoading}
                            >
                                <option value="">Seleccione un cliente</option>
                                {customers && customers.map((customer) => (
                                    <option key={customer._id} value={customer._id}>
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
                                value={employeeId}
                                onChange={(e) => setEmployeeId(e.target.value)}
                                required
                                disabled={isLoading}
                            >
                                <option value="">Seleccione un vendedor</option>
                                {employees && employees.map((employee) => (
                                    <option key={employee._id} value={employee._id}>
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
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            placeholder="Dirección completa"
                            required
                            disabled={isLoading}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="reference">Referencia</label>
                        <input
                            type="text"
                            id="reference"
                            name="reference"
                            value={reference}
                            onChange={(e) => setReference(e.target.value)}
                            placeholder="Ej: Casa azul, cerca del parque"
                            disabled={isLoading}
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="status">Estado</label>
                            <select
                                id="status"
                                name="status"
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                required
                                disabled={isLoading}
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
                                value={selectedPaymentMethod}
                                onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                                required
                                disabled={isLoading}
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
                                disabled={isLoading}
                            >
                                <option value="">Seleccione un producto</option>
                                {products && products.map((product) => (
                                    <option key={product._id} value={product._id}>
                                        {product.model} - {formatPrice(product.price)}
                                    </option>
                                ))}
                            </select>
                            
                            <input
                                type="number"
                                value={productQuantity}
                                onChange={(e) => setProductQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                                min="1"
                                placeholder="Cantidad"
                                disabled={isLoading}
                            />
                            
                            <button 
                                type="button" 
                                className="add-product-btn"
                                onClick={handleAddProduct}
                                disabled={isLoading}
                            >
                                Agregar
                            </button>
                        </div>
                        
                        <div className="selected-products-list">
                            {selectedProducts.map((product, index) => {
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
                                            disabled={isLoading}
                                        >
                                            ×
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                        
                        <div className="total-section">
                            <span>Total:</span>
                            <span className="total-amount">{formatPrice(total)}</span>
                        </div>
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
                            disabled={isLoading || selectedProducts.length === 0 || total <= 0}
                        >
                            {isLoading ? 'Guardando...' : (isEditing ? 'Actualizar Venta' : 'Crear Venta')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SalesEditModal;