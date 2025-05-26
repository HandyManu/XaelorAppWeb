// MembershipEditModal.jsx - Actualizado para trabajar con el hook (versión simplificada)
import React, { useState, useEffect } from 'react';
import './MembershipEditModal.css';

const MembershipEditModal = ({
    // Estados del formulario
    membershipTier,
    setMembershipTier,
    price,
    setPrice,
    benefits,
    setBenefits,
    discount,
    setDiscount,

    // Funciones
    handleSubmit,
    isLoading,
    isEditing,
    onClose
}) => {
    // Estados locales para el manejo de beneficios
    const [localBenefitsList, setLocalBenefitsList] = useState([]);
    const [newBenefit, setNewBenefit] = useState('');

    // Solo parsear beneficios cuando se abre el modal o cambia isEditing
    useEffect(() => {
        if (benefits && benefits.trim()) {
            const benefitsArray = benefits.split(' - ').filter(b => b.trim());
            setLocalBenefitsList(benefitsArray);
        } else {
            setLocalBenefitsList([]);
        }
    }, [isEditing]); // Solo cuando cambia isEditing

    const handleMembershipTierChange = (e) => {
        setMembershipTier(e.target.value);
    };

    const handlePriceChange = (e) => {
        const priceValue = Math.max(0, parseFloat(e.target.value) || 0);
        setPrice(priceValue);
    };

    const handleDiscountChange = (e) => {
        const discountValue = Math.max(0, Math.min(50, parseFloat(e.target.value) || 0)) / 100;
        setDiscount(discountValue);
    };

    const handleAddBenefit = (e) => {
        e.preventDefault();
        if (newBenefit.trim()) {
            const updatedList = [...localBenefitsList, newBenefit.trim()];
            setLocalBenefitsList(updatedList);
            setNewBenefit('');
        }
    };

    const handleRemoveBenefit = (index) => {
        const updatedList = localBenefitsList.filter((_, i) => i !== index);
        setLocalBenefitsList(updatedList);
    };

    const handleBenefitChange = (e) => {
        setNewBenefit(e.target.value);
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();

        // Validaciones
        if (!membershipTier.trim()) {
            alert('El nombre del tier es obligatorio');
            return;
        }

        if (price <= 0) {
            alert('El precio debe ser mayor a 0');
            return;
        }

        if (discount < 0 || discount > 0.5) {
            alert('El descuento debe estar entre 0% y 50%');
            return;
        }

        if (localBenefitsList.length === 0) {
            alert('Debe agregar al menos un beneficio');
            return;
        }

        // Preparar los datos para el submit
        const formData = {
            membershipTier: membershipTier.trim(),
            price: parseFloat(price),
            benefits: localBenefitsList.join(' - '),
            discount: parseFloat(discount)
        };

        handleSubmit(formData);
    };

    // Función para obtener el color del tier
    const getTierColor = (tier) => {
        const tierLower = tier.toLowerCase();
        
        // Colores para tiers comunes
        const tierColors = {
            'bronze': '#cd7f32',
            'silver': '#c0c0c0', 
            'gold': '#ffd700',
            'platinum': '#e5e4e2',
            'diamond': '#b9f2ff',
            'premium': '#9b59b6',
            'vip': '#e74c3c',
            'elite': '#34495e',
            'ultimate': '#2c3e50',
            'pro': '#27ae60',
            'basic': '#95a5a6',
            'standard': '#3498db',
            'deluxe': '#f39c12',
            'executive': '#8e44ad'
        };
        
        // Si el tier está en la lista, usar su color específico
        if (tierColors[tierLower]) {
            return tierColors[tierLower];
        }
        
        // Para tiers personalizados, generar un color basado en el hash del nombre
        let hash = 0;
        for (let i = 0; i < tier.length; i++) {
            hash = tier.charCodeAt(i) + ((hash << 5) - hash);
        }
        
        // Generar un color dorado/metálico personalizado
        const hue = Math.abs(hash) % 60 + 30; // Entre 30-90 para tonos dorados/verdes
        const saturation = 60 + (Math.abs(hash) % 40); // Entre 60-100%
        const lightness = 45 + (Math.abs(hash) % 20); // Entre 45-65%
        
        return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    };

    return (
        <div className="modal-overlay">
            <div className="modal-container">
                <div className="modal-header">
                    <h2>{isEditing ? 'Editar Membresía' : 'Nueva Membresía'}</h2>
                    <button className="close-button" onClick={onClose}>×</button>
                </div>

                <form onSubmit={handleFormSubmit} className="edit-form">
                    <div className="form-group">
                        <label htmlFor="membershipTier">Nombre del Tier</label>
                        <input
                            type="text"
                            id="membershipTier"
                            name="membershipTier"
                            value={membershipTier}
                            onChange={handleMembershipTierChange}
                            placeholder="Ej: Bronze, Silver, Gold, Premium, VIP..."
                            required
                            disabled={isLoading}
                        />
                        <small className="input-help">
                            Escriba el nombre del tier de membresía
                        </small>
                    </div>

                    <div className="form-group">
                        <label htmlFor="price">Precio Anual</label>
                        <div className="price-input-container">
                            <input
                                type="number"
                                id="price"
                                name="price"
                                value={price}
                                onChange={handlePriceChange}
                                min="0"
                                step="1"
                                required
                                disabled={isLoading}
                            />
                            <span className="price-currency">USD</span>
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="discount">Descuento (%)</label>
                        <div className="discount-input-container">
                            <input
                                type="number"
                                id="discount"
                                name="discount"
                                value={Math.round(discount * 100)}
                                onChange={handleDiscountChange}
                                min="0"
                                max="50"
                                step="5"
                                required
                                disabled={isLoading}
                            />
                            <span className="discount-symbol">%</span>
                        </div>
                        <small className="input-help">
                            Porcentaje de descuento en todas las compras (máximo 50%)
                        </small>
                    </div>

                    <div className="form-group">
                        <label>Beneficios</label>
                        <div className="benefits-manager">
                            <div className="benefit-input-group">
                                <input
                                    type="text"
                                    placeholder="Agregar un beneficio..."
                                    value={newBenefit}
                                    onChange={handleBenefitChange}
                                    onKeyPress={(e) => {
                                        if (e.key === 'Enter') {
                                            handleAddBenefit(e);
                                        }
                                    }}
                                    disabled={isLoading}
                                />
                                <button
                                    type="button"
                                    className="add-benefit-btn"
                                    onClick={handleAddBenefit}
                                    disabled={isLoading}
                                >
                                    +
                                </button>
                            </div>

                            <ul className="benefits-list-edit">
                                {localBenefitsList.map((benefit, index) => (
                                    <li key={index} className="benefit-item-edit">
                                        <span>{benefit}</span>
                                        <button
                                            type="button"
                                            className="remove-benefit-btn"
                                            onClick={() => handleRemoveBenefit(index)}
                                            disabled={isLoading}
                                        >
                                            ×
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {membershipTier && (
                        <div className="preview-section">
                            <h3>Vista Previa</h3>
                            <div
                                className="preview-card"
                                style={{ borderColor: getTierColor(membershipTier) }}
                            >
                                <div
                                    className="preview-header"
                                    style={{ backgroundColor: getTierColor(membershipTier) }}
                                >
                                    {membershipTier}
                                </div>
                                <div className="preview-body">
                                    <div className="preview-price">${price}/año</div>
                                    <div className="preview-discount">{Math.round(discount * 100)}% OFF</div>
                                    {localBenefitsList.length > 0 && (
                                        <ul className="preview-benefits">
                                            {localBenefitsList.map((benefit, index) => (
                                                <li key={index}>✓ {benefit}</li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            </div>
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
                            disabled={isLoading}
                        >
                            {isLoading ? 'Guardando...' : (isEditing ? 'Actualizar Membresía' : 'Crear Membresía')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default MembershipEditModal;