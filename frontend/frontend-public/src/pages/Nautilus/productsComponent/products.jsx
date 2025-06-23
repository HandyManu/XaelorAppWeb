import React from 'react';
import { Link } from 'react-router-dom';
import './products.css';

function XaelorProducts() {
  const products = [
    {
      id: 1,
      name: 'Xaelör Noir Deluxe',
      price: '$500.00',
      rating: 85,
      image: '/Images/Xaelör Noir Deluxe.svg',
      enlace: '/watchInfo'
    },
    {
      id: 2,
      name: 'Xaelör Noir Deluxe',
      price: '$500.00',
      rating: 85,
      image: '/Images/Xaelör Noir Deluxe.svg',
      enlace: '/watchInfo'
    },
    {
      id: 3,
      name: 'Xaelör Noir Deluxe',
      price: '$500.00',
      rating: 85,
      image: '/Images/Xaelör Noir Deluxe.svg',
      enlace: '/watchInfo'
    },
    {
      id: 4,
      name: 'Xaelör Noir Deluxe',
      price: '$500.00',
      rating: 85,
      image: '/Images/Xaelör Noir Deluxe.svg',
      enlace: '/watchInfo'
    },
    {
      id: 5,
      name: 'Xaelör Noir Deluxe',
      price: '$500.00',
      rating: 85,
      image: '/Images/Xaelör Noir Deluxe.svg',
      enlace: '/watchInfo'
    },
    {
      id: 6,
      name: 'Xaelör Noir Deluxe',
      price: '$500.00',
      rating: 85,
      image: '/Images/Xaelör Noir Deluxe.svg',
      enlace: '/watchInfo'
    },
    {
      id: 7,
      name: 'Xaelör Noir Deluxe',
      price: '$500.00',
      rating: 85,
      image: '/Images/Xaelör Noir Deluxe.svg',
      enlace: '/watchInfo'
    },
    {
      id: 8,
      name: 'Xaelör Noir Deluxe',
      price: '$500.00',
      rating: 85,
      image: '/Images/Xaelör Noir Deluxe.svg',
      enlace: '/watchInfo'
    }
  ];

  return (
    <div className="xaelor-products-page">
      <div className="xaelor-products-container">
        <h2 className="xaelor-products-title">Productos</h2>
        <div className="xaelor-products-grid">
          {products.map((product) => (
            <Link key={product.id} to={product.link} className="xaelor-product-card">
              <div className="xaelor-product-image-container">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="xaelor-product-image"
                />
              </div>
              <div className="xaelor-product-details">
                <h3 className="xaelor-product-name">{product.name}</h3>
                <div className="xaelor-product-info">
                  <span className="xaelor-product-price">{product.price}</span>
                  <div className="xaelor-product-rating">
                    <span className="xaelor-rating-value">{product.rating}%</span>
                    <span className="xaelor-rating-icon">❤</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
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