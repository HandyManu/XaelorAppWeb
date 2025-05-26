// MembershipEditModal.jsx
import React, { useState, useEffect } from 'react';
import './MembershipEditModal.css';

const MembershipEditModal = ({ membership, isOpen, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        membershipTier: '',
        price: 0,
        benefits: '',
        discount: 0
    });

    const [benefitsList, setBenefitsList] = useState([]);
    const [newBenefit, setNewBenefit] = useState('');

    useEffect(() => {
        if (membership) {
            // Si se está editando una membresía existente, cargar sus datos
            setFormData({
                membershipTier: membership.membershipTier || '',
                price: membership.price || 0,
                benefits: membership.benefits || '',
                discount: membership.discount || 0
            });

            // Parsear los beneficios existentes
            if (membership.benefits) {
                const benefits = membership.benefits.split(' - ').filter(b => b.trim());
                setBenefitsList(benefits);
            } else {
                setBenefitsList([]);
            }
        } else {
            // Si es una nueva membresía, inicializar con valores por defecto
            setFormData({
                membershipTier: '',
                price: 0,
                benefits: '',
                discount: 0
            });
            setBenefitsList([]);
        }
    }, [membership]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === 'price') {
            const priceValue = Math.max(0, parseFloat(value) || 0);
            setFormData({
                ...formData,
                [name]: priceValue
            });
        } else if (name === 'discount') {
            // Asegurar que el descuento esté entre 0 y 1
            const discountValue = Math.max(0, Math.min(1, parseFloat(value) || 0));
            setFormData({
                ...formData,
                [name]: discountValue
            });
        } else {
            setFormData({
                ...formData,
                [name]: value
            });
        }
    };

    const handleAddBenefit = (e) => {
        e.preventDefault();
        if (newBenefit.trim()) {
            setBenefitsList([...benefitsList, newBenefit.trim()]);
            setNewBenefit('');
        }
    };

    const handleRemoveBenefit = (index) => {
        setBenefitsList(benefitsList.filter((_, i) => i !== index));
    };

    const handleBenefitChange = (e) => {
        setNewBenefit(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validaciones
        if (!formData.membershipTier.trim()) {
            alert('El nombre del tier es obligatorio');
            return;
        }

        if (formData.price <= 0) {
            alert('El precio debe ser mayor a 0');
            return;
        }

        if (formData.discount < 0 || formData.discount > 1) {
            alert('El descuento debe estar entre 0 y 1 (0% - 100%)');
            return;
        }

        if (benefitsList.length === 0) {
            alert('Debe agregar al menos un beneficio');
            return;
        }

        // Convertir la lista de beneficios al formato esperado
        const benefitsString = benefitsList.join(' - ');

        // Preparar los datos para el guardado
        const membershipData = {
            ...membership, // Mantener el _id si existe
            membershipTier: formData.membershipTier,
            price: parseFloat(formData.price),
            benefits: benefitsString,
            discount: parseFloat(formData.discount)
        };

        onSave(membershipData);
    };

    // Función para obtener el color del tier
    const getTierColor = (tier) => {
        switch (tier.toLowerCase()) {
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

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-container">
                <div className="modal-header">
                    <h2>{membership && membership._id ? 'Editar Membresía' : 'Nueva Membresía'}</h2>
                    <button className="close-button" onClick={onClose}>×</button>
                </div>

                <form onSubmit={handleSubmit} className="edit-form">
                    <div className="form-group">
                        <label htmlFor="membershipTier">Nombre del Tier</label>
                        <select
                            id="membershipTier"
                            name="membershipTier"
                            value={formData.membershipTier}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Seleccione un tier</option>
                            <option value="Bronze">Bronze</option>
                            <option value="Silver">Silver</option>
                            <option value="Gold">Gold</option>
                            <option value="Platinum">Platinum</option>
                            <option value="Diamond">Diamond</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="price">Precio Anual</label>
                        <div className="price-input-container">
                            <input
                                type="number"
                                id="price"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                min="0"
                                step="1"
                                required
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
                                value={Math.round(formData.discount * 100)}
                                onChange={(e) => handleChange({
                                    target: {
                                        name: 'discount',
                                        value: e.target.value / 100
                                    }
                                })}
                                min="0"
                                max="100"
                                step="5"
                                required
                            />
                            <span className="discount-symbol">%</span>
                        </div>
                        <small className="input-help">
                            Porcentaje de descuento en todas las compras
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
                                />
                                <button
                                    type="button"
                                    className="add-benefit-btn"
                                    onClick={handleAddBenefit}
                                >
                                    +
                                </button>
                            </div>

                            <ul className="benefits-list-edit">
                                {benefitsList.map((benefit, index) => (
                                    <li key={index} className="benefit-item-edit">
                                        <span>{benefit}</span>
                                        <button
                                            type="button"
                                            className="remove-benefit-btn"
                                            onClick={() => handleRemoveBenefit(index)}
                                        >
                                            ×
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {formData.membershipTier && (
                        <div className="preview-section">
                            <h3>Vista Previa</h3>
                            <div
                                className="preview-card"
                                style={{ borderColor: getTierColor(formData.membershipTier) }}
                            >
                                <div
                                    className="preview-header"
                                    style={{ backgroundColor: getTierColor(formData.membershipTier) }}
                                >
                                    {formData.membershipTier}
                                </div>
                                <div className="preview-body">
                                    <div className="preview-price">${formData.price}/año</div>
                                    <div className="preview-discount">{Math.round(formData.discount * 100)}% OFF</div>
                                    {benefitsList.length > 0 && (
                                        <ul className="preview-benefits">
                                            {benefitsList.map((benefit, index) => (
                                                <li key={index}>✓ {benefit}</li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="form-actions">
                        <button type="button" className="cancel-button" onClick={onClose}>
                            Cancelar
                        </button>
                        <button type="submit" className="save-button">
                            {membership && membership._id ? 'Actualizar Membresía' : 'Crear Membresía'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default MembershipEditModal;