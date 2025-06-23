import { useState, useEffect } from 'react';
import { config } from '../../config';

const API_BASE = config.api.API_BASE;

export function useProducts() {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    // Cargar máximo 8 productos
    const fetchProducts = async () => {
        try {
            setIsLoading(true);
            setError('');

            const url = `${API_BASE}/watches?limit=8`;
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Error al cargar productos: ${response.status}`);
            }

            const data = await response.json();
            setProducts(data);
        } catch (error) {
            console.error('Error al cargar productos:', error);
            setError('No se pudieron cargar los productos');
            setProducts([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    return {
        products,
        isLoading,
        error,
        fetchProducts
    };
}