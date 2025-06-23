import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { config } from '../../config';

const API_BASE = config.api.API_BASE;

export function useProductDetail(productId) {
    const { authenticatedFetch } = useAuth();
    const [product, setProduct] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    // Función para obtener el producto por ID
    const fetchProduct = async (id) => {
        if (!id) {
            setIsLoading(false);
            return;
        }

        try {
            setIsLoading(true);
            setError('');
            
            const response = await authenticatedFetch(`${API_BASE}/watches/${id}`, {
                credentials: 'include'
            });
            
            if (!response.ok) {
                throw new Error(`Error al cargar el producto: ${response.status}`);
            }
            
            const data = await response.json();
            setProduct(data);
            
        } catch (error) {
            console.error('Error al cargar producto:', error);
            setError('No se pudo cargar la información del producto');
        } finally {
            setIsLoading(false);
        }
    };

    // Cargar producto cuando cambie el ID
    useEffect(() => {
        fetchProduct(productId);
    }, [productId]);

    // Función para agregar al carrito (opcional)
    const addToCart = async (quantity = 1, selectedColor = null) => {
        if (!product) return;

        try {
            setIsLoading(true);
            
            const cartData = {
                productId: product._id,
                quantity,
                selectedColor,
                price: product.price
            };

            const response = await authenticatedFetch(`${API_BASE}/cart/add`, {
                method: 'POST',
                body: JSON.stringify(cartData)
            });

            if (!response.ok) {
                throw new Error('Error al agregar al carrito');
            }

            return { success: true, message: 'Producto agregado al carrito' };
            
        } catch (error) {
            console.error('Error al agregar al carrito:', error);
            return { success: false, message: error.message };
        } finally {
            setIsLoading(false);
        }
    };

    return {
        product,
        isLoading,
        error,
        fetchProduct,
        addToCart
    };
}