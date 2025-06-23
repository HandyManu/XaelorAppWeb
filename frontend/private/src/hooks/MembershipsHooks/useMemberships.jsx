import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { config } from '../../config';

const API_BASE = config.api.API_BASE;

export function useMembershipsManager() {
    const { authenticatedFetch, isAuthenticated, user } = useAuth();
    
    const [memberships, setMemberships] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [membershipToDelete, setMembershipToDelete] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [currentMembershipId, setCurrentMembershipId] = useState(null);

    // Estados de paginación
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(6);

    // Estados del formulario
    const [membershipTier, setMembershipTier] = useState('');
    const [price, setPrice] = useState(0);
    const [benefits, setBenefits] = useState('');
    const [discount, setDiscount] = useState(0);

    // GET - Obtener todas las membresías
    const fetchMemberships = async () => {
        // Validar autenticación
        if (!isAuthenticated) {
            setError('Debes iniciar sesión para ver las membresías.');
            return;
        }

        // Validar tipo de usuario (admin y employee pueden ver membresías)
        if (!user || (user.userType !== 'admin' && user.userType !== 'employee')) {
            setError('No tienes permisos para ver las membresías.');
            setMemberships([]);
            return;
        }

        try {
            setError('');
            
            const response = await authenticatedFetch(`${API_BASE}/memberships`, {
                credentials: 'include'
            });
            
            
            if (!response.ok) {
                let errorMessage = `Error al cargar las membresías: ${response.status} ${response.statusText}`;
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.message || errorMessage;
                    console.log('Error del servidor:', errorData);
                } catch (jsonError) {
                    console.log('No se pudo parsear el error como JSON:', jsonError);
                }
                throw new Error(errorMessage);
            }
            
            const data = await response.json();
            setMemberships(data);
        } catch (error) {
            console.error('Error al cargar membresías:', error);
            setError('No se pudieron cargar las membresías. ' + error.message);
        }
    };

    // Función para cargar todos los datos iniciales
    const loadInitialData = async () => {
        try {
            setIsLoading(true);
            setError('');
            
            // Solo cargar membresías
            await fetchMemberships();
            
        } catch (error) {
            console.error('Error al cargar datos iniciales:', error);
            setError('Error al cargar los datos de membresías');
        } finally {
            setIsLoading(false);
        }
    };

    // POST/PUT - Crear o actualizar membresía
    const handleSubmit = async (membershipData) => {
        try {
            setIsLoading(true);
            setError('');
            
            // Usar los datos que vienen del modal
            const dataToSend = {
                membershipTier: membershipData.membershipTier?.trim(),
                price: parseFloat(membershipData.price) || 0,
                benefits: membershipData.benefits?.trim(),
                discount: parseFloat(membershipData.discount) || 0
            };

            // Validaciones
            if (!dataToSend.membershipTier) {
                setError('El tier de membresía es obligatorio');
                return;
            }
            
            if (dataToSend.price <= 0) {
                setError('El precio debe ser mayor a 0');
                return;
            }
            
            if (!dataToSend.benefits) {
                setError('Los beneficios son obligatorios');
                return;
            }

            if (dataToSend.discount < 0 || dataToSend.discount > 0.5) {
                setError('El descuento debe estar entre 0% y 50%');
                return;
            }
            
            let response;
            
            if (membershipData._id) {
                // Actualizar membresía existente (PUT)
                
                response = await authenticatedFetch(`${API_BASE}/memberships/${membershipData._id}`, {
                    method: 'PUT',
                    body: JSON.stringify(dataToSend),
                });
            } else {
                // Crear nueva membresía (POST)
                console.log('Creando nueva membresía');
                
                response = await authenticatedFetch(`${API_BASE}/memberships`, {
                    method: 'POST',
                    body: JSON.stringify(dataToSend),
                });
            }
            
            console.log('Respuesta del servidor:', response);
            
            if (!response.ok) {
                const errorData = await response.json();
                
                // Manejar errores específicos
                if (response.status === 400 && errorData.message) {
                    if (errorData.message.includes('duplicate') || 
                        errorData.message.includes('membershipTier')) {
                        throw new Error('Ya existe una membresía con este tier');
                    }
                }
                
                throw new Error(errorData.message || `Error al ${membershipData._id ? 'actualizar' : 'crear'} la membresía`);
            }
            
            // Mostrar mensaje de éxito
            setSuccess(`Membresía ${membershipData._id ? 'actualizada' : 'creada'} exitosamente`);
            setTimeout(() => setSuccess(''), 3000);
            
            // Actualizar la lista de membresías
            await fetchMemberships();
            
            // Cerrar modal y limpiar formulario
            setShowModal(false);
            resetForm();
            
        } catch (error) {
            console.error(`Error al ${membershipData._id ? 'actualizar' : 'crear'} membresía:`, error);
            setError(error.message || `Error al ${membershipData._id ? 'actualizar' : 'crear'} la membresía`);
        } finally {
            setIsLoading(false);
        }
    };

    // Iniciar proceso de eliminación
    const handleDeleteMembership = (membershipId, event = null) => {
        // Detener la propagación solo si event es un objeto de evento válido
        if (event && typeof event.stopPropagation === 'function') {
            event.stopPropagation();
        }
        
        if (!membershipId) {
            console.error('ID de membresía no válido');
            setError('Error: ID de membresía no válido');
            return;
        }

        if (!isAuthenticated) {
            setError('Debes iniciar sesión para eliminar membresías');
            return;
        }
        
        // Buscar la membresía para mostrar en el modal
        const membershipToDelete = memberships.find(membership => membership._id === membershipId);
        setMembershipToDelete(membershipToDelete);
        setShowDeleteModal(true);
    };

    // Confirmar eliminación
    const confirmDeleteMembership = async () => {
        if (!membershipToDelete) return;
        
        try {
            setIsLoading(true);
            setError('');
            
            
            const response = await authenticatedFetch(`${API_BASE}/memberships/${membershipToDelete._id}`, {
                method: 'DELETE',
            });
            
            console.log('Respuesta de eliminación:', response);
            
            if (!response.ok) {
                const errorData = await response.json();
                
                // Manejar errores específicos
                if (response.status === 404) {
                    throw new Error('La membresía ya no existe o fue eliminada previamente');
                } else if (response.status === 403) {
                    throw new Error('No tienes permisos para eliminar esta membresía');
                } else if (response.status === 409) {
                    throw new Error('No se puede eliminar la membresía porque tiene clientes asociados');
                } else {
                    throw new Error(errorData.message || `Error al eliminar la membresía: ${response.status} ${response.statusText}`);
                }
            }
            
            // Mostrar mensaje de éxito
            setSuccess(`Membresía "${membershipToDelete.membershipTier}" eliminada exitosamente`);
            setTimeout(() => setSuccess(''), 4000);
            
            // Cerrar modal de confirmación
            setShowDeleteModal(false);
            setMembershipToDelete(null);
            
            // Si estamos en la última página y eliminamos el último elemento, 
            // retroceder una página
            const newTotal = memberships.length - 1;
            const newTotalPages = Math.ceil(newTotal / itemsPerPage);
            if (currentPage > newTotalPages && newTotalPages > 0) {
                setCurrentPage(newTotalPages);
            }
            
            // Actualizar la lista de membresías
            await fetchMemberships();
            
        } catch (error) {
            console.error('Error al eliminar membresía:', error);
            setError(error.message || 'Error al eliminar la membresía');
            
            // Limpiar el error después de 5 segundos
            setTimeout(() => setError(''), 5000);
        } finally {
            setIsLoading(false);
        }
    };

    // Cancelar eliminación
    const cancelDeleteMembership = () => {
        setShowDeleteModal(false);
        setMembershipToDelete(null);
    };

    // Limpiar el formulario
    const resetForm = () => {
        setMembershipTier('');
        setPrice(0);
        setBenefits('');
        setDiscount(0);
        setIsEditing(false);
        setCurrentMembershipId(null);
        setError('');
    };

    // Preparar la edición de una membresía
    const handleEditMembership = (membership) => {
        // Establecer los datos en el estado del hook para el modal
        setMembershipTier(membership.membershipTier || '');
        setPrice(membership.price || 0);
        setBenefits(membership.benefits || '');
        setDiscount(membership.discount || 0);
        setIsEditing(true);
        setCurrentMembershipId(membership._id);
        setShowModal(true);
        
    };

    // Manejar agregar nueva membresía
    const handleAddNew = () => {
        resetForm();
        setShowModal(true);
    };

    // Manejar refrescar datos
    const handleRefresh = () => {
        loadInitialData();
    };

    // Función para filtrar/ordenar membresías
    const getFilteredMemberships = (sortBy = '', searchTerm = '') => {
        let filtered = [...memberships];
        
        // Filtrar por término de búsqueda
        if (searchTerm.trim()) {
            filtered = filtered.filter(membership => 
                membership.membershipTier?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                membership.benefits?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        
        // Aplicar ordenamiento
        switch (sortBy) {
            case 'tier':
                // Ordenamiento inteligente que prioriza tiers conocidos y luego alfabético
                const knownTiers = ['basic', 'bronze', 'silver', 'gold', 'platinum', 'diamond', 'premium', 'vip', 'elite', 'ultimate'];
                return filtered.sort((a, b) => {
                    const tierA = a.membershipTier?.toLowerCase() || '';
                    const tierB = b.membershipTier?.toLowerCase() || '';
                    
                    const indexA = knownTiers.indexOf(tierA);
                    const indexB = knownTiers.indexOf(tierB);
                    
                    // Si ambos están en la lista conocida, ordenar por índice
                    if (indexA !== -1 && indexB !== -1) {
                        return indexA - indexB;
                    }
                    
                    // Si solo uno está en la lista, ese va primero
                    if (indexA !== -1) return -1;
                    if (indexB !== -1) return 1;
                    
                    // Si ninguno está en la lista, ordenar alfabéticamente
                    return tierA.localeCompare(tierB);
                });
            case 'price-low':
                return filtered.sort((a, b) => (a.price || 0) - (b.price || 0));
            case 'price-high':
                return filtered.sort((a, b) => (b.price || 0) - (a.price || 0));
            case 'discount-low':
                return filtered.sort((a, b) => (a.discount || 0) - (b.discount || 0));
            case 'discount-high':
                return filtered.sort((a, b) => (b.discount || 0) - (a.discount || 0));
            default:
                // Por defecto, ordenar por tier usando la misma lógica
                const defaultKnownTiers = ['basic', 'bronze', 'silver', 'gold', 'platinum', 'diamond', 'premium', 'vip', 'elite', 'ultimate'];
                return filtered.sort((a, b) => {
                    const tierA = a.membershipTier?.toLowerCase() || '';
                    const tierB = b.membershipTier?.toLowerCase() || '';
                    
                    const indexA = defaultKnownTiers.indexOf(tierA);
                    const indexB = defaultKnownTiers.indexOf(tierB);
                    
                    if (indexA !== -1 && indexB !== -1) {
                        return indexA - indexB;
                    }
                    if (indexA !== -1) return -1;
                    if (indexB !== -1) return 1;
                    return tierA.localeCompare(tierB);
                });
        }
    };

    // Calcular estadísticas
    const getTotalMemberships = () => memberships.length;

    const getAveragePrice = () => {
        if (memberships.length === 0) return 0;
        const total = memberships.reduce((sum, m) => sum + (m.price || 0), 0);
        return total / memberships.length;
    };

    const getAverageDiscount = () => {
        if (memberships.length === 0) return 0;
        const total = memberships.reduce((sum, m) => sum + (m.discount || 0), 0);
        return (total / memberships.length) * 100; // Convertir a porcentaje
    };

    const getHighestPrice = () => {
        if (memberships.length === 0) return 0;
        return Math.max(...memberships.map(m => m.price || 0));
    };

    return {
        // Estados
        memberships,
        setMemberships,
        showModal,
        setShowModal,
        showDeleteModal,
        setShowDeleteModal,
        membershipToDelete,
        setMembershipToDelete,
        isLoading,
        setIsLoading,
        error,
        setError,
        success,
        setSuccess,
        isEditing,
        setIsEditing,
        currentMembershipId,
        setCurrentMembershipId,
        
        // Estados de paginación
        currentPage,
        setCurrentPage,
        itemsPerPage,
        setItemsPerPage,
        
        // Estados del formulario
        membershipTier,
        setMembershipTier,
        price,
        setPrice,
        benefits,
        setBenefits,
        discount,
        setDiscount,
        
        // Funciones
        loadInitialData,
        fetchMemberships,
        handleSubmit,
        handleDeleteMembership,
        confirmDeleteMembership,
        cancelDeleteMembership,
        resetForm,
        handleEditMembership,
        handleAddNew,
        handleRefresh,
        getFilteredMemberships,
        getTotalMemberships,
        getAveragePrice,
        getAverageDiscount,
        getHighestPrice,
    };
}