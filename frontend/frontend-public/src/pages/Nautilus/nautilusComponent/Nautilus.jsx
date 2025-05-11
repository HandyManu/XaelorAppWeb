import React from 'react';
import './Nautilus.css';

function Nautilus() {
  return (
    <div className="nautilus-page">
      <div className="nautilus-container">
        <div className="nautilus-content">
          <div className="nautilus-text">
            <h2>Nautilus</h2>
            <p>La elegancia que se sumerge</p>
            <div className="nautilus-description">
              <p>Sumérgete en la sofisticación con la línea de relojes Nautilus, diseñada para quienes encuentran belleza en cada gota de agua. Estos relojes no solo capturan la esencia de la elegancia, sino que están construidos para resistir el agua, ofreciendo un rendimiento superior tanto en la superficie como en las profundidades.</p>
            </div>
          </div>
          <div className="nautilus-image-container">
            <img 
              src="/Images/nautilus.svg" 
              alt="Reloj Nautilus" 
              className="nautilus-image" 
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Nautilus;