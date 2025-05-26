import React, { useState } from 'react';
import './infoP.css';

function ProductDetailEnhanced() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState('pink');
  
  // Datos del producto
  const product = {
    name: "Reloj Xaelor West análogo metálico dorado para mujer",
    brand: "Xaelor",
    rating: 85,
    price: 500.00,
    delivery: "Entrega a domicilio en 3 días",
    description: [
      "Este reloj para mujer es una pieza de diseño elegante y sofisticado.",
      "Brazalete de eslabones ajustables en tono dorado.",
      "Esfera con tres manecillas doradas que indican la hora, minutos y segundos."
    ],
    colors: [
      { id: 'pink', hex: '#F5B4C8', name: 'Rosa' },
      { id: 'silver', hex: '#C0C0C0', name: 'Plateado' },
      { id: 'blue', hex: '#A5C8E4', name: 'Azul' }
    ],
    images: [
      "/Images/relojInfo1.svg",
      "/Images/relojInfo2.svg",
      "/Images/relojInfo3.svg"
    ]
  };

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === product.images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === 0 ? product.images.length - 1 : prevIndex - 1
    );
  };

  const selectImage = (index) => {
    setCurrentImageIndex(index);
  };

  return (
    <div className="product-container">
      <div className="product-detail">
        <div className="carousel-section">
          <div className="carousel-thumbnails">
            {product.images.map((image, index) => (
              <div 
                key={index} 
                className={`thumbnail ${index === currentImageIndex ? 'active' : ''}`}
                onClick={() => selectImage(index)}
              >
                <img src={image} alt={`Vista ${index + 1} del ${product.name}`} />
              </div>
            ))}
          </div>
          
          <div className="carousel-container">
            <div className="carousel-main">
              <img 
                src={product.images[currentImageIndex]} 
                alt={product.name} 
              />
              <button className="carousel-arrow arrow-left" onClick={prevImage}>
                &#8249;
              </button>
              <button className="carousel-arrow arrow-right" onClick={nextImage}>
                &#8250;
              </button>
            </div>
          </div>
        </div>
        
        <div className="product-info">
          <h1 className="product-title">{product.name}</h1>
          <p className="product-brand">{product.brand}</p>
          
          <div className="product-meta">
            <div className="product-rating">
              <span>{product.rating}%</span>
              <span className="heart-icon">♥</span>
            </div>
          </div>
          
          <p className="product-price">${product.price.toFixed(2)}</p>
          
          <div className="color-section">
            <p className="color-title">Color</p>
            <div className="color-selector">
              {product.colors.map(color => (
                <div
                  key={color.id}
                  className={`color-option ${selectedColor === color.id ? 'selected' : ''}`}
                  style={{ backgroundColor: color.hex }}
                  onClick={() => setSelectedColor(color.id)}
                  title={color.name}
                ></div>
              ))}
            </div>
          </div>
          
          <button className="add-to-cart">
            Añadir al carrito
            <span className="cart-icon">🛒</span>
          </button>
          
          <p className="delivery-info">{product.delivery}</p>
          
          <div className="product-description">
            <h2 className="description-title">Descripción</h2>
            <div className="description-text">
              {product.description.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetailEnhanced;