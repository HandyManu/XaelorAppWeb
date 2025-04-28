import React from 'react';
import './SobreNosotros.css';

function SobreNosotros() {
  return (
    <div className="sobre-nosotros-container">
      <section className="quienes-somos">
        <div className="texto-quienes-somos">
          <h1>¿Quiénes Somos?</h1>
          <p>Nacida en el corazón de Suecia, en Estocolmo, Xaelör fue fundada en 1970 por Wilhelm Grenström, un visionario diseñador apasionado por la moda y la relojería. Durante su primera década, la marca se especializó en alta costura, creando piezas exclusivas que reflejaban la sofisticación del diseño escandinavo.</p>
          <p>Sin embargo, al observar el impacto de la evolución de los relojes de cara en la industria, Granström se dio cuenta de que en el mundo, Xaelör había sido una moda. En 1980, tomó la decisión de reinventarse, fusionando tecnología, diseño y exclusividad para dar vida a una nueva generación de relojes.</p>
        </div>
        <div className="imagen-quienes-somos">
          <img 
            src="/Images/fabricaXaelor.svg" 
            alt="Historia de Xaelör" 
          />
        </div>
      </section>

      <section className="mision-vision">
        <div className="mision">
          <h2>Misión</h2>
          <p>Crear relojes de alta calidad que combinan precisión, exclusividad y diseño atemporal, ofreciendo piezas únicas para quienes valoran la elegancia en cada detalle.</p>
        </div>
        <div className="vision">
          <h2>Visión</h2>
          <p>Convertirnos en el principal referente de lujo y sofisticación en relojería, siendo la elección predilecta de quienes buscan distinción y excelencia en cada momento.</p>
        </div>
      </section>

      <section className="valores">
        <h2>Valores</h2>
        <div className="valores-grid">
          <div className="valor">Precisión y excelencia</div>
          <div className="valor">Exclusividad y distinción</div>
          <div className="valor">Innovación constante</div>
          <div className="valor">Artesanía y tradición</div>
          <div className="valor">Pasión por el detalle</div>
          <div className="valor">Compromiso con nuestros clientes</div>
        </div>
      </section>
    </div>
  );
}

export default SobreNosotros;