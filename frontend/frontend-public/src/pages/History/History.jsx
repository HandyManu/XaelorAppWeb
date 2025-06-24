import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import toast, { Toaster } from 'react-hot-toast';
import { config } from '../../config.jsx';

export default function PurchaseHistory() {
    const { user } = useAuth();
    const [sales, setSales] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchHistory() {
            if (!user?.id) return;
            setLoading(true);
            try {
                const res = await fetch(`${config.api.API_BASE}/sales/customer/${user.id}`);
                if (!res.ok) throw new Error('No se pudo obtener el historial');
                const data = await res.json();
                setSales(data);
            } catch {
                toast.error('Error al cargar el historial');
            }
            setLoading(false);
        }
        fetchHistory();
    }, [user]);

    return (
        <div style={{
            minHeight: '100vh',
            background: '#181512',
            padding: '2rem 0',
            fontFamily: 'system-ui, -apple-system, sans-serif'
        }}>
            <Toaster position="top-right" />
            <div style={{
                maxWidth: 900,
                margin: '0 auto',
                padding: '1.5rem',
            }}>
                <h1 style={{
                    color: '#ffe08a',
                    fontWeight: 'bold',
                    fontSize: '2rem',
                    marginBottom: 32,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10
                }}>
                    <span role="img" aria-label="historial">📜</span> Historial de compras
                </h1>
                {loading ? (
                    <div style={{ color: '#ffe08a', textAlign: 'center', margin: 32 }}>Cargando...</div>
                ) : sales.length === 0 ? (
                    <div style={{ color: '#ffe08a', textAlign: 'center', margin: 32 }}>
                        No tienes compras registradas.
                    </div>
                ) : (
                    sales.map(sale => (
                        <div key={sale._id} style={{
                            background: '#232323',
                            borderRadius: 12,
                            marginBottom: 28,
                            padding: 20,
                            boxShadow: '0 2px 12px 0 rgba(230,192,104,0.06)'
                        }}>
                            <div style={{ color: '#ffe08a', fontWeight: 'bold', fontSize: 18, marginBottom: 4 }}>
                                Compra del {new Date(sale.createdAt).toLocaleDateString()} - Total: ${sale.total.toLocaleString()}
                            </div>
                            <div style={{ color: '#bfa14a', fontSize: 15, marginBottom: 4 }}>
                                Estado: {sale.status} | Pago: {sale.selectedPaymentMethod}
                            </div>
                            <div style={{ color: '#ffd98a', fontSize: 15, marginBottom: 8 }}>
                                Dirección: {sale.address} <br />
                                Referencia: {sale.reference}
                            </div>
                            <div>
                                {sale.selectedProducts.map(prod => (
                                    <div key={prod._id} style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        marginBottom: 10,
                                        background: '#181512',
                                        borderRadius: 8,
                                        padding: 8
                                    }}>
                                        <img src={prod.watchId?.photos?.[0] || '/Images/Xaelör Noir Deluxe.svg'}
                                            alt={prod.watchId?.model}
                                            style={{
                                                width: 50, height: 50, borderRadius: 6, marginRight: 14, border: '1.5px solid #e6c068', objectFit: 'cover'
                                            }} />
                                        <div>
                                            <div style={{ color: '#ffe08a', fontWeight: 'bold' }}>{prod.watchId?.model}</div>
                                            <div style={{ color: '#bfa14a' }}>Cantidad: {prod.quantity} | Subtotal: ${prod.subtotal?.toLocaleString()}</div>
                                            <div style={{ color: '#a3a3a3', fontSize: 13 }}>Precio unitario: ${prod.watchId?.price}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}