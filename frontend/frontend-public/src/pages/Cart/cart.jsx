import React from 'react';
import { useAuth } from '../../context/AuthContext';
import './LatestLaunches.css';

function LatestLaunches() {
  const { user } = useAuth();

  // Simulación de productos en el carrito (reemplaza esto con tu lógica real)
  const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
  const total = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleOrder = () => {
      alert('Pedido enviado correctamente');
      // Aquí puedes agregar la lógica para enviar el pedido al backend
  };

  return (
    <div className="latest-launches-container">
        <div className="cart-container">
            <h2>Carrito de compras</h2>
            <div className="user-details">
                <h3>Detalles del usuario</h3>
                <p><strong>Nombre:</strong> {user?.name || 'No disponible'}</p>
                <p><strong>Email:</strong> {user?.email || 'No disponible'}</p>
            </div>
            <div className="cart-items">
                <h3>Productos</h3>
                {cartItems.length === 0 ? (
                    <p>El carrito está vacío.</p>
                ) : (
                    <table>
                        <thead>
                            <tr>
                                <th>Producto</th>
                                <th>Precio</th>
                                <th>Cantidad</th>
                                <th>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cartItems.map((item, idx) => (
                                <tr key={idx}>
                                    <td>{item.model}</td>
                                    <td>${item.price}</td>
                                    <td>{item.quantity}</td>
                                    <td>${item.price * item.quantity}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
            <div className="cart-total">
                <h3>Total: ${total}</h3>
            </div>
            <button className="order-btn" onClick={handleOrder} disabled={cartItems.length === 0}>
                Enviar pedido
            </button>
        </div>
    </div>
  );
}

export default LatestLaunches;