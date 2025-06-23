import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { config } from '../../config.jsx';
import { useAuth } from '../../context/AuthContext';

export default function Cart() {
    const { user } = useAuth();
    const [cart, setCart] = useState([]);
    const [products, setProducts] = useState([]);
    const [address, setAddress] = useState('');
    const [reference, setReference] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
        setCart(storedCart);
    }, []);

    useEffect(() => {
        async function fetchProducts() {
            if (cart.length === 0) {
                setProducts([]);
                return;
            }
            try {
                const productPromises = cart.map(item =>
                    fetch(`${config.api.API_BASE}/watches/${item.productId}`)
                        .then(res => res.json())
                );
                const productsData = await Promise.all(productPromises);
                setProducts(productsData);
            } catch {
                toast.error('Error al cargar productos');
            }
        }
        fetchProducts();
    }, [cart]);

    const getTotal = () => {
        return cart.reduce((acc, item) => {
            const prod = products.find(p => p._id === item.productId);
            return acc + (prod ? prod.price * item.quantity : 0);
        }, 0);
    };

    const updateQuantity = (productId, newQty) => {
        const updatedCart = cart.map(item =>
            item.productId === productId ? { ...item, quantity: Math.max(1, newQty) } : item
        );
        setCart(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
    };

    const removeFromCart = (productId) => {
        const updatedCart = cart.filter(item => item.productId !== productId);
        setCart(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
        toast('Producto eliminado', {
            style: {
                background: '#232323',
                color: '#ffe08a',
                border: '1.5px solid #e6c068',
                fontWeight: 'bold'
            },
            iconTheme: {
                primary: '#ffe08a',
                secondary: '#232323'
            }
        });
    };

    const handleCheckout = async (e) => {
        e.preventDefault();
        if (!address || !reference || !paymentMethod) {
            toast.error('Completa todos los campos');
            return;
        }
        if (cart.length === 0) {
            toast.error('El carrito está vacío');
            return;
        }
        setLoading(true);

        const customerId = user?.id;
        if (!customerId) {
            toast.error('Debes iniciar sesión para comprar');
            setLoading(false);
            return;
        }
        const employeeId = "67acd0e50a6d1c53a6669ec7";

        const selectedProducts = cart.map(item => {
            const prod = products.find(p => p._id === item.productId);
            return {
                watchId: item.productId,
                quantity: item.quantity,
                subtotal: prod ? prod.price * item.quantity : 0
            };
        });

        const total = getTotal();

        try {
            const res = await fetch(`${config.api.API_BASE}/sales`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    customerId,
                    employeeId,
                    address,
                    reference,
                    status: "Shipped",
                    selectedPaymentMethod: paymentMethod,
                    total,
                    selectedProducts
                })
            });
            if (!res.ok) {
                throw new Error('Error al procesar la venta');
            }
            toast.success('¡Compra realizada con éxito!', {
                style: {
                    background: '#232323',
                    color: '#ffe08a',
                    border: '1.5px solid #e6c068',
                    fontWeight: 'bold'
                },
                iconTheme: {
                    primary: '#ffe08a',
                    secondary: '#232323'
                }
            });
            localStorage.removeItem('cart');
            setCart([]);
            setTimeout(() => navigate('/'), 2000);
        } catch {
            toast.error('Error al realizar la compra');
        }
        setLoading(false);
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: '#181512',
            padding: '2rem 0',
            fontFamily: 'system-ui, -apple-system, sans-serif'
        }}>
            <Toaster position="top-right" />
            <div style={{
                maxWidth: 1100,
                margin: '0 auto',
                display: 'flex',
                flexWrap: 'wrap',
                gap: '2rem',
                justifyContent: 'center',
                alignItems: 'flex-start'
            }}>
                <div style={{ flex: '2 1 400px', minWidth: 340 }}>
                    <h1 style={{
                        color: '#ffe08a',
                        fontWeight: 'bold',
                        fontSize: '2rem',
                        marginBottom: 24,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10
                    }}>
                        <span role="img" aria-label="carrito">🛒</span> Carrito de compras
                    </h1>
                    {cart.length === 0 ? (
                        <div style={{ color: '#ffe08a', textAlign: 'center', margin: 32 }}>
                            Tu carrito está vacío.<br />
                            <button className="add-to-cart-btn" onClick={() => navigate('/')}>Ir a la tienda</button>
                        </div>
                    ) : (
                        <div>
                            {cart.map((item, idx) => {
                                const prod = products.find(p => p._id === item.productId);
                                if (!prod) return null;
                                return (
                                    <div key={item.productId} style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        background: '#232323',
                                        borderRadius: 14,
                                        marginBottom: 18,
                                        padding: 18,
                                        boxShadow: '0 2px 12px 0 rgba(230,192,104,0.06)'
                                    }}>
                                        <img src={prod.photos?.[0] || '/Images/Xaelör Noir Deluxe.svg'}
                                            alt={prod.model}
                                            style={{
                                                width: 90, height: 90, borderRadius: 10, objectFit: 'cover', marginRight: 22, border: '1.5px solid #e6c068'
                                            }} />
                                        <div style={{ flex: 1 }}>
                                            <div style={{ color: '#ffe08a', fontWeight: 'bold', fontSize: 20, marginBottom: 4 }}>{prod.model}</div>
                                            <div style={{ color: '#bfa14a', fontSize: 16, marginBottom: 6 }}>Precio: ${prod.price?.toLocaleString()}</div>
                                            <div style={{ color: '#ffd98a', fontSize: 15, display: 'flex', alignItems: 'center', gap: 8 }}>
                                                Cantidad:
                                                <button onClick={() => updateQuantity(item.productId, item.quantity - 1)} disabled={item.quantity <= 1}
                                                    style={{
                                                        margin: '0 4px', fontWeight: 'bold', background: '#232323', color: '#ffe08a', border: '1px solid #e6c068', borderRadius: 6, width: 28, height: 28, fontSize: 18, cursor: 'pointer'
                                                    }}>-</button>
                                                <span style={{ minWidth: 24, textAlign: 'center', fontWeight: 'bold' }}>{item.quantity}</span>
                                                <button onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                                                    style={{
                                                        margin: '0 4px', fontWeight: 'bold', background: '#232323', color: '#ffe08a', border: '1px solid #e6c068', borderRadius: 6, width: 28, height: 28, fontSize: 18, cursor: 'pointer'
                                                    }}>+</button>
                                            </div>
                                        </div>
                                        <button onClick={() => removeFromCart(item.productId)}
                                            style={{
                                                background: '#ff4b4b', color: '#fff', marginLeft: 18, border: 'none', borderRadius: 8, padding: '10px 22px', fontWeight: 'bold', fontSize: 16, cursor: 'pointer', transition: 'background 0.2s'
                                            }}>Eliminar</button>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
                {/* Formulario de datos de envío y pago */}
                <form onSubmit={handleCheckout} style={{
                    flex: '1 1 320px',
                    minWidth: 320,
                    background: '#232323',
                    borderRadius: 14,
                    padding: 28,
                    color: '#ffe08a',
                    boxShadow: '0 2px 12px 0 rgba(230,192,104,0.06)',
                    marginTop: 38,
                    height: 'fit-content'
                }}>
                    <div style={{ marginBottom: 18 }}>
                        <label style={{ fontWeight: 'bold' }}>Dirección de envío:</label>
                        <input
                            type="text"
                            value={address}
                            onChange={e => setAddress(e.target.value)}
                            required
                            style={{
                                width: '100%', padding: 10, borderRadius: 7, border: '1.5px solid #e6c068', marginTop: 6,
                                background: '#181512', color: '#ffe08a', fontSize: 15
                            }}
                        />
                    </div>
                    <div style={{ marginBottom: 18 }}>
                        <label style={{ fontWeight: 'bold' }}>Referencia:</label>
                        <input
                            type="text"
                            value={reference}
                            onChange={e => setReference(e.target.value)}
                            required
                            style={{
                                width: '100%', padding: 10, borderRadius: 7, border: '1.5px solid #e6c068', marginTop: 6,
                                background: '#181512', color: '#ffe08a', fontSize: 15
                            }}
                        />
                    </div>
                    <div style={{ marginBottom: 18 }}>
                        <label style={{ fontWeight: 'bold' }}>Método de pago:</label>
                        <select
                            value={paymentMethod}
                            onChange={e => setPaymentMethod(e.target.value)}
                            required
                            style={{
                                width: '100%', padding: 10, borderRadius: 7, border: '1.5px solid #e6c068', marginTop: 6,
                                background: '#181512', color: '#ffe08a', fontSize: 15
                            }}
                        >
                            <option value="">Selecciona un método</option>
                            <option value="PayPal">PayPal</option>
                            <option value="Tarjeta">Tarjeta</option>
                            <option value="Transferencia">Transferencia</option>
                        </select>
                    </div>
                    <div style={{
                        textAlign: 'right', marginTop: 24, display: 'flex', flexDirection: 'column', gap: 12
                    }}>
                        <div style={{ color: '#ffe08a', fontSize: 22, fontWeight: 'bold' }}>
                            Total: ${getTotal().toLocaleString()}
                        </div>
                        <button
                            className="add-to-cart-btn"
                            style={{
                                marginTop: 8, fontSize: 18, background: '#e6c068', color: '#232323', border: 'none',
                                borderRadius: 8, padding: '12px 0', fontWeight: 'bold', cursor: 'pointer', transition: 'background 0.2s'
                            }}
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? 'Procesando...' : 'Realizar compra'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}