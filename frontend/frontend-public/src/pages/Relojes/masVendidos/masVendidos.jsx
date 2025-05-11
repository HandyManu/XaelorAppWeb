import React from 'react';
import { Link } from 'react-router-dom';
import './masVendidos.css';

function MasVendidos() {
  // Datos de productos más vendidos - todos con el mismo reloj como en la imagen de referencia
  const productosDestacados = [
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
    <section className="mas-vendidos-section">
      <div className="mas-vendidos-container">
        <h2>Lo más vendido</h2>
        
        <div className="mas-vendidos-grid">
          {productosDestacados.map((producto) => (
            <Link key={producto.id} to={producto.enlace} className="producto-card-vendido">
              <div className="producto-imagen-vendido">
                <img src={producto.imagen} alt={producto.nombre} />
              </div>
              
              <div className="producto-info-vendido">
                <h3 className="producto-nombre-vendido">{producto.nombre}</h3>
                <div className="producto-detalles-vendido">
                  <span className="producto-precio-vendido">{producto.precio}</span>
                  <div className="producto-valoracion-vendido">
                    <span className="valoracion-valor-vendido">{producto.valoracion}%</span>
                    <span className="valoracion-icono-vendido">❤</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
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