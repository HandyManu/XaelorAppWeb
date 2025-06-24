import React from "react";
import { useUserSales } from "../../hooks/SalesHooks/useSales";
import Sales from "./Sales.CSS";

export default function SalesPage() {
    const { sales, isLoading, error } = useUserSales();

    if (isLoading) return <div>Cargando historial...</div>;
    if (error) return <div style={{ color: "red" }}>{error}</div>;
    if (sales.length === 0) return <div>No tienes compras registradas.</div>;

    return (
        <div style={{ maxWidth: 800, margin: "0 auto", padding: 24 }}>
            <h2 style={{ color: "#ffe08a" }}>Historial de Compras</h2>
            {sales.map(sale => (
                <div key={sale._id} style={{
                    background: "#232323",
                    color: "#ffe08a",
                    borderRadius: 10,
                    margin: "18px 0",
                    padding: 18
                }}>
                    <div><b>Fecha:</b> {new Date(sale.createdAt).toLocaleString()}</div>
                    <div><b>Estado:</b> {sale.status}</div>
                    <div><b>Total:</b> ${sale.total?.toLocaleString()}</div>
                    <div>
                        <b>Productos:</b>
                        <ul>
                            {sale.selectedProducts.map((prod, idx) => (
                                <li key={idx}>
                                    {prod.watchId?.model || "Producto"} x{prod.quantity} - ${prod.subtotal?.toLocaleString()}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            ))}
        </div>
    );
}