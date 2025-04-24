import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>Acerca de Xælör</h3>
          <ul>
            <li><Link to="/historia">Historia</Link></li>
            <li><Link to="/mision-vision">Misión y Visión</Link></li>
            <li><Link to="/luxury-stores">Luxury Stores</Link></li>
            <li><Link to="/contacto">Contacto</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Servicio al Cliente</h3>
          <ul>
            <li><Link to="/politica-devolucion">Política de Devolución</Link></li>
            <li><Link to="/direcciones">Direcciones de Tiendas</Link></li>
            <li><Link to="/colecciones">Colecciones</Link></li>
            <li><Link to="/preguntas-frecuentes">Preguntas Frecuentes</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Servicio al Cliente</h3>
          <ul>
            <li><Link to="/garantias">Garantías</Link></li>
            <li><Link to="/reparaciones">Reparaciones</Link></li>
            <li><Link to="/exportaciones">Exportaciones</Link></li>
          </ul>
        </div>
      </div>

      <div className="social-media">
        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
          <i className="fab fa-facebook-f"></i> Facebook
        </a>
        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
          <i className="fab fa-instagram"></i> Instagram
        </a>
        <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
          <i className="fab fa-youtube"></i> YouTube
        </a>
        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
          <i className="fab fa-linkedin-in"></i> LinkedIn
        </a>
      </div>

      <div className="legal-links">
        <a href="/aviso-legal">Aviso Legal</a>
        <a href="/politica-privacidad">Política de Privacidad</a>
        <a href="/politica-cookies">Política de Cookies</a>
        <a href="/seguridad-sitio">Seguridad del Sitio</a>
        <a href="/preguntas-frecuentes">Preguntas Frecuentes</a>
        <a href="/politica-devoluciones">Política de Devoluciones</a>
        <a href="/terminos-condiciones">Términos y Condiciones</a>
      </div>

      <div className="footer-bottom">
        <a href="/" className="footer-logo">
          <img src="/Logo.svg" alt="Xælör Logo" />
        </a>
      </div>
    </footer>
  );
}

export default Footer;