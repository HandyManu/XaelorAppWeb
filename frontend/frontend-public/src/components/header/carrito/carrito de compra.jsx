import React from 'react';
import './carrito de compra.css'; // Importar el archivo CSS

function CarritoDeCompra() {
    return (
        <div className="carrito-de-compra">
            {/* Mostrar el logo del carrito */}
            
            <a href="/carrito" style={{ color: '#ffe08a', marginLeft: 16 }}><img 
                src="/Images/carrito.svg " 
                alt="Carrito de compra" 
                className="carrito-logo" 
            /></a>
        </div>
    );
}

export default CarritoDeCompra;