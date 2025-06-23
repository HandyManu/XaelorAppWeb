import React from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../../../hooks/ProductHooks/useProducts';
import './products.css';

function XaelorProducts() {
  // Usar el hook para cargar productos Nautilus específicamente
  const { products, isLoading, error } = useProducts({
    category: 'Nautilus', // Categoría específica para productos Nautilus
    limit: 8
  });

  // Función para procesar URL de imagen de Cloudinary
  const getCloudinaryUrl = (photo) => {
    if (!photo) return '/Images/Xaelör Noir Deluxe.svg';
    
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
    
    return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/w_400,h_400,c_fill,f_auto,q_auto/${publicId}`;
  };

  // Mostrar estado de carga
  if (isLoading) {
    return (
      <div className="xaelor-products-page">
        <div className="xaelor-products-container">
          <h2 className="xaelor-products-title">Productos</h2>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '200px',
            color: 'white' 
          }}>
            <div style={{ textAlign: 'center' }}>
              <div className="loading-spinner" style={{
                width: '40px',
                height: '40px',
                border: '3px solid #333',
                borderTop: '3px solid #F9D56E',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                margin: '0 auto 10px'
              }}></div>
              Cargando productos Nautilus...
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Mostrar error o productos vacíos
  if (error || products.length === 0) {
    return (
      <div className="xaelor-products-page">
        <div className="xaelor-products-container">
          <h2 className="xaelor-products-title">Productos</h2>
          <div style={{ 
            textAlign: 'center', 
            color: 'white', 
            padding: '40px' 
          }}>
            {error ? (
              <>
                <p>Error al cargar productos: {error}</p>
                <p style={{ fontSize: '0.9rem', color: '#bbb', marginTop: '10px' }}>
                  Categoría buscada: "Nautilus"
                </p>
              </>
            ) : (
              <>
                <p>No hay productos Nautilus disponibles en este momento</p>
                <p style={{ fontSize: '0.9rem', color: '#bbb', marginTop: '10px' }}>
                  Verifica que existan productos con la categoría "Nautilus" en la base de datos
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="xaelor-products-page">
      <div className="xaelor-products-container">
        <h2 className="xaelor-products-title">Productos Nautilus</h2>
        <div className="xaelor-products-grid">
          {products.map((product) => {
            // Obtener la primera imagen del producto
            const productImage = product.photos && product.photos.length > 0
              ? getCloudinaryUrl(product.photos[0])
              : '/Images/Xaelör Noir Deluxe.svg';

            return (
              <Link 
                key={product._id} 
                to={`/watchInfo/${product._id}`} 
                className="xaelor-product-card"
              >
                <div className="xaelor-product-image-container">
                  <img 
                    src={productImage} 
                    alt={product.model} 
                    className="xaelor-product-image"
                    onError={(e) => {
                      e.target.src = '/Images/Xaelör Noir Deluxe.svg';
                    }}
                  />
                </div>
                <div className="xaelor-product-details">
                  <h3 className="xaelor-product-name">{product.model}</h3>
                  <div className="xaelor-product-info">
                    <span className="xaelor-product-price">
                      ${product.price?.toLocaleString()}
                    </span>
                    <div className="xaelor-product-rating">
                      <span className="xaelor-rating-value">85%</span>
                      <span className="xaelor-rating-icon">❤</span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
        <div className="xaelor-view-more">
          <span className="xaelor-view-more-text">Ver más</span>
          <button className="xaelor-view-more-button">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7 10L12 15L17 10" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
      <div className="xaelor-coral-decoration"></div>
    </div>
  );
}

export default XaelorProducts;