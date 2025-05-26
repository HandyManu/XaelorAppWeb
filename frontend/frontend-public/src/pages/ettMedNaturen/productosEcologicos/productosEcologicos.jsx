import React from 'react';
import { Link } from 'react-router-dom';
import './productosEcologicos.css';

function ProductosEcologicos() {
  // Datos de productos ecológicos
  const productos = [
    {
      id: 1,
      nombre: 'Xaelör Noir Deluxe',
      precio: '$500.00',
      valoracion: 85,
      imagen: '/Images/Xaelör Noir Deluxe.svg',
      enlace: '/watches/noir-deluxe'
    },
    {
      id: 2,
      nombre: 'Xaelör Noir Deluxe',
      precio: '$500.00',
      valoracion: 85,
      imagen: '/Images/Xaelör Noir Deluxe.svg',
      enlace: '/watches/noir-deluxe'
    },
    {
      id: 3,
      nombre: 'Xaelör Noir Deluxe',
      precio: '$500.00',
      valoracion: 85,
      imagen: '/Images/Xaelör Noir Deluxe.svg',
      enlace: '/watches/noir-deluxe'
    },
    {
      id: 4,
      nombre: 'Xaelör Noir Deluxe',
      precio: '$500.00',
      valoracion: 85,
      imagen: '/Images/Xaelör Noir Deluxe.svg',
      enlace: '/watches/noir-deluxe'
    },
    {
      id: 5,
      nombre: 'Xaelör Noir Deluxe',
      precio: '$500.00',
      valoracion: 85,
      imagen: '/Images/Xaelör Noir Deluxe.svg',
      enlace: '/watches/noir-deluxe'
    },
    {
      id: 6,
      nombre: 'Xaelör Noir Deluxe',
      precio: '$500.00',
      valoracion: 85,
      imagen: '/Images/Xaelör Noir Deluxe.svg',
      enlace: '/watches/noir-deluxe'
    },
    {
      id: 7,
      nombre: 'Xaelör Noir Deluxe',
      precio: '$500.00',
      valoracion: 85,
      imagen: '/Images/Xaelör Noir Deluxe.svg',
      enlace: '/watches/noir-deluxe'
    },
    {
      id: 8,
      nombre: 'Xaelör Noir Deluxe',
      precio: '$500.00',
      valoracion: 85,
      imagen: '/Images/Xaelör Noir Deluxe.svg',
      enlace: '/watches/noir-deluxe'
    }
  ];

  return (
    <section className="productos-ecologicos-section">
      <div className="productos-ecologicos-container">
        <h2>Productos</h2>
        
        <div className="productos-ecologicos-grid">
          {productos.map((producto) => (
            <Link key={producto.id} to={producto.enlace} className="producto-ecologico-card">
              <div className="producto-ecologico-imagen">
                <img src={producto.imagen} alt={producto.nombre} />
              </div>
              
              <div className="producto-ecologico-info">
                <h3 className="producto-ecologico-nombre">{producto.nombre}</h3>
                <div className="producto-ecologico-detalles">
                  <span className="producto-ecologico-precio">{producto.precio}</span>
                  <div className="producto-ecologico-valoracion">
                    <span className="valoracion-ecologico-valor">{producto.valoracion}%</span>
                    <span className="valoracion-ecologico-icono">❤</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
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