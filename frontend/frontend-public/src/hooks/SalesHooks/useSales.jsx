import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { config } from "../../config";

const API_BASE = config.api.API_BASE;

export function useSales() {
    const { userId } = useAuth(); // Obtener el ID del usuario desde el contexto
    const [sales, setSales] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const currentSales = sales.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const fetchSales = async () => {
        try {
            setIsLoading(true);
            setError("");

            if (!userId) {
                throw new Error("El ID del usuario es requerido para cargar las ventas.");
            }

            const url = `${API_BASE}/sales?userId=${userId}`;
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Error al cargar ventas: ${response.status}`);
            }

            const data = await response.json();
            setSales(data);
        } catch (error) {
            console.error("Error al cargar ventas:", error);
            setError("No se pudieron cargar las ventas");
            setSales([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchSales();
    }, [userId]);

    return {
        sales,
        currentSales,
        isLoading,
        error,
        currentPage,
        setCurrentPage,
        itemsPerPage,
        setItemsPerPage,
        fetchSales,
    };
}