import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { config } from '../../config';

const API_BASE = config.api.API_BASE;

export function useReviewsManager() {
    const { authenticatedFetch, isAuthenticated, user } = useAuth();
    
    const [reviews, setReviews] = useState([]);
    const [watches, setWatches] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [reviewToDelete, setReviewToDelete] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Estados de paginación
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(9);

    // GET - Obtener todos los relojes para referenciar en las reseñas
    const fetchWatches = async () => {
        try {
            const response = await authenticatedFetch(`${API_BASE}/watches`, {
                credentials: 'include'
            });
            if (response.ok) {
                const data = await response.json();
                setWatches(data);
            } else {
                console.error('Error al cargar relojes:', response.status);
            }
        } catch (error) {
            console.error('Error al cargar relojes:', error);
        }
    };

    // GET - Obtener todos los clientes para referenciar en las reseñas
    const fetchCustomers = async () => {
        try {
            const response = await authenticatedFetch(`${API_BASE}/customers`, {
                credentials: 'include'
            });
            if (response.ok) {
                const data = await response.json();
                setCustomers(data);
            } else {
                console.error('Error al cargar clientes:', response.status);
            }
        } catch (error) {
            console.error('Error al cargar clientes:', error);
        }
    };

    // GET - Obtener todas las reseñas
    const fetchReviews = async () => {
        if (!isAuthenticated) {
            setError('Debes iniciar sesión para ver las reseñas.');
            return;
        }
        if (!user || (user.userType !== 'admin' && user.userType !== 'employee')) {
            setError('No tienes permisos para ver las reseñas.');
            setReviews([]);
            return;
        }
        try {
            setError('');
            setIsLoading(true);
            const response = await authenticatedFetch(`${API_BASE}/reviews`, {
                credentials: 'include'
            });
            if (!response.ok) {
                throw new Error(`Error al cargar las reseñas: ${response.status} ${response.statusText}`);
            }
            const data = await response.json();
            setReviews(data);
        } catch (error) {
            setError('No se pudieron cargar las reseñas. ' + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    // Función para cargar todos los datos iniciales
    const loadInitialData = async () => {
        try {
            setIsLoading(true);
            setError('');
            await Promise.all([
                fetchReviews(),
                fetchWatches(), 
                fetchCustomers()
            ]);
        } catch (error) {
            setError('Error al cargar los datos de las reseñas');
        } finally {
            setIsLoading(false);
        }
    };

    // DELETE - Eliminar reseña
    const handleDeleteReview = (reviewId, event = null) => {
        if (event && typeof event.stopPropagation === 'function') {
            event.stopPropagation();
        }
        if (!reviewId) {
            setError('Error: ID de reseña no válido');
            return;
        }
        if (!isAuthenticated) {
            setError('Debes iniciar sesión para eliminar reseñas');
            return;
        }
        if (!user || user.userType !== 'admin') {
            setError('Solo los administradores pueden eliminar reseñas');
            return;
        }
        const reviewToDelete = reviews.find(review => 
            (review._id?.$oid || review._id) === reviewId
        );
        setReviewToDelete(reviewToDelete);
        setShowDeleteModal(true);
    };

    // Confirmar eliminación
    const confirmDeleteReview = async () => {
        if (!reviewToDelete) return;
        try {
            setIsLoading(true);
            setError('');
            const reviewId = reviewToDelete._id?.$oid || reviewToDelete._id;
            const response = await authenticatedFetch(`${API_BASE}/reviews/${reviewId}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                const errorData = await response.json();
                if (response.status === 404) {
                    throw new Error('La reseña ya no existe o fue eliminada previamente');
                } else if (response.status === 403) {
                    throw new Error('No tienes permisos para eliminar esta reseña');
                } else {
                    throw new Error(errorData.message || `Error al eliminar la reseña: ${response.status} ${response.statusText}`);
                }
            }
            setSuccess('Reseña eliminada exitosamente');
            setTimeout(() => setSuccess(''), 4000);
            setShowDeleteModal(false);
            setReviewToDelete(null);
            await fetchReviews();
        } catch (error) {
            setError(error.message || 'Error al eliminar la reseña');
            setTimeout(() => setError(''), 5000);
        } finally {
            setIsLoading(false);
        }
    };

    // Cancelar eliminación
    const cancelDeleteReview = () => {
        setShowDeleteModal(false);
        setReviewToDelete(null);
    };

    // Manejar refrescar datos
    const handleRefresh = () => {
        loadInitialData();
    };

    // Función para obtener información del reloj
    const getWatchInfo = (watchId) => {
        const id = watchId?._id || watchId?.$oid || watchId;
        return watches.find(w => w._id === id);
    };

    // Función para obtener información del cliente
    const getCustomerInfo = (customerId) => {
        const id = customerId?._id || customerId?.$oid || customerId;
        return customers.find(c => c._id === id);
    };

    // Función para filtrar/ordenar reseñas
    const getFilteredReviews = (sortBy = '', searchTerm = '') => {
        let filtered = [...reviews];
        if (searchTerm.trim()) {
            filtered = filtered.filter(review => {
                const watch = getWatchInfo(review.watchId);
                const customer = getCustomerInfo(review.customerId);
                return (
                    watch?.model?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    customer?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    customer?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    review.message?.toLowerCase().includes(searchTerm.toLowerCase())
                );
            });
        }
        switch (sortBy) {
            case 'date-new':
                return filtered.sort((a, b) => 
                    new Date(b.date?.$date || b.date) - new Date(a.date?.$date || a.date)
                );
            case 'date-old':
                return filtered.sort((a, b) => 
                    new Date(a.date?.$date || a.date) - new Date(b.date?.$date || b.date)
                );
            case 'rating-high':
                return filtered.sort((a, b) => b.rating - a.rating);
            case 'rating-low':
                return filtered.sort((a, b) => a.rating - b.rating);
            case 'customer':
                return filtered.sort((a, b) => {
                    const customerA = getCustomerInfo(a.customerId);
                    const customerB = getCustomerInfo(b.customerId);
                    return (customerA?.name || '').localeCompare(customerB?.name || '');
                });
            case 'product':
                return filtered.sort((a, b) => {
                    const watchA = getWatchInfo(a.watchId);
                    const watchB = getWatchInfo(b.watchId);
                    return (watchA?.model || '').localeCompare(watchB?.model || '');
                });
            default:
                return filtered.sort((a, b) => 
                    new Date(b.date?.$date || b.date) - new Date(a.date?.$date || a.date)
                );
        }
    };

    // Calcular estadísticas
    const getTotalReviews = () => reviews.length;
    const getAverageRating = () => {
        if (reviews.length === 0) return 0;
        const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
        return totalRating / reviews.length;
    };
    const getRatingCount = (rating) => {
        return reviews.filter(r => r.rating === rating).length;
    };
    const getRecentReviews = () => {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        return reviews.filter(r => {
            const reviewDate = new Date(r.date?.$date || r.date);
            return reviewDate > oneWeekAgo;
        }).length;
    };

    // Función para renderizar estrellas
    const renderStars = (rating) => {
        return Array.from({ length: 5 }, (_, i) => (
            i < rating ? '⭐' : '☆'
        )).join('');
    };

    return {
        reviews,
        setReviews,
        watches,
        setWatches,
        customers,
        setCustomers,
        showDeleteModal,
        setShowDeleteModal,
        reviewToDelete,
        setReviewToDelete,
        isLoading,
        setIsLoading,
        error,
        setError,
        success,
        setSuccess,
        currentPage,
        setCurrentPage,
        itemsPerPage,
        setItemsPerPage,
        loadInitialData,
        fetchReviews,
        fetchWatches,
        fetchCustomers,
        handleDeleteReview,
        confirmDeleteReview,
        cancelDeleteReview,
        handleRefresh,
        getWatchInfo,
        getCustomerInfo,
        getFilteredReviews,
        getTotalReviews,
        getAverageRating,
        getRatingCount,
        getRecentReviews,
        renderStars,
    };
}