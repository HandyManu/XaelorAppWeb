import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { config } from '../../config';

const API_BASE = config.api.API_BASE;

export function useProducts(options = {}) {
    const { authenticatedFetch } = useAuth();
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const {
        category = null,
        limit = 8,
        sortBy = null,
        featured = null,
        autoLoad = true
    } = options;

    // Función para obtener productos desde el backend
    const fetchProducts = async (customOptions = {}) => {
        try {
            setIsLoading(true);
            setError('');
            
            // Construir parámetros de consulta
            const params = new URLSearchParams();
            
            const finalCategory = customOptions.category || category;
            const finalLimit = customOptions.limit || limit;
            const finalSortBy = customOptions.sortBy || sortBy;
            const finalFeatured = customOptions.featured || featured;

            if (finalCategory) params.append('category', finalCategory);
            if (finalLimit) params.append('limit', finalLimit.toString());
            if (finalSortBy) params.append('sortBy', finalSortBy);
            if (finalFeatured !== null) params.append('featured', finalFeatured.toString());
            
            const url = `${API_BASE}/watches${params.toString() ? `?${params}` : ''}`;
            console.log('Fetching products from:', url);
            
            const response = await authenticatedFetch(url, {
                credentials: 'include'
            });
            
            if (!response.ok) {
                throw new Error(`Error al cargar productos: ${response.status}`);
            }
            
            const data = await response.json();
            setProducts(data);
            
        } catch (error) {
            console.error('Error al cargar productos:', error);
            setError('No se pudieron cargar los productos');
            setProducts([]); // Fallback a array vacío
        } finally {
            setIsLoading(false);
        }
    };

    // Cargar productos automáticamente al montar el componente
    useEffect(() => {
        if (autoLoad) {
            fetchProducts();
        }
    }, [category, limit, sortBy, featured, autoLoad]);

    // Función para recargar productos manualmente
    const refetchProducts = (newOptions = {}) => {
        fetchProducts(newOptions);
    };

    return {
        products,
        isLoading,
        error,
        fetchProducts,
        refetchProducts
    };
}