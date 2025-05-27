import { useState } from 'react';
import { useAuth } from '../../context/AuthContext'; 
import { config } from '../../config';

const API_BASE = config.api.API_BASE;

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
        if (!isAuthenticated) {
            setError('Debes iniciar sesión para ver las sucursales.');
            return;
        }
        if (!user || (user.userType !== 'admin' && user.userType !== 'employee')) {
            setError('No tienes permisos para ver las sucursales.');
            setBranches([]);
            return;
        }
        try {
            setIsLoading(true);
            setError('');
            const response = await authenticatedFetch(`${API_BASE}/branches`);
            if (!response.ok) {
                throw new Error(`Error al cargar las sucursales: ${response.status} ${response.statusText}`);
            }
            const data = await response.json();
            setBranches(data);
        } catch (error) {
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
            const dataToSend = {
                branch_name: branchData.branch_name?.trim(),
                country: branchData.country?.trim(),
                address: branchData.address?.trim(),
                phone_number: branchData.phone_number?.trim(),
                business_hours: branchData.business_hours?.filter(hour => 
                    hour.day && hour.open && hour.close
                ) || []
            };
            if (!dataToSend.branch_name) { setError('El nombre de la sucursal es obligatorio'); return; }
            if (!dataToSend.country) { setError('El país es obligatorio'); return; }
            if (!dataToSend.address) { setError('La dirección es obligatoria'); return; }
            if (!dataToSend.phone_number) { setError('El teléfono es obligatorio'); return; }
            if (!dataToSend.business_hours || dataToSend.business_hours.length === 0) {
                setError('Los horarios de atención son obligatorios'); return;
            }
            let response;
            if (branchData._id) {
                response = await authenticatedFetch(`${API_BASE}/branches/${branchData._id}`, {
                    method: 'PUT',
                    body: JSON.stringify(dataToSend),
                });
            } else {
                response = await authenticatedFetch(`${API_BASE}/branches`, {
                    method: 'POST',
                    body: JSON.stringify(dataToSend),
                });
            }
            if (!response.ok) {
                const errorData = await response.json();
                if (response.status === 400 && errorData.message) {
                    if (errorData.message.includes('duplicate') || errorData.message.includes('phone_number')) {
                        throw new Error('Ya existe una sucursal con este número de teléfono');
                    }
                    if (errorData.message.includes('branch_name')) {
                        throw new Error('Ya existe una sucursal con este nombre');
                    }
                }
                throw new Error(errorData.message || `Error al ${branchData._id ? 'actualizar' : 'crear'} la sucursal`);
            }
            setSuccess(`Sucursal ${branchData._id ? 'actualizada' : 'creada'} exitosamente`);
            setTimeout(() => setSuccess(''), 3000);
            await fetchBranches();
            setShowModal(false);
            resetForm();
        } catch (error) {
            setError(error.message || `Error al ${branchData._id ? 'actualizar' : 'crear'} la sucursal`);
        } finally {
            setIsLoading(false);
        }
    };

    // Iniciar proceso de eliminación
    const handleDeleteBranch = (branchId, event = null) => {
        if (event && typeof event.stopPropagation === 'function') {
            event.stopPropagation();
        }
        if (!branchId) {
            setError('Error: ID de sucursal no válido');
            return;
        }
        if (!isAuthenticated) {
            setError('Debes iniciar sesión para eliminar sucursales');
            return;
        }
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
            const response = await authenticatedFetch(`${API_BASE}/branches/${branchToDelete._id}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                const errorData = await response.json();
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
            setSuccess(`Sucursal "${branchToDelete.branch_name}" eliminada exitosamente`);
            setTimeout(() => setSuccess(''), 4000);
            setShowDeleteModal(false);
            setBranchToDelete(null);
            const newTotal = branches.length - 1;
            const newTotalPages = Math.ceil(newTotal / itemsPerPage);
            if (currentPage > newTotalPages && newTotalPages > 0) {
                setCurrentPage(newTotalPages);
            }
            await fetchBranches();
        } catch (error) {
            setError(error.message || 'Error al eliminar la sucursal');
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