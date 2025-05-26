import React from 'react';
import { Link } from 'react-router-dom';
import './categoriasRelojes.css';

function CategoriasRelojes() {
  // Datos de categorías actualizados para coincidir con las imágenes de referencia
  const categorias = [
    {
      id: 1,
      titulo: 'Nuevas Líneas',
      imagen: '/Images/XælörSubmariner.svg', // Imagen del reloj azul
      enlace: '/watches/nuevas-lineas'
    },
    {
      id: 2,
      titulo: 'Personalizar',
      imagen: '/Images/Personalizar.svg', // Reloj que se ve en la mano
      enlace: '/watches/personalizar'
    },
    {
      id: 3,
      titulo: 'Relojes inteligentes',
      imagen: '/Images/Relojes inteligentes.svg', // Smartwatch
      enlace: '/watches/inteligentes'
    }
  ];

  return (
    <section className="categorias-relojes-section">
      <div className="categorias-container">
        <div className="categorias-header">
          <h2>Relojes</h2>
          <p>
            Descubre todos los relojes para completar tu estilo, siempre a la moda
            y con un toque de elegancia
          </p>
        </div>

        <div className="categorias-grid">
          {/* Categoría principal (Nuevas Líneas) */}
          <div className="categoria-principal">
            <Link to={categorias[0].enlace} className="categoria-card">
              <div className="categoria-imagen">
                <img src={categorias[0].imagen} alt={categorias[0].titulo} />
                <div className="categoria-overlay">
                  <h3>{categorias[0].titulo}</h3>
                </div>
              </div>
            </Link>
          </div>

          {/* Categorías secundarias */}
          <div className="categorias-secundarias">
            {categorias.slice(1).map((categoria) => (
              <Link key={categoria.id} to={categoria.enlace} className="categoria-card">
                <div className="categoria-imagen">
                  <img src={categoria.imagen} alt={categoria.titulo} />
                  <div className="categoria-overlay">
                    <h3>{categoria.titulo}</h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default CategoriasRelojes;