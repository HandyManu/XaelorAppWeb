// DeleteConfirmationModal.jsx
import React from 'react';
import './DeleteConfirmationModal.css';

const DeleteConfirmationModal = ({
    isOpen,
    onClose,
    onConfirm,
    title = "Confirmar Eliminación",
    message = "¿Estás seguro de que deseas eliminar este elemento?",
    itemName = "",
    isLoading = false
}) => {
    if (!isOpen) return null;

    const handleConfirm = () => {
        onConfirm();
    };

    const handleCancel = () => {
        onClose();
    };

    // Cerrar modal al hacer clic en el overlay
    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget && !isLoading) {
            onClose();
        }
    };

    return (
        <div className="modal-overlay" onClick={handleOverlayClick}>
            <div className="delete-confirmation-modal">
                <div className="modal-header">
                    <h3>{title}</h3>
                    {!isLoading && (
                        <button className="close-button" onClick={handleCancel}>
                            ×
                        </button>
                    )}
                </div>

                <div className="modal-body">
                    <div className="warning-icon">
                        ⚠️
                    </div>
                    <p className="confirmation-message">
                        {message}
                    </p>
                    {itemName && (
                        <p className="item-name">
                            <strong>"{itemName}"</strong>
                        </p>
                    )}
                    <p className="warning-text">
                        Esta acción no se puede deshacer y se perderán todos los datos asociados.
                    </p>
                </div>

                <div className="modal-actions">
                    <button
                        className="btn btn-cancel"
                        onClick={handleCancel}
                        disabled={isLoading}
                    >
                        Cancelar
                    </button>
                    <button
                        className="btn btn-delete"
                        onClick={handleConfirm}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <span className="spinner-small"></span>
                                Eliminando...
                            </>
                        ) : (
                            'Eliminar'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteConfirmationModal;