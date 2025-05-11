import React from 'react';
import './Products.css';

function Products() {
  const products = [
    {
      id: 1,
      name: 'Xaelör Noir Deluxe',
      price: '$500.00',
      rating: 85,
      image: '/Images/Xaelör Noir Deluxe.svg'
    },
    {
      id: 2,
      name: 'Xaelör Noir Deluxe',
      price: '$500.00',
      rating: 85,
      image: '/Images/Xaelör Noir Deluxe.svg'
    },
    {
      id: 3,
      name: 'Xaelör Noir Deluxe',
      price: '$500.00',
      rating: 85,
      image: '/Images/Xaelör Noir Deluxe.svg'
    },
    {
      id: 4,
      name: 'Xaelör Noir Deluxe',
      price: '$500.00',
      rating: 85,
      image: '/Images/Xaelör Noir Deluxe.svg'
    },
    {
      id: 5,
      name: 'Xaelör Noir Deluxe',
      price: '$500.00',
      rating: 85,
      image: '/Images/Xaelör Noir Deluxe.svg'
    },
    {
      id: 6,
      name: 'Xaelör Noir Deluxe',
      price: '$500.00',
      rating: 85,
      image: '/Images/Xaelör Noir Deluxe.svg'
    },
    {
      id: 7,
      name: 'Xaelör Noir Deluxe',
      price: '$500.00',
      rating: 85,
      image: '/Images/Xaelör Noir Deluxe.svg'
    },
    {
      id: 8,
      name: 'Xaelör Noir Deluxe',
      price: '$500.00',
      rating: 85,
      image: '/Images/Xaelör Noir Deluxe.svg'
    }
  ];

  return (
    <div className="products-page">
      <div className="products-container">
        <h2>Productos</h2>
        <div className="products-grid">
          {products.map((product) => (
            <div key={product.id} className="product-card">
              <div className="product-image">
                <img src={product.image} alt={product.name} />
              </div>
              <div className="product-details">
                <h3>{product.name}</h3>
                <div className="product-info">
                  <span className="product-price">{product.price}</span>
                  <div className="product-rating">
                    <span className="rating-value">{product.rating}%</span>
                    <span className="rating-icon">❤</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="view-more">
          <span>Ver más</span>
          <div className="view-more-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7 10L12 15L17 10" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      </div>
      <div className="coral-background"></div>
    </div>
  );
}

export default Products;