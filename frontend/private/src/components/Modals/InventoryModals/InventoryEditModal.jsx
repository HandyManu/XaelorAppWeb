// InventoryEditModal.jsx
import React, { useState, useEffect } from 'react';
import './InventoryEditModal.css';

const InventoryEditModal = ({ inventory, isOpen, onClose, onSave, watches, branches }) => {
    const [formData, setFormData] = useState({
        watchId: '',
        branchId: '',
        stockChange: 0,
        operation: 'add', // 'add' o 'subtract'
        notes: ''
    });

    const [currentStock, setCurrentStock] = useState(0);

    useEffect(() => {
        if (inventory) {
            // Si se está editando un inventario existente, cargar sus datos
            setFormData({
                watchId: inventory.watchId?.$oid || inventory.watchId || '',
                branchId: inventory.branchId?.$oid || inventory.branchId || '',
                stockChange: 0,
                operation: 'add',
                notes: ''
            });
            setCurrentStock(inventory.stock || 0);
        } else {
            // Si es un nuevo inventario, inicializar con valores por defecto
            setFormData({
                watchId: '',
                branchId: '',
                stockChange: 0,
                operation: 'add',
                notes: ''
            });
            setCurrentStock(0);
        }
    }, [inventory]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === 'stockChange') {
            // Asegurar que el cambio de stock sea un número positivo
            const changeValue = Math.max(0, parseInt(value) || 0);
            setFormData({
                ...formData,
                [name]: changeValue
            });
        } else {
            setFormData({
                ...formData,
                [name]: value
            });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validaciones
        if (!formData.watchId) {
            alert('Por favor, seleccione un reloj');
            return;
        }

        if (!formData.branchId) {
            alert('Por favor, seleccione una sucursal');
            return;
        }

        if (formData.stockChange === 0) {
            alert('Por favor, ingrese una cantidad mayor a 0');
            return;
        }

        // Calcular el nuevo stock
        const newStock = formData.operation === 'add'
            ? currentStock + formData.stockChange
            : currentStock - formData.stockChange;

        // Validar que no quede stock negativo
        if (newStock < 0) {
            alert('No se puede restar más stock del disponible');
            return;
        }

        // Preparar los datos para el guardado
        const inventoryData = {
            ...inventory, // Mantener el _id si existe
            watchId: { $oid: formData.watchId },
            branchId: { $oid: formData.branchId },
            stock: newStock,
            lastOperation: {
                type: formData.operation,
                quantity: formData.stockChange,
                notes: formData.notes,
                date: new Date().toISOString()
            }
        };

        onSave(inventoryData);
    };

    // Función para obtener información del reloj seleccionado
    const getSelectedWatchInfo = () => {
        const selectedWatch = watches.find(w =>
            (w._id?.$oid || w._id) === formData.watchId
        );
        return selectedWatch;
    };

    // Función para obtener información de la sucursal seleccionada
    const getSelectedBranchInfo = () => {
        const selectedBranch = branches.find(b =>
            (b._id?.$oid || b._id) === formData.branchId
        );
        return selectedBranch;
    };

    const selectedWatch = getSelectedWatchInfo();
    const selectedBranch = getSelectedBranchInfo();

    // Calcular el stock proyectado
    const projectedStock = formData.operation === 'add'
        ? currentStock + formData.stockChange
        : currentStock - formData.stockChange;

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-container">
                <div className="modal-header">
                    <h2>
                        {inventory && inventory._id ? 'Ajustar Inventario' : 'Nuevo Registro de Inventario'}
                    </h2>
                    <button className="close-button" onClick={onClose}>×</button>
                </div>

                <form onSubmit={handleSubmit} className="edit-form">
                    {!inventory && (
                        <>
                            <div className="form-group">
                                <label htmlFor="watchId">Reloj</label>
                                <select
                                    id="watchId"
                                    name="watchId"
                                    value={formData.watchId}
                                    onChange={handleChange}
                                    required
                                    disabled={inventory !== null}
                                >
                                    <option value="">Seleccione un reloj</option>
                                    {watches.map((watch) => (
                                        <option key={watch._id?.$oid || watch._id} value={watch._id?.$oid || watch._id}>
                                            {watch.model} - ${watch.price}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label htmlFor="branchId">Sucursal</label>
                                <select
                                    id="branchId"
                                    name="branchId"
                                    value={formData.branchId}
                                    onChange={handleChange}
                                    required
                                    disabled={inventory !== null}
                                >
                                    <option value="">Seleccione una sucursal</option>
                                    {branches.map((branch) => (
                                        <option key={branch._id?.$oid || branch._id} value={branch._id?.$oid || branch._id}>
                                            {branch.address} - {branch.city}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </>
                    )}

                    {inventory && selectedWatch && selectedBranch && (
                        <div className="current-inventory-info">
                            <div className="info-header">Información Actual del Inventario</div>
                            <div className="info-grid">
                                <div className="info-item">
                                    <span className="info-label">Reloj:</span>
                                    <span className="info-value">{selectedWatch.model}</span>
                                </div>
                                <div className="info-item">
                                    <span className="info-label">Sucursal:</span>
                                    <span className="info-value">{selectedBranch.address}</span>
                                </div>
                                <div className="info-item">
                                    <span className="info-label">Stock Actual:</span>
                                    <span className="info-value highlight">{currentStock} unidades</span>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="form-group">
                        <label>Tipo de Operación</label>
                        <div className="operation-selector">
                            <label className={`operation-option ${formData.operation === 'add' ? 'active' : ''}`}>
                                <input
                                    type="radio"
                                    name="operation"
                                    value="add"
                                    checked={formData.operation === 'add'}
                                    onChange={handleChange}
                                />
                                <span className="operation-icon">+</span>
                                <span>Agregar Stock</span>
                            </label>

                            <label className={`operation-option ${formData.operation === 'subtract' ? 'active' : ''}`}>
                                <input
                                    type="radio"
                                    name="operation"
                                    value="subtract"
                                    checked={formData.operation === 'subtract'}
                                    onChange={handleChange}
                                />
                                <span className="operation-icon">-</span>
                                <span>Restar Stock</span>
                            </label>
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="stockChange">Cantidad</label>
                        <div className="stock-input-container">
                            <input
                                type="number"
                                id="stockChange"
                                name="stockChange"
                                value={formData.stockChange}
                                onChange={handleChange}
                                min="0"
                                required
                            />
                            <span className="stock-units">unidades</span>
                        </div>
                    </div>



                    {formData.stockChange > 0 && (
                        <div className="stock-preview-section">
                            <div className="preview-title">Resumen de la Operación</div>
                            <div className="operation-summary">
                                <div className="summary-item">
                                    <span>Stock Actual:</span>
                                    <span>{currentStock}</span>
                                </div>
                                <div className="summary-item operation">
                                    <span>{formData.operation === 'add' ? '+' : '-'}</span>
                                    <span>{formData.stockChange}</span>
                                </div>
                                <div className="summary-item result">
                                    <span>Stock Final:</span>
                                    <span className={projectedStock < 0 ? 'error' : 'success'}>
                                        {projectedStock}
                                    </span>
                                </div>
                            </div>
                            {projectedStock < 0 && (
                                <div className="error-message">
                                    ⚠️ El stock final no puede ser negativo
                                </div>
                            )}
                        </div>
                    )}

                    <div className="form-actions">
                        <button type="button" className="cancel-button" onClick={onClose}>
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="save-button"
                            disabled={projectedStock < 0}
                        >
                            {inventory && inventory._id ? 'Aplicar Cambio' : 'Crear Registro'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default InventoryEditModal;