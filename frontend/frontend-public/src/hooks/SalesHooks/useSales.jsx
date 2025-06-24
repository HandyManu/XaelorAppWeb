import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { config } from "../../config";

const API_BASE = config.api.API_BASE;

export function useUserSales() {
    const { authenticatedFetch } = useAuth();
    const [sales, setSales] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchSales = async () => {
            setIsLoading(true);
            setError("");
            try {
                const res = await authenticatedFetch(`${API_BASE}/sales/user`);
                if (!res.ok) throw new Error("Error al cargar compras");
                const data = await res.json();
                setSales(data);
            } catch (err) {
                setError(err.message);
                setSales([]);
            }
            setIsLoading(false);
        };
        fetchSales();
    }, [authenticatedFetch]);

    return { sales, isLoading, error };
}


