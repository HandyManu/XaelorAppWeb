import React from 'react';
import './ultimosLanzamientos.css';

function ultimosLanzamientos() {
  // Array de productos
  const productos = [
    {
      id: 1,
      nombre: 'Wood Date',
      coleccion: 'Ett Med Naturen',
      imagen: '/Images/WeWoodDate.svg', // Usando la imagen proporcionada
      link: '/watches/wood-date'
    },
    {
      id: 2,
      nombre: 'Stark Simplicity',
      coleccion: 'Ett Med Naturen',
      imagen: '/Images/StarkSimplicity.svg', // Usando la imagen proporcionada
      link: '/watches/stark-simplicity'
    },
    {
      id: 3,
      nombre: 'Xælör Submariner',
      coleccion: 'Nautilus',
      imagen: '/Images/XælörSubmariner.svg', // Usando la imagen proporcionada
      link: '/watches/submariner',
      destacado: true
    },
    {
      id: 4,
      nombre: 'WeWood Date',
      coleccion: 'Ett Med Naturen',
      imagen: '/Images/WeWoodDate.svg', // Usando la imagen proporcionada
      link: '/watches/wewood-date'
    },
    {
      id: 5,
      nombre: 'Stark Simplicity',
      coleccion: 'Ett Med Naturen',
      imagen: '/Images/StarkSimplicity.svg', // Usando la imagen proporcionada
      link: '/watches/stark-simplicity-2'
    }
  ];

  return (
    <section className="lanzamientos-section">
      <div className="lanzamientos-container">
        <h2>Últimos lanzamientos</h2>
        
        <div className="productos-slider">
          {productos.map((producto) => (
            <div 
              className={`producto-card ${producto.destacado ? 'destacado' : ''}`} 
              key={producto.id}
            >
              <a href={producto.link} className="producto-link">
                <div className="producto-image">
                  <img src={producto.imagen} alt={producto.nombre} />
                </div>
                <div className="producto-info">
                  <h3>{producto.nombre}</h3>
                  <p>{producto.coleccion}</p>
                </div>
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ultimosLanzamientos;