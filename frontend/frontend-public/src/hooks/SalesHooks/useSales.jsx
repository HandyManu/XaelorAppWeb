import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { config } from "../../config";

const API_BASE = config.api.API_BASE;

export function useUserSales() {
    const { authenticatedFetch, user } = useAuth();
    const [sales, setSales] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchSales = async () => {
            // Verificar si el usuario está autenticado
            if (!user) {
                setError("Usuario no autenticado");
                return;
            }

            setIsLoading(true);
            setError("");
            
            try {
                console.log("Obteniendo ventas del usuario..."); // Debug
                const res = await authenticatedFetch(`${API_BASE}/sales/user`);
                
                if (!res.ok) {
                    const errorData = await res.json().catch(() => ({}));
                    throw new Error(errorData.message || `Error ${res.status}`);
                }
                
                const data = await res.json();
                console.log("Ventas obtenidas:", data); // Debug
                setSales(data || []);
            } catch (err) {
                console.error("Error al obtener ventas:", err);
                setError(err.message || "Error desconocido al cargar compras");
                setSales([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchSales();
    }, [authenticatedFetch, user]);

    return { sales, isLoading, error };
}