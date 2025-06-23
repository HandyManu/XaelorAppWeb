import React from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../../../hooks/ProductHooks/useProducts';
import './productosEcologicos.css';

function ProductosEcologicos() {
  // Usar el hook para cargar productos ecológicos específicamente
  const { products, isLoading, error } = useProducts({
    category: 'Ett Med Naturen', // Categoría específica para productos ecológicos
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
      <section className="productos-ecologicos-section">
        <div className="productos-ecologicos-container">
          <h2>Productos</h2>
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
                borderTop: '3px solid #3BB764',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                margin: '0 auto 10px'
              }}></div>
              Cargando productos Ett Med Naturen...
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Mostrar error o productos vacíos
  if (error || products.length === 0) {
    return (
      <section className="productos-ecologicos-section">
        <div className="productos-ecologicos-container">
          <h2>Productos</h2>
          <div style={{ 
            textAlign: 'center', 
            color: 'white', 
            padding: '40px' 
          }}>
            {error ? (
              <>
                <p>Error al cargar productos: {error}</p>
                <p style={{ fontSize: '0.9rem', color: '#bbb', marginTop: '10px' }}>
                  Categoría buscada: "Ett Med Naturen"
                </p>
              </>
            ) : (
              <>
                <p>No hay productos Ett Med Naturen disponibles en este momento</p>
                <p style={{ fontSize: '0.9rem', color: '#bbb', marginTop: '10px' }}>
                  Verifica que existan productos con la categoría "Ett Med Naturen" en la base de datos
                </p>
              </>
            )}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="productos-ecologicos-section">
      <div className="productos-ecologicos-container">
        <h2>Productos Ett Med Naturen</h2>
        
        <div className="productos-ecologicos-grid">
          {products.map((producto) => {
            // Obtener la primera imagen del producto
            const productImage = producto.photos && producto.photos.length > 0
              ? getCloudinaryUrl(producto.photos[0])
              : '/Images/Xaelör Noir Deluxe.svg';

            return (
              <Link 
                key={producto._id} 
                to={`/watchInfo/${producto._id}`} 
                className="producto-ecologico-card"
              >
                <div className="producto-ecologico-imagen">
                  <img 
                    src={productImage} 
                    alt={producto.model} 
                    onError={(e) => {
                      e.target.src = '/Images/Xaelör Noir Deluxe.svg';
                    }}
                  />
                </div>
                
                <div className="producto-ecologico-info">
                  <h3 className="producto-ecologico-nombre">{producto.model}</h3>
                  <div className="producto-ecologico-detalles">
                    <span className="producto-ecologico-precio">
                      ${producto.price?.toLocaleString()}
                    </span>
                    <div className="producto-ecologico-valoracion">
                      <span className="valoracion-ecologico-valor">85%</span>
                      <span className="valoracion-ecologico-icono">❤</span>
                    </div>
                  </div>
                  <button
                    className="producto-ecologico-add-cart-btn"
                    type="button"
                    onClick={e => {
                      e.preventDefault();
                      // Aquí puedes agregar la lógica para añadir al carrito
                      alert(`"${producto.model}" añadido al carrito`);
                    }}
                  >
                    Añadir al carrito 🛒
                  </button>
                </div>
              </Link>
            );
          })}
        </div>
        
        <div className="ver-productos-container">
          <span className="ver-productos-texto">Ver más</span>
          <button className="ver-productos-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7 10L12 15L17 10" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}

export default ProductosEcologicos;