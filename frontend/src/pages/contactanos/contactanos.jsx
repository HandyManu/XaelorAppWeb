import React, { useState } from 'react';
import './contactanos.css';

function Contacto() {
  const [formData, setFormData] = useState({
    nombres: '',
    apellidos: '',
    tipoConsulta: '',
    titulo: '',
    email: '',
    telefono: '',
    mensaje: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Lógica de envío de formulario
    console.log(formData);
  };

  return (
    <div className="contacto-container">
      <div className="contacto-form-wrapper">
        <h2>Contáctanos</h2>
        <form onSubmit={handleSubmit} className="contacto-form">
          <div className="form-row">
            <input 
              type="text" 
              name="nombres" 
              placeholder="Nombres" 
              value={formData.nombres}
              onChange={handleChange}
              required 
            />
            <input 
              type="text" 
              name="apellidos" 
              placeholder="Apellidos" 
              value={formData.apellidos}
              onChange={handleChange}
              required 
            />
          </div>
          <div className="form-row">
            <input 
              type="email" 
              name="email" 
              placeholder="Email" 
              value={formData.email}
              onChange={handleChange}
              required 
            />
            <input 
              type="tel" 
              name="telefono" 
              placeholder="Numero de teléfono" 
              value={formData.telefono}
              onChange={handleChange}
              required 
            />
          </div>
          <div className="form-row">
            <input 
              type="text" 
              name="tipoConsulta" 
              placeholder="Tipo de consulta" 
              value={formData.tipoConsulta}
              onChange={handleChange}
              required 
            />
            <input 
              type="text" 
              name="titulo" 
              placeholder="Título" 
              value={formData.titulo}
              onChange={handleChange}
              required 
            />
          </div>
          <div className="form-row">
            <textarea 
              name="mensaje" 
              placeholder="Mensaje" 
              value={formData.mensaje}
              onChange={handleChange}
              required 
            ></textarea>
          </div>
          <button type="submit" className="submit-btn">Enviar</button>
        </form>
      </div>
    </div>
  );
}

export default Contacto;