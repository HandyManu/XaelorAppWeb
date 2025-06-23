import React from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../../../hooks/ProductHooks/useProducts';
import './masVendidos.css';

function MasVendidos() {
  // Usar el hook para cargar productos más vendidos de CUALQUIER categoría
  const { products, isLoading, error } = useProducts({
    featured: true, // Solo productos destacados/más vendidos
    limit: 8,
    sortBy: 'popularity', // O el campo que uses para popularidad
    // NO especificamos category para que cargue de todas las categorías
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
      <section className="mas-vendidos-section">
        <div className="mas-vendidos-container">
          <h2>Lo más vendido</h2>
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
                borderTop: '3px solid #ffc464',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                margin: '0 auto 10px'
              }}></div>
              Cargando productos más vendidos...
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Mostrar error o productos vacíos
  if (error || products.length === 0) {
    return (
      <section className="mas-vendidos-section">
        <div className="mas-vendidos-container">
          <h2>Lo más vendido</h2>
          <div style={{ 
            textAlign: 'center', 
            color: 'white', 
            padding: '40px' 
          }}>
            {error ? (
              <>
                <p>Error al cargar productos: {error}</p>
                <p style={{ fontSize: '0.9rem', color: '#bbb', marginTop: '10px' }}>
                  Buscando productos destacados de todas las categorías
                </p>
              </>
            ) : (
              <>
                <p>No hay productos destacados disponibles en este momento</p>
                <p style={{ fontSize: '0.9rem', color: '#bbb', marginTop: '10px' }}>
                  Verifica que existan productos marcados como "featured: true" en la base de datos
                </p>
              </>
            )}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="mas-vendidos-section">
      <div className="mas-vendidos-container">
        <h2>Lo más vendido</h2>
        
        <div className="mas-vendidos-grid">
          {products.map((producto) => {
            // Obtener la primera imagen del producto
            const productImage = producto.photos && producto.photos.length > 0
              ? getCloudinaryUrl(producto.photos[0])
              : '/Images/Xaelör Noir Deluxe.svg';

            return (
              <Link 
                key={producto._id} 
                to={`/watchInfo/${producto._id}`} 
                className="producto-card-vendido"
              >
                <div className="producto-imagen-vendido">
                  <img 
                    src={productImage} 
                    alt={producto.model} 
                    onError={(e) => {
                      e.target.src = '/Images/Xaelör Noir Deluxe.svg';
                    }}
                  />
                </div>
                
                <div className="producto-info-vendido">
                  <h3 className="producto-nombre-vendido">{producto.model}</h3>
                  <div className="producto-detalles-vendido">
                    <span className="producto-precio-vendido">
                      ${producto.price?.toLocaleString()}
                    </span>
                    <div className="producto-valoracion-vendido">
                      <span className="valoracion-valor-vendido">85%</span>
                      <span className="valoracion-icono-vendido">❤</span>
                    </div>
                  </div>
                  {/* Mostrar la categoría del producto */}
                  <div style={{ 
                    fontSize: '0.7rem', 
                    color: '#bbb', 
                    textAlign: 'center', 
                    marginTop: '4px' 
                  }}>
                    {producto.category}
                  </div>
                  <button
                    className="producto-vendido-add-cart-btn"
                    type="button"
                    onClick={e => {
                      e.preventDefault();
                      // Aquí puedes agregar la lógica para añadir al carrito
                      alert(`"${producto.model}" añadido al carrito`);
                    }}
                    style={{ marginTop: '10px', width: '100%' }}
                  >
                    Añadir al carrito 🛒
                  </button>
                </div>
              </Link>
            );
          })}
        </div>
        
        <div className="ver-mas-container">
          <span className="ver-mas-texto">Ver más</span>
          <button className="ver-mas-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7 10L12 15L17 10" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}

export default MasVendidos;