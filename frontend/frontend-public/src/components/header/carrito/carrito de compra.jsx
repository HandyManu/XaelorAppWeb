import React from 'react';
import './carrito de compra.css'; // Importar el archivo CSS

function CarritoDeCompra() {
    return (
        <div className="carrito-de-compra">
            {/* Mostrar el logo del carrito */}
            <img 
                src="/public/Images/carrito.svg " 
                alt="Carrito de compra" 
                className="carrito-logo" 
            />
        </div>
    );
}

export default CarritoDeCompra;