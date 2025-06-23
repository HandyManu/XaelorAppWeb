import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProductDetail } from '../../hooks/ProductDetailhooks/useProductDetail';
import toast from 'react-hot-toast'; // al inicio del archivo
import { useReview } from '../../hooks/ReviewHooks/useReview';
import { useAuth } from '../../context/AuthContext';
import './ProductDetail.css';

// Componente Modal para reseñas - VERSIÓN CORREGIDA
function ReviewModal({ isOpen, onClose, product, onSubmitReview, userReview, isSubmitting }) {
    const [formData, setFormData] = useState({
        rating: 1,
        message: ''
    });

    // Efecto para inicializar valores cuando se abre el modal
    React.useEffect(() => {
        if (isOpen) {
            if (userReview) {
                setFormData({
                    rating: userReview.rating, // Ya viene de 1-5, no convertir
                    message: userReview.message
                });
            } else {
                setFormData({
                    rating: 1,
                    message: ''
                });
            }
        }
    }, [isOpen, userReview]);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("=== ENVIANDO RESEÑA ===");
        console.log("FormData completo:", formData);
        console.log("Rating final:", formData.rating);
        console.log("Rating directo (0-5):", formData.rating);
        
        if (formData.message.trim() && formData.rating > 0) {
            onSubmitReview({
                message: formData.message.trim(),
                rating: formData.rating  // Enviar directamente de 1-5
            });
        }
    };

    const handleStarClick = (starValue) => {
        console.log("CLICK EN ESTRELLA:", starValue);
        setFormData(prev => {
            const newData = { ...prev, rating: starValue };
            console.log("Nuevo formData:", newData);
            return newData;
        });
    };

    const handleMessageChange = (e) => {
        setFormData(prev => ({ ...prev, message: e.target.value }));
    };

    const handleClose = () => {
        setFormData({ rating: 1, message: '' });
        onClose();
    };

    return (
        <div className="modal-overlay" onClick={handleClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>{userReview ? 'Editar Reseña' : 'Escribir Reseña'}</h2>
                    <button className="modal-close" onClick={handleClose}>×</button>
                </div>
                <div className="modal-body">
                    <div className="review-product-info">
                        <strong>{product?.model}</strong>
                        <span className="review-brand">Xælör</span>
                    </div>

                    <div className="review-form">
                        <div className="rating-section">
                            <label>Calificación: {formData.rating} estrella{formData.rating !== 1 ? 's' : ''}</label>
                            <div className="star-rating">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <span
                                        key={star}
                                        className={`star ${star <= formData.rating ? 'active' : ''}`}
                                        onClick={() => handleStarClick(star)}
                                        style={{ 
                                            cursor: 'pointer',
                                            fontSize: '2rem',
                                            color: star <= formData.rating ? '#F9D56E' : '#666',
                                            userSelect: 'none'
                                        }}
                                    >
                                        ★
                                    </span>
                                ))}
                            </div>
                            <div style={{ marginTop: '10px', fontSize: '0.9rem', color: '#aaa' }}>
                                Debug: Rating actual = {formData.rating}
                            </div>
                        </div>

                        <div className="message-section">
                            <label htmlFor="review-message">Tu opinión:</label>
                            <textarea
                                id="review-message"
                                value={formData.message}
                                onChange={handleMessageChange}
                                placeholder="Comparte tu experiencia con este reloj..."
                                rows="4"
                                required
                                disabled={isSubmitting}
                            />
                        </div>

                        <div className="modal-actions">
                            <button 
                                type="button" 
                                className="btn-cancel"
                                onClick={handleClose}
                                disabled={isSubmitting}
                            >
                                Cancelar
                            </button>
                            <button 
                                type="button" 
                                className="btn-submit"
                                disabled={isSubmitting || !formData.message.trim()}
                                onClick={handleSubmit}
                            >
                                {isSubmitting ? 'Enviando...' : (userReview ? 'Actualizar' : 'Enviar Reseña')}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function ProductDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuth();
    const { product, isLoading, error } = useProductDetail(id);
    const { 
        reviews, 
        userReview, 
        isSubmitting, 
        error: reviewError, 
        success: reviewSuccess,
        createReview,
        updateReview,
        canReview,
        getReviewStats,
        clearMessages
    } = useReview(id);

    // Estados locales para la interacción
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [selectedColor, setSelectedColor] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [addingToCart, setAddingToCart] = useState(false);
    const [showReviewModal, setShowReviewModal] = useState(false);

    // Función para procesar URL de imagen de Cloudinary
    const getCloudinaryUrl = (photo) => {
        if (!photo) return '/Images/Xaelör Noir Deluxe.svg'; // Imagen por defecto
        
        if (typeof photo === 'string' && photo.includes('res.cloudinary.com')) {
            return photo;
        }
        
        if (typeof photo === 'object' && photo.url) {
            if (photo.url.includes('res.cloudinary.com')) {
                return photo.url;
            }
        }
        
        const CLOUD_NAME = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME || 'demo';
        const publicId = typeof photo === 'string' ? photo : (photo.url || photo);
        
        return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/w_600,h_600,c_fill,f_auto,q_auto/${publicId}`;
    };

    // Función para navegar entre imágenes
    const handleImageNavigation = (direction) => {
        if (!product?.photos || product.photos.length === 0) return;
        
        if (direction === 'prev') {
            setSelectedImageIndex(prev => 
                prev === 0 ? product.photos.length - 1 : prev - 1
            );
        } else {
            setSelectedImageIndex(prev => 
                prev === product.photos.length - 1 ? 0 : prev + 1
            );
        }
    };

    // Función para agregar al carrito (local)
    function addToCartLocal(productId, quantity) {
        let cart = [];
        try {
            cart = JSON.parse(localStorage.getItem('cart')) || [];
        } catch {
            cart = [];
        }
        // Busca si ya existe el producto
        const idx = cart.findIndex(item => item.productId === productId);
        if (idx >= 0) {
            cart[idx].quantity += quantity;
        } else {
            cart.push({ productId, quantity });
        }
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    const handleAddToCart = () => {
        addToCartLocal(product._id, quantity);
        toast.success('Producto añadido al carrito', {
            style: {
                background: '#232323',
                color: '#ffe08a',
                border: '1.5px solid #e6c068',
                fontWeight: 'bold'
            },
            iconTheme: {
                primary: '#ffe08a',
                secondary: '#232323'
            }
        });
        setAddingToCart(false);
    };

    // Manejar envío de reseña
    const handleReviewSubmit = async (reviewData) => {
        let result;
        if (userReview) {
            result = await updateReview(userReview._id, reviewData);
        } else {
            result = await createReview(reviewData);
        }
        
        if (result.success) {
            setShowReviewModal(false);
            // Limpiar mensajes después de 3 segundos
            setTimeout(() => {
                clearMessages();
            }, 3000);
        }
    };

    // Obtener estadísticas de reseñas
    const reviewStats = getReviewStats();

    if (isLoading) {
        return (
            <div className="product-detail-loading">
                <div className="loading-spinner"></div>
                <span>Cargando producto...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="product-detail-error">
                <h2>Error al cargar el producto</h2>
                <p>{error}</p>
                <button onClick={() => navigate(-1)} className="btn-back">
                    Volver
                </button>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="product-detail-not-found">
                <h2>Producto no encontrado</h2>
                <button onClick={() => navigate(-1)} className="btn-back">
                    Volver
                </button>
            </div>
        );
    }

    // Obtener la imagen principal
    const mainImage = product.photos && product.photos.length > 0 
        ? getCloudinaryUrl(product.photos[selectedImageIndex])
        : '/Images/Xaelör Noir Deluxe.svg';

    // Obtener las miniaturas
    const thumbnails = product.photos && product.photos.length > 0
        ? product.photos.map(photo => getCloudinaryUrl(photo))
        : ['/Images/Xaelör Noir Deluxe.svg'];

    return (
        <div className="product-detail-container">
            <div className="product-detail-content">
                {/* Sección de imágenes */}
                <div className="product-images-section">
                    {/* Miniaturas laterales */}
                    <div className="product-thumbnails">
                        {thumbnails.map((thumb, index) => (
                            <div
                                key={index}
                                className={`thumbnail ${index === selectedImageIndex ? 'active' : ''}`}
                                onClick={() => setSelectedImageIndex(index)}
                            >
                                <img src={thumb} alt={`${product.model} vista ${index + 1}`} />
                            </div>
                        ))}
                    </div>

                    {/* Imagen principal */}
                    <div className="product-main-image">
                        <button 
                            className="nav-btn prev-btn"
                            onClick={() => handleImageNavigation('prev')}
                            disabled={!product.photos || product.photos.length <= 1}
                        >
                            ‹
                        </button>
                        
                        <img src={mainImage} alt={product.model} />
                        
                        <button 
                            className="nav-btn next-btn"
                            onClick={() => handleImageNavigation('next')}
                            disabled={!product.photos || product.photos.length <= 1}
                        >
                            ›
                        </button>
                    </div>
                </div>

                {/* Sección de información */}
                <div className="product-info-section">
                    <div className="product-brand">Xælör</div>
                    <h1 className="product-title">{product.model}</h1>
                    
                    <div className="product-rating">
                        <span className="rating-value">
                            {reviewStats.averageRating ? `${reviewStats.averageRating.toFixed(1)}★` : 'Sin calificar'}
                        </span>
                        <span className="rating-count">
                            ({reviewStats.totalReviews} {reviewStats.totalReviews === 1 ? 'reseña' : 'reseñas'})
                        </span>
                    </div>

                    <div className="product-price">${product.price?.toLocaleString()}</div>

                    {/* Selector de color */}
                    {product.colors && product.colors.length > 0 && (
                        <div className="product-colors">
                            <label>Color</label>
                            <div className="color-options">
                                {product.colors.map((color, index) => (
                                    <div
                                        key={index}
                                        className={`color-option ${selectedColor === color ? 'selected' : ''}`}
                                        style={{ backgroundColor: color.toLowerCase() }}
                                        onClick={() => setSelectedColor(color)}
                                        title={color}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Selector de cantidad */}
                    <div className="product-quantity">
                        <label>Cantidad</label>
                        <div className="quantity-controls">
                            <button 
                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                disabled={quantity <= 1}
                            >
                                -
                            </button>
                            <span>{quantity}</span>
                            <button onClick={() => setQuantity(quantity + 1)}>+</button>
                        </div>
                    </div>

                    {/* Botón de agregar al carrito */}
                    <button 
                        className="add-to-cart-btn"
                        disabled={addingToCart}
                        onClick={handleAddToCart}
                    >
                        {addingToCart ? 'Agregando...' : 'Añadir al carrito 🛒'}
                    </button>

                    {/* Botón de reseña */}
                    {isAuthenticated && (
                        <button 
                            className="review-btn"
                            onClick={() => setShowReviewModal(true)}
                            disabled={isSubmitting}
                        >
                            {userReview ? '✏️ Editar mi reseña' : '⭐ Escribir reseña'}
                        </button>
                    )}

                    {/* Mensajes de reseña */}
                    {reviewError && (
                        <div className="review-error-message">
                            {reviewError}
                        </div>
                    )}
                    
                    {reviewSuccess && (
                        <div className="review-success-message">
                            {reviewSuccess}
                        </div>
                    )}

                    <div className="delivery-info">
                        Entrega a domicilio en 3 días
                    </div>
                </div>
            </div>

            {/* Descripción del producto */}
            {product.description && (
                <div className="product-description">
                    <h2>Descripción</h2>
                    <p>{product.description}</p>
                </div>
            )}

            {/* Sección de reseñas existentes */}
            {reviews.length > 0 && (
                <div className="product-reviews-section">
                    <h2>Reseñas de clientes</h2>
                    <div className="reviews-list">
                        {reviews.map((review) => (
                            <div key={review._id} className="review-item">
                                <div className="review-header">
                                    <span className="review-author">
                                        {review.customerId?.name || 'Usuario anónimo'}
                                    </span>
                                    <span className="review-rating">
                                        {'★'.repeat(Math.round(review.rating))}
                                        {'☆'.repeat(5 - Math.round(review.rating))}
                                    </span>
                                    <span className="review-date">
                                        {new Date(review.date).toLocaleDateString()}
                                    </span>
                                </div>
                                <p className="review-message">{review.message}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Modal de reseña */}
            <ReviewModal
                isOpen={showReviewModal}
                onClose={() => setShowReviewModal(false)}
                product={product}
                onSubmitReview={handleReviewSubmit}
                userReview={userReview}
                isSubmitting={isSubmitting}
            />
        </div>
    );
}

export default ProductDetail;