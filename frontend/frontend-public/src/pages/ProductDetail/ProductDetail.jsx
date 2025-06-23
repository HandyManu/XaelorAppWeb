import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProductDetail } from '../../hooks/ProductDetailhooks/useProductDetail';
import './ProductDetail.css';

function ProductDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { product, isLoading, error, addToCart } = useProductDetail(id);
    

    // Estados locales para la interacción
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [selectedColor, setSelectedColor] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [addingToCart, setAddingToCart] = useState(false);

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

    // Función para manejar agregar al carrito
    const handleAddToCart = async () => {
        setAddingToCart(true);
        
        const result = await addToCart(quantity, selectedColor);
        
        if (result.success) {
            alert('Producto agregado al carrito exitosamente');
        } else {
            alert(`Error: ${result.message}`);
        }
        
        setAddingToCart(false);
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
                        <span className="rating-value">85%</span>
                        <span className="rating-icon">🖤</span>
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
                        onClick={handleAddToCart}
                        disabled={addingToCart}
                    >
                        {addingToCart ? 'Agregando...' : 'Añadir al carrito 🛒'}
                    </button>

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
        </div>
    );
}

export default ProductDetail;