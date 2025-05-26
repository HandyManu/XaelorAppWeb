import { useState } from 'react';
import { useAuth } from '../../context/AuthContext'; 

export function useBranchesManager() {
    const { authenticatedFetch, isAuthenticated, user } = useAuth();
    
    const [branches, setBranches] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [branchToDelete, setBranchToDelete] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [currentBranchId, setCurrentBranchId] = useState(null);

    // Estados de paginación
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);

    // Estados del formulario
    const [branch_name, setBranchName] = useState('');
    const [country, setCountry] = useState('');
    const [address, setAddress] = useState('');
    const [phone_number, setPhoneNumber] = useState('');
    const [business_hours, setBusinessHours] = useState([
        { day: 'Lunes', open: '08:00', close: '18:00' }
    ]);

    // Cálculos de paginación
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentBranches = branches.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(branches.length / itemsPerPage);

    // GET - Obtener todas las sucursales
    const fetchBranches = async () => {
        // Validar autenticación
        if (!isAuthenticated) {
            setError('Debes iniciar sesión para ver las sucursales.');
            return;
        }

        // Validar tipo de usuario
        if (!user || (user.userType !== 'admin' && user.userType !== 'employee')) {
            setError('No tienes permisos para ver las sucursales.');
            setBranches([]);
            return;
        }

        try {
            setIsLoading(true);
            setError('');
            
            const response = await authenticatedFetch('http://localhost:3333/api/branches');
            
            console.log('Respuesta del servidor:', response);
            
            if (!response.ok) {
                throw new Error(`Error al cargar las sucursales: ${response.status} ${response.statusText}`);
            }
            
            const data = await response.json();
            console.log('Sucursales recibidas:', data);
            setBranches(data);
        } catch (error) {
            console.error('Error al cargar sucursales:', error);
            setError('No se pudieron cargar las sucursales. ' + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    // POST/PUT - Crear o actualizar sucursal
    const handleSubmit = async (branchData) => {
        try {
            setIsLoading(true);
            setError('');
            
            // Usar los datos que vienen del modal
            const dataToSend = {
                branch_name: branchData.branch_name?.trim(),
                country: branchData.country?.trim(),
                address: branchData.address?.trim(),
                phone_number: branchData.phone_number?.trim(),
                business_hours: branchData.business_hours?.filter(hour => 
                    hour.day && hour.open && hour.close
                ) || []
            };

            // Validaciones
            if (!dataToSend.branch_name) {
                setError('El nombre de la sucursal es obligatorio');
                return;
            }
            
            if (!dataToSend.country) {
                setError('El país es obligatorio');
                return;
            }
            
            if (!dataToSend.address) {
                setError('La dirección es obligatoria');
                return;
            }
            
            if (!dataToSend.phone_number) {
                setError('El teléfono es obligatorio');
                return;
            }
            
            if (!dataToSend.business_hours || dataToSend.business_hours.length === 0) {
                setError('Los horarios de atención son obligatorios');
                return;
            }
            
            let response;
            
            if (branchData._id) {
                // Actualizar sucursal existente (PUT)
                console.log('Actualizando sucursal con ID:', branchData._id);
                
                response = await authenticatedFetch(`http://localhost:3333/api/branches/${branchData._id}`, {
                    method: 'PUT',
                    body: JSON.stringify(dataToSend),
                });
            } else {
                // Crear nueva sucursal (POST)
                console.log('Creando nueva sucursal');
                
                response = await authenticatedFetch('http://localhost:3333/api/branches', {
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
                        errorData.message.includes('phone_number')) {
                        throw new Error('Ya existe una sucursal con este número de teléfono');
                    }
                    if (errorData.message.includes('branch_name')) {
                        throw new Error('Ya existe una sucursal con este nombre');
                    }
                }
                
                throw new Error(errorData.message || `Error al ${branchData._id ? 'actualizar' : 'crear'} la sucursal`);
            }
            
            // Mostrar mensaje de éxito
            setSuccess(`Sucursal ${branchData._id ? 'actualizada' : 'creada'} exitosamente`);
            setTimeout(() => setSuccess(''), 3000);
            
            // Actualizar la lista de sucursales
            await fetchBranches();
            
            // Cerrar modal y limpiar formulario
            setShowModal(false);
            resetForm();
            
        } catch (error) {
            console.error(`Error al ${branchData._id ? 'actualizar' : 'crear'} sucursal:`, error);
            setError(error.message || `Error al ${branchData._id ? 'actualizar' : 'crear'} la sucursal`);
        } finally {
            setIsLoading(false);
        }
    };

    // Iniciar proceso de eliminación
    const handleDeleteBranch = (branchId, event = null) => {
        // Detener la propagación solo si event es un objeto de evento válido
        if (event && typeof event.stopPropagation === 'function') {
            event.stopPropagation();
        }
        
        if (!branchId) {
            console.error('ID de sucursal no válido');
            setError('Error: ID de sucursal no válido');
            return;
        }

        if (!isAuthenticated) {
            setError('Debes iniciar sesión para eliminar sucursales');
            return;
        }
        
        // Buscar la sucursal para mostrar en el modal
        const branchToDelete = branches.find(branch => branch._id === branchId);
        setBranchToDelete(branchToDelete);
        setShowDeleteModal(true);
    };

    // Confirmar eliminación
    const confirmDeleteBranch = async () => {
        if (!branchToDelete) return;
        
        try {
            setIsLoading(true);
            setError('');
            
            console.log('Intentando eliminar sucursal con ID:', branchToDelete._id);
            
            const response = await authenticatedFetch(`http://localhost:3333/api/branches/${branchToDelete._id}`, {
                method: 'DELETE',
            });
            
            console.log('Respuesta de eliminación:', response);
            
            if (!response.ok) {
                const errorData = await response.json();
                
                // Manejar errores específicos
                if (response.status === 404) {
                    throw new Error('La sucursal ya no existe o fue eliminada previamente');
                } else if (response.status === 403) {
                    throw new Error('No tienes permisos para eliminar esta sucursal');
                } else if (response.status === 409) {
                    throw new Error('No se puede eliminar la sucursal porque tiene datos relacionados');
                } else {
                    throw new Error(errorData.message || `Error al eliminar la sucursal: ${response.status} ${response.statusText}`);
                }
            }
            
            // Mostrar mensaje de éxito
            setSuccess(`Sucursal "${branchToDelete.branch_name}" eliminada exitosamente`);
            setTimeout(() => setSuccess(''), 4000);
            
            // Cerrar modal de confirmación
            setShowDeleteModal(false);
            setBranchToDelete(null);
            
            // Si estamos en la última página y eliminamos el último elemento, 
            // retroceder una página
            const newTotal = branches.length - 1;
            const newTotalPages = Math.ceil(newTotal / itemsPerPage);
            if (currentPage > newTotalPages && newTotalPages > 0) {
                setCurrentPage(newTotalPages);
            }
            
            // Actualizar la lista de sucursales
            await fetchBranches();
            
        } catch (error) {
            console.error('Error al eliminar sucursal:', error);
            setError(error.message || 'Error al eliminar la sucursal');
            
            // Limpiar el error después de 5 segundos
            setTimeout(() => setError(''), 5000);
        } finally {
            setIsLoading(false);
        }
    };

    // Cancelar eliminación
    const cancelDeleteBranch = () => {
        setShowDeleteModal(false);
        setBranchToDelete(null);
    };

    // Limpiar el formulario
    const resetForm = () => {
        setBranchName('');
        setCountry('');
        setAddress('');
        setPhoneNumber('');
        setBusinessHours([
            { day: 'Lunes', open: '08:00', close: '18:00' }
        ]);
        setIsEditing(false);
        setCurrentBranchId(null);
        setError('');
    };

    // Preparar la edición de una sucursal
    const handleEditBranch = (branch) => {
        // Establecer los datos en el estado del hook para el modal
        setBranchName(branch.branch_name || '');
        setCountry(branch.country || '');
        setAddress(branch.address || '');
        setPhoneNumber(branch.phone_number || '');
        setBusinessHours(branch.business_hours || [
            { day: 'Lunes', open: '08:00', close: '18:00' }
        ]);
        setIsEditing(true);
        setCurrentBranchId(branch._id);
        setShowModal(true);
    };

    // Manejar agregar nueva sucursal
    const handleAddNew = () => {
        resetForm();
        setShowModal(true);
    };

    // Manejar refrescar datos
    const handleRefresh = () => {
        fetchBranches();
    };

    return {
        // Estados
        branches,
        setBranches,
        showModal,
        setShowModal,
        showDeleteModal,
        setShowDeleteModal,
        branchToDelete,
        setBranchToDelete,
        isLoading,
        setIsLoading,
        error,
        setError,
        success,
        setSuccess,
        isEditing,
        setIsEditing,
        currentBranchId,
        setCurrentBranchId,
        
        // Estados de paginación
        currentPage,
        setCurrentPage,
        itemsPerPage,
        totalPages,
        currentBranches,
        
        // Estados del formulario
        branch_name,
        setBranchName,
        country,
        setCountry,
        address,
        setAddress,
        phone_number,
        setPhoneNumber,
        business_hours,
        setBusinessHours,
        
        // Funciones
        fetchBranches,
        handleSubmit,
        handleDeleteBranch,
        confirmDeleteBranch,
        cancelDeleteBranch,
        resetForm,
        handleEditBranch,
        handleAddNew,
        handleRefresh,
    };
}