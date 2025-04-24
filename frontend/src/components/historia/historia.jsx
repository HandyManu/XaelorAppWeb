import React from 'react';
import './historia.css';

function historia() {
  return (
    <section className="historia-section">
      <div className="historia-container">
        <div className="historia-text">
          <h2>Varje sekund, en historia</h2>
          <h3>"Cada segundo, una historia"</h3>
          
          <p>
            Cada momento cuenta, el tiempo no solo se mide, sino que se vive.
          </p>
          
          <p>
            Xælör no solo ofrece relojes, sino que acompaña a las personas en sus experiencias, capturando cada instante como parte de su historia.
          </p>
        </div>
        
        <div className="gallery-container">
          <div className="mujer-reloj">
            <img src="/Images/mujerconreloj.svg" alt="Mujer con reloj Xælör" />
          </div>
          
          <div className="relojes-container">
            <div className="reloj-manos">
              <img src="/Images/fuadosrelojes.svg" alt="Dos relojes en muñeca" />
            </div>
            
            <div className="relojes-row">
              <div className="reloj-item">
                <img src="/Images/un relojhd.svg" alt="Reloj elegante en muñeca" />
              </div>
              <div className="reloj-item">
                <img src="/Images/otroreloj.svg" alt="Detalle de maquinaria de reloj" />
              </div>
            </div>
            
            <div className="relojes-row">
              <div className="reloj-item">
                <img src="/Images/relojenbolsillo.svg" alt="Mecanismo de reloj" />
              </div>
              <div className="reloj-item">
                <img src="/Images/relojsinnumeros.svg" alt="Reloj minimalista" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default historia;