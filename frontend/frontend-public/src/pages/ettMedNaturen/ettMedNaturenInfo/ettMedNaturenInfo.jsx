import React from 'react';
import './ettMedNaturenInfo.css';

function EttMedNaturenInfo() {
  return (
    <section className="ettmednature-info-section">
      <div className="ettmednature-info-container">
        <div className="ettmednature-info-content">
          <h2 className="ettmednature-info-title">Ett Med Naturen</h2>
          
          <div className="ettmednature-info-row">
            <div className="ettmednature-info-text">
              <h3>Conectados con la Naturaleza, Inspirados por el Tiempo.</h3>
              
              <p>
                El progreso es esencial, pero preservar lo que nos da vida es fundamental.
                Nuestra línea ecológica fusiona diseño, tecnología y respeto por el
                ecosistema.
              </p>
            </div>
            
            <div className="ettmednature-info-imagen">
              <img src="/Images/relojEcologico.svg" alt="Reloj ecológico Xælör" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default EttMedNaturenInfo;