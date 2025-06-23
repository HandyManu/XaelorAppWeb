import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { config } from '../../config';

const API_BASE = config.api.API_BASE;

export function useReview(watchId) {
    const { authenticatedFetch, user, authCokie } = useAuth();
    const [reviews, setReviews] = useState([]);
    const [userReview, setUserReview] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Función para decodificar el JWT y obtener el userId
    const getUserIdFromToken = () => {
        try {
            const token = authCokie || localStorage.getItem('authToken');
            if (!token) {
                console.log("No hay token disponible");
                return null;
            }

            // Decodificar JWT (sin verificar, solo para obtener el payload)
            const payload = JSON.parse(atob(token.split('.')[1]));
            console.log("Token payload:", payload);
            
            // El ID puede estar en diferentes campos dependiendo de cómo esté estructurado tu JWT
            return payload.userId || payload.id || payload._id || payload.customerId;
        } catch (error) {
            console.error('Error al decodificar token:', error);
            return null;
        }
    };

    // Cargar reseñas del producto
    const fetchReviews = async () => {
        if (!watchId) return;

        try {
            setIsLoading(true);
            setError('');
            
            console.log("Intentando cargar reseñas desde:", `${API_BASE}/reviews`);
            
            const response = await authenticatedFetch(`${API_BASE}/reviews`, {
                credentials: 'include'
            });
            
            if (!response.ok) {
                throw new Error('Error al cargar las reseñas');
            }
            
            const data = await response.json();
            console.log("Reseñas cargadas:", data);
            
            // Filtrar reseñas por watchId
            const productReviews = data.filter(review => 
                review.watchId && review.watchId._id === watchId
            );
            
            setReviews(productReviews);
            
            // Buscar si el usuario ya tiene una reseña
            const userId = getUserIdFromToken();
            if (userId) {
                const existingUserReview = productReviews.find(review => 
                    review.customerId && review.customerId._id === userId
                );
                setUserReview(existingUserReview || null);
            }
            
        } catch (error) {
            console.error('Error al cargar reseñas:', error);
            setError('No se pudieron cargar las reseñas');
        } finally {
            setIsLoading(false);
        }
    };

    // Crear nueva reseña
    const createReview = async (reviewData) => {
        console.log("=== DEBUG CREAR RESEÑA ===");
        console.log("watchId:", watchId);
        console.log("authCokie:", authCokie);
        console.log("user completo:", user);
        console.log("reviewData:", reviewData);

        const userId = getUserIdFromToken();
        console.log("userId extraído del token:", userId);

        if (!userId) {
            setError('Error: No se pudo obtener el ID del usuario del token. Inicia sesión nuevamente.');
            return { success: false };
        }

        if (!watchId) {
            setError('Error: No se encontró el ID del producto');
            return { success: false };
        }

        try {
            setIsSubmitting(true);
            setError('');
            setSuccess('');
            
            const newReview = {
                watchId: watchId,
                customerId: userId,
                message: reviewData.message,
                rating: reviewData.rating,
                date: new Date().toISOString()
            };

            console.log("Datos de la reseña a enviar:", newReview);
            console.log("URL del endpoint:", `${API_BASE}/reviews`);

            const response = await authenticatedFetch(`${API_BASE}/reviews`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newReview)
            });

            console.log("Response status:", response.status);

            if (!response.ok) {
                const errorText = await response.text();
                console.log("Error response:", errorText);
                try {
                    const errorData = JSON.parse(errorText);
                    throw new Error(errorData.message || 'Error al crear la reseña');
                } catch (parseError) {
                    throw new Error(`Error del servidor (${response.status}): ${errorText}`);
                }
            }

            const data = await response.json();
            console.log("Reseña creada exitosamente:", data);
            
            setSuccess('¡Reseña enviada exitosamente!');
            
            // Recargar las reseñas para mostrar la nueva
            await fetchReviews();
            
            return { success: true, message: data.message };
            
        } catch (error) {
            console.error('Error detallado al crear reseña:', error);
            console.error('Stack trace:', error.stack);
            
            let errorMessage = 'Error al enviar la reseña';
            
            if (error.message.includes('Failed to fetch')) {
                errorMessage = 'Error de conexión con el servidor. Verifica que el servidor esté funcionando.';
            } else if (error.message.includes('ERR_CONNECTION_RESET')) {
                errorMessage = 'Conexión perdida con el servidor. Intenta nuevamente.';
            } else {
                errorMessage = error.message;
            }
            
            setError(errorMessage);
            return { success: false, message: errorMessage };
        } finally {
            setIsSubmitting(false);
        }
    };

    // Actualizar reseña existente
    const updateReview = async (reviewId, reviewData) => {
        const userId = getUserIdFromToken();
        
        if (!userId) {
            setError('Error: No se pudo obtener el ID del usuario del token');
            return { success: false };
        }

        try {
            setIsSubmitting(true);
            setError('');
            setSuccess('');
            
            const updatedReview = {
                watchId: watchId,
                customerId: userId,
                message: reviewData.message,
                rating: reviewData.rating,
                date: new Date().toISOString()
            };

            console.log("Actualizando reseña:", reviewId, updatedReview);

            const response = await authenticatedFetch(`${API_BASE}/reviews/${reviewId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedReview)
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.log("Error al actualizar:", errorText);
                try {
                    const errorData = JSON.parse(errorText);
                    throw new Error(errorData.message || 'Error al actualizar la reseña');
                } catch (parseError) {
                    throw new Error(`Error del servidor (${response.status}): ${errorText}`);
                }
            }

            const data = await response.json();
            setSuccess('¡Reseña actualizada exitosamente!');
            
            // Recargar las reseñas para mostrar los cambios
            await fetchReviews();
            
            return { success: true, message: data.message };
            
        } catch (error) {
            console.error('Error al actualizar reseña:', error);
            setError(error.message || 'Error al actualizar la reseña');
            return { success: false, message: error.message };
        } finally {
            setIsSubmitting(false);
        }
    };

    // Eliminar reseña
    const deleteReview = async (reviewId) => {
        const userId = getUserIdFromToken();
        
        if (!userId) {
            setError('No tienes permisos para eliminar esta reseña');
            return { success: false };
        }

        try {
            setIsSubmitting(true);
            setError('');
            
            const response = await authenticatedFetch(`${API_BASE}/reviews/${reviewId}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al eliminar la reseña');
            }

            setSuccess('Reseña eliminada exitosamente');
            
            // Recargar las reseñas
            await fetchReviews();
            
            return { success: true };
            
        } catch (error) {
            console.error('Error al eliminar reseña:', error);
            setError(error.message || 'Error al eliminar la reseña');
            return { success: false, message: error.message };
        } finally {
            setIsSubmitting(false);
        }
    };

    // Calcular estadísticas de las reseñas
    const getReviewStats = () => {
        if (reviews.length === 0) {
            return {
                averageRating: 0,
                totalReviews: 0,
                ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
            };
        }

        const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
        const averageRating = totalRating / reviews.length;
        
        const ratingDistribution = reviews.reduce((dist, review) => {
            const rating = Math.round(review.rating); // Ya viene de 1-5
            dist[rating] = (dist[rating] || 0) + 1;
            return dist;
        }, { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 });

        return {
            averageRating: averageRating, // Ya está en escala 1-5
            totalReviews: reviews.length,
            ratingDistribution
        };
    };

    // Limpiar mensajes
    const clearMessages = () => {
        setError('');
        setSuccess('');
    };

    // Cargar reseñas al montar el componente o cambiar watchId
    useEffect(() => {
        fetchReviews();
    }, [watchId, user]);

    return {
        reviews,
        userReview,
        isLoading,
        isSubmitting,
        error,
        success,
        createReview,
        updateReview,
        deleteReview,
        fetchReviews,
        getReviewStats,
        clearMessages,
        canReview: !!getUserIdFromToken() && !userReview
    };
}