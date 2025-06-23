import React, { useState } from "react";
import { useSignUp } from "../../hooks/SignUpHooks/useSignUp";
import "./signUp.css"; 

// Componente Modal para términos y políticas
function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{title}</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          {children}
        </div>
      </div>
    </div>
  );
}

// Componente de verificación de código
function VerificationForm({ email, onVerify, loading, error }) {
  const [code, setCode] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onVerify(code);
  };

  return (
    <div className="signup-container">
      <div className="signup-box">
        <div className="logo">Xælör</div>
        <h2 className="signup-title">Verificar Email</h2>
        
        <p className="verification-text">
          Hemos enviado un código de verificación a:<br />
          <strong>{email}</strong>
        </p>

        <div className="signup-form">
          <input 
            type="text" 
            placeholder="Ingresa el código de 6 dígitos" 
            className="signup-input verification-input"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            maxLength="6"
            required
          />

          {error && <div className="error-message">{error}</div>}

          <button 
            type="button" 
            className="signup-button"
            disabled={loading || code.length !== 6}
            onClick={handleSubmit}
          >
            {loading ? "Verificando..." : "Verificar Código"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function SignUp() {
  const {
    formData,
    updateField,
    loading,
    error,
    showVerification,
    handleSubmit,
    handleVerification
  } = useSignUp();

  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  // Validaciones
  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) {
      errors.name = "El nombre es requerido";
    }
    
    if (!formData.email.trim()) {
      errors.email = "El email es requerido";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email inválido";
    }
    
    if (!formData.password) {
      errors.password = "La contraseña es requerida";
    } else if (formData.password.length < 6) {
      errors.password = "La contraseña debe tener al menos 6 caracteres";
    }
    
    if (!formData.phone.trim()) {
      errors.phone = "El teléfono es requerido";
    } else if (!/^[+]?[\d\s\-()]+$/.test(formData.phone)) {
      errors.phone = "Formato de teléfono inválido";
    }
    
    if (!termsAccepted) {
      errors.terms = "Debes aceptar los términos y condiciones";
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      handleSubmit();
    }
  };

  // Si está en modo verificación, mostrar el componente de verificación
  if (showVerification) {
    return (
      <VerificationForm 
        email={formData.email}
        onVerify={handleVerification}
        loading={loading}
        error={error}
      />
    );
  }

  return (
    <>
      <div className="signup-container">
        <div className="signup-box">
          <div className="logo">Xælör</div>
          <h2 className="signup-title">Crear Cuenta</h2>

          <div className="signup-form">
            <div className="input-group">
              <input 
                type="text" 
                placeholder="Tu nombre" 
                className={`signup-input ${validationErrors.name ? 'error' : ''}`}
                value={formData.name}
                onChange={(e) => updateField('name', e.target.value)}
              />
              {validationErrors.name && <span className="error-text">{validationErrors.name}</span>}
            </div>

            <div className="input-group">
              <input 
                type="email" 
                placeholder="ejemplo@gmail.com" 
                className={`signup-input ${validationErrors.email ? 'error' : ''}`}
                value={formData.email}
                onChange={(e) => updateField('email', e.target.value)}
              />
              {validationErrors.email && <span className="error-text">{validationErrors.email}</span>}
            </div>

            <div className="input-group">
              <input 
                type="password" 
                placeholder="Ingresa tu contraseña" 
                className={`signup-input ${validationErrors.password ? 'error' : ''}`}
                value={formData.password}
                onChange={(e) => updateField('password', e.target.value)}
              />
              {validationErrors.password && <span className="error-text">{validationErrors.password}</span>}
            </div>

            <div className="input-group">
              <input 
                type="tel" 
                placeholder="7123-4567" 
                className={`signup-input ${validationErrors.phone ? 'error' : ''}`}
                value={formData.phone}
                onChange={(e) => updateField('phone', e.target.value)}
              />
              {validationErrors.phone && <span className="error-text">{validationErrors.phone}</span>}
            </div>

            <label className={`signup-checkbox-container ${validationErrors.terms ? 'error' : ''}`}>
              <input 
                type="checkbox" 
                className="signup-checkbox"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
              />
              <span>
                Acepto los 
                <button 
                  type="button"
                  className="highlight-link"
                  onClick={() => setShowTermsModal(true)}
                > Términos de Servicio</button> y 
                <button 
                  type="button"
                  className="highlight-link"
                  onClick={() => setShowPrivacyModal(true)}
                > Políticas de Privacidad</button> de la plataforma
              </span>
            </label>
            {validationErrors.terms && <span className="error-text">{validationErrors.terms}</span>}

            {error && <div className="error-message">{error}</div>}

            <button 
              type="button" 
              className="signup-button"
              disabled={loading}
              onClick={onSubmit}
            >
              {loading ? "Creando cuenta..." : "Crear cuenta"}
            </button>

            
          </div>
        </div>
      </div>

      {/* Modal de Términos y Condiciones */}
      <Modal 
        isOpen={showTermsModal} 
        onClose={() => setShowTermsModal(false)}
        title="Términos y Condiciones"
      >
        <div className="terms-content">
          <h3>PRECISIÓN Y ELEGANCIA EN CADA MOMENTO</h3>
          
          <p><strong>Introducción.</strong> Esta página proporciona información sobre XAELOR y los términos y condiciones legales ("Términos") bajo los cuales usted puede acceder y hacer uso de nuestro sitio web, www.xaelor.com (el "Sitio"), así como realizar compras de nuestros productos.</p>
          
          <p>Estos Términos le indican quiénes somos, los términos y condiciones bajo los cuales ponemos el Sitio a su disposición, las formas en las que usted puede (y no puede) usar nuestro Sitio, y exenciones de responsabilidad y limitaciones importantes sobre nuestra responsabilidad que se aplican cuando usted visita nuestro Sitio o adquiere alguno de nuestros relojes.</p>

          <h4>1. Quiénes somos</h4>
          <p>XAELOR es una marca especializada en relojes de lujo y alta precisión. Nos dedicamos a la comercialización de relojes de las más prestigiosas marcas internacionales, así como a nuestra propia línea exclusiva. Nuestro compromiso es ofrecer productos de la más alta calidad, con diseños exclusivos y mecanismos de precisión.</p>

          <h4>2. Aplicación de estos Términos</h4>
          <p>Lea estos Términos detenidamente antes de comenzar a usar nuestro Sitio o realizar una compra. Al usar nuestro Sitio o comprar nuestros productos, usted indica que acepta estos Términos y que se compromete a cumplirlos. Si no acepta estos Términos, no está autorizado a usar nuestro Sitio ni a adquirir nuestros productos.</p>

          <h4>3. Productos y compras</h4>
          <p>Todos los relojes disponibles en nuestra tienda están sujetos a disponibilidad. Nos reservamos el derecho de cambiar los productos y precios en cualquier momento sin previo aviso. Las imágenes de los productos son representativas y pueden variar ligeramente del producto final.</p>

          <h4>4. Garantía y devoluciones</h4>
          <p>Todos nuestros relojes cuentan con una garantía de 2 años contra defectos de fabricación en condiciones normales de uso. Esta garantía no cubre daños causados por accidentes, mal uso, modificaciones no autorizadas o desgaste normal.</p>

          <h4>5. Envíos y entregas</h4>
          <p>Realizamos envíos a nivel nacional e internacional. Los tiempos de entrega pueden variar según su ubicación geográfica y disponibilidad del producto.</p>

          <h4>6. Propiedad intelectual</h4>
          <p>Todo el contenido de nuestro Sitio, incluyendo texto, imágenes, logotipos, diseños y software, es propiedad exclusiva de XAELOR o de sus licenciantes.</p>

          <h4>7. Contacto</h4>
          <p>Si tiene alguna pregunta sobre estos Términos, puede contactarnos en info@xaelor.com.</p>
          
          <p><em>Última actualización: Abril 2025</em></p>
        </div>
      </Modal>

      {/* Modal de Políticas de Privacidad */}
      <Modal 
        isOpen={showPrivacyModal} 
        onClose={() => setShowPrivacyModal(false)}
        title="Políticas de Privacidad"
      >
        <div className="privacy-content">
          <h3>POLÍTICA DE PRIVACIDAD - XAELOR</h3>
          
          <h4>1. Información que recopilamos</h4>
          <p>En XAELOR recopilamos información personal cuando usted:</p>
          <ul>
            <li>Crea una cuenta en nuestro sitio web</li>
            <li>Realiza una compra</li>
            <li>Se suscribe a nuestro boletín</li>
            <li>Contacta con nuestro servicio al cliente</li>
          </ul>
          
          <h4>2. Tipos de información personal</h4>
          <p>La información que podemos recopilar incluye:</p>
          <ul>
            <li>Nombre completo</li>
            <li>Dirección de correo electrónico</li>
            <li>Número de teléfono</li>
            <li>Dirección de facturación y envío</li>
            <li>Información de pago (procesada de forma segura)</li>
            <li>Historial de compras</li>
          </ul>

          <h4>3. Cómo utilizamos su información</h4>
          <p>Utilizamos su información personal para:</p>
          <ul>
            <li>Procesar y cumplir sus pedidos</li>
            <li>Proporcionar servicio al cliente</li>
            <li>Enviar actualizaciones sobre sus pedidos</li>
            <li>Mejorar nuestros productos y servicios</li>
            <li>Enviar comunicaciones de marketing (con su consentimiento)</li>
            <li>Cumplir con obligaciones legales</li>
          </ul>

          <h4>4. Compartir información</h4>
          <p>No vendemos, intercambiamos ni alquilamos su información personal a terceros. Podemos compartir información con:</p>
          <ul>
            <li>Proveedores de servicios de confianza que nos ayudan a operar nuestro negocio</li>
            <li>Autoridades legales cuando sea requerido por ley</li>
          </ul>

          <h4>5. Seguridad de datos</h4>
          <p>Implementamos medidas de seguridad técnicas y organizativas apropiadas para proteger su información personal contra acceso no autorizado, alteración, divulgación o destrucción.</p>

          <h4>6. Sus derechos</h4>
          <p>Usted tiene derecho a:</p>
          <ul>
            <li>Acceder a su información personal</li>
            <li>Corregir información inexacta</li>
            <li>Solicitar la eliminación de sus datos</li>
            <li>Oponerse al procesamiento de sus datos</li>
            <li>Retirar su consentimiento en cualquier momento</li>
          </ul>

          <h4>7. Cookies</h4>
          <p>Utilizamos cookies para mejorar su experiencia en nuestro sitio web. Puede controlar el uso de cookies a través de la configuración de su navegador.</p>

          <h4>8. Cambios en esta política</h4>
          <p>Nos reservamos el derecho de actualizar esta política de privacidad. Los cambios serán publicados en esta página con la fecha de última actualización.</p>

          <h4>9. Contacto</h4>
          <p>Para cualquier consulta sobre esta política de privacidad, contacte con nosotros en: privacy@xaelor.com</p>
          
          <p><em>Última actualización: Abril 2025</em></p>
        </div>
      </Modal>
    </>
  );
}