// InventoryEditModal.jsx - Actualizado para trabajar con el hook
import React from 'react';
import './InventoryEditModal.css';

const InventoryEditModal = ({
    // Estados del formulario
    watchId,
    setWatchId,
    branchId,
    setBranchId,
    stockChange,
    setStockChange,
    operation,
    setOperation,
    notes,
    setNotes,
    currentStock,
    watches,
    branches,

    // Funciones
    handleSubmit,
    isLoading,
    isEditing,
    onClose
}) => {

    const handleFormSubmit = (e) => {
        e.preventDefault();

        // Validaciones
        if (!isEditing && !watchId) {
            alert('Por favor, seleccione un reloj');
            return;
        }

        if (!isEditing && !branchId) {
            alert('Por favor, seleccione una sucursal');
            return;
        }

        if (stockChange === 0 || stockChange < 0) {
            alert('Por favor, ingrese una cantidad mayor a 0');
            return;
        }

        // Calcular el nuevo stock para validaciones en edición
        if (isEditing) {
            const newStock = operation === 'add'
                ? currentStock + stockChange
                : currentStock - stockChange;

            // Validar que no quede stock negativo
            if (newStock < 0) {
                alert('No se puede restar más stock del disponible');
                return;
            }
        }

        // Preparar los datos para el submit
        const formData = {
            watchId,
            branchId,
            stockChange,
            operation,
            notes: notes.trim()
        };

        handleSubmit(formData);
    };

    // Función para obtener información del reloj seleccionado
    const getSelectedWatchInfo = () => {
        return watches.find(w => w._id === watchId);
    };

    // Función para obtener información de la sucursal seleccionada
    const getSelectedBranchInfo = () => {
        return branches.find(b => b._id === branchId);
    };

    const selectedWatch = getSelectedWatchInfo();
    const selectedBranch = getSelectedBranchInfo();

    // Calcular el stock proyectado
    const projectedStock = isEditing
        ? (operation === 'add' ? currentStock + stockChange : currentStock - stockChange)
        : stockChange; // Para nuevo inventario, el stockChange es el stock inicial

    return (
        <div className="modal-overlay">
            <div className="modal-container">
                <div className="modal-header">
                    <h2>
                        {isEditing ? 'Ajustar Inventario' : 'Nuevo Registro de Inventario'}
                    </h2>
                    <button className="close-button" onClick={onClose}>×</button>
                </div>

                <form onSubmit={handleFormSubmit} className="edit-form">
                    {!isEditing && (
                        <>
                            <div className="form-group">
                                <label htmlFor="watchId">Reloj</label>
                                <select
                                    id="watchId"
                                    name="watchId"
                                    value={watchId}
                                    onChange={(e) => setWatchId(e.target.value)}
                                    required
                                    disabled={isLoading}
                                >
                                    <option value="">Seleccione un reloj</option>
                                    {watches && watches.map((watch) => (
                                        <option key={watch._id} value={watch._id}>
                                            {watch.model} - ${watch.price?.toLocaleString()}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label htmlFor="branchId">Sucursal</label>
                                <select
                                    id="branchId"
                                    name="branchId"
                                    value={branchId}
                                    onChange={(e) => setBranchId(e.target.value)}
                                    required
                                    disabled={isLoading}
                                >
                                    <option value="">Seleccione una sucursal</option>
                                    {branches && branches.map((branch) => (
                                        <option key={branch._id} value={branch._id}>
                                            {branch.branch_name || branch.address} - {branch.country}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </>
                    )}

                    {isEditing && selectedWatch && selectedBranch && (
                        <div className="current-inventory-info">
                            <div className="info-header">Información Actual del Inventario</div>
                            <div className="info-grid">
                                <div className="info-item">
                                    <span className="info-label">Reloj:</span>
                                    <span className="info-value">{selectedWatch.model}</span>
                                </div>
                                <div className="info-item">
                                    <span className="info-label">Sucursal:</span>
                                    <span className="info-value">{selectedBranch.branch_name || selectedBranch.address}</span>
                                </div>
                                <div className="info-item">
                                    <span className="info-label">Stock Actual:</span>
                                    <span className="info-value highlight">{currentStock} unidades</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {isEditing && (
                        <div className="form-group">
                            <label>Tipo de Operación</label>
                            <div className="operation-selector">
                                <label className={`operation-option ${operation === 'add' ? 'active' : ''}`}>
                                    <input
                                        type="radio"
                                        name="operation"
                                        value="add"
                                        checked={operation === 'add'}
                                        onChange={(e) => setOperation(e.target.value)}
                                        disabled={isLoading}
                                    />
                                    <span className="operation-icon">+</span>
                                    <span>Agregar Stock</span>
                                </label>

                                <label className={`operation-option ${operation === 'subtract' ? 'active' : ''}`}>
                                    <input
                                        type="radio"
                                        name="operation"
                                        value="subtract"
                                        checked={operation === 'subtract'}
                                        onChange={(e) => setOperation(e.target.value)}
                                        disabled={isLoading}
                                    />
                                    <span className="operation-icon">-</span>
                                    <span>Restar Stock</span>
                                </label>
                            </div>
                        </div>
                    )}

                    <div className="form-group">
                        <label htmlFor="stockChange">
                            {isEditing ? 'Cantidad' : 'Stock Inicial'}
                        </label>
                        <div className="stock-input-container">
                            <input
                                type="number"
                                id="stockChange"
                                name="stockChange"
                                value={stockChange}
                                onChange={(e) => setStockChange(Math.max(0, parseInt(e.target.value) || 0))}
                                min="0"
                                required
                                disabled={isLoading}
                            />
                            <span className="stock-units">unidades</span>
                        </div>
                    </div>

                    {stockChange > 0 && (
                        <div className="stock-preview-section">
                            <div className="preview-title">
                                {isEditing ? 'Resumen de la Operación' : 'Stock Inicial'}
                            </div>
                            <div className="operation-summary">
                                {isEditing && (
                                    <>
                                        <div className="summary-item">
                                            <span>Stock Actual:</span>
                                            <span>{currentStock}</span>
                                        </div>
                                        <div className="summary-item operation">
                                            <span>{operation === 'add' ? '+' : '-'}</span>
                                            <span>{stockChange}</span>
                                        </div>
                                    </>
                                )}
                                <div className="summary-item result">
                                    <span>Stock {isEditing ? 'Final' : 'Inicial'}:</span>
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

                    {isEditing && (
                        <div className="form-group">
                            <label htmlFor="notes">Notas (opcional)</label>
                            <textarea
                                id="notes"
                                name="notes"
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="Razón del ajuste de inventario..."
                                disabled={isLoading}
                                rows="3"
                            />
                        </div>
                    )}

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
                            disabled={isLoading || (isEditing && projectedStock < 0)}
                        >
                            {isLoading ? 'Guardando...' : (isEditing ? 'Aplicar Cambio' : 'Crear Registro')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default InventoryEditModal;