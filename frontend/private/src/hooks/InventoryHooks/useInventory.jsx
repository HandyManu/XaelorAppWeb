import { useState } from 'react';
import { useAuth } from '../../context/AuthContext'; 

export function useInventoryManager() {
    const { authenticatedFetch, isAuthenticated, user } = useAuth();
    
    const [inventories, setInventories] = useState([]);
    const [watches, setWatches] = useState([]);
    const [branches, setBranches] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [inventoryToDelete, setInventoryToDelete] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [currentInventoryId, setCurrentInventoryId] = useState(null);

    // Estados de paginación
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(6);

    // Estados del formulario
    const [watchId, setWatchId] = useState('');
    const [branchId, setBranchId] = useState('');
    const [stockChange, setStockChange] = useState(0);
    const [operation, setOperation] = useState('add');
    const [notes, setNotes] = useState('');
    const [currentStock, setCurrentStock] = useState(0);

    // GET - Obtener todos los relojes para el dropdown
    const fetchWatches = async () => {
        try {
            const response = await authenticatedFetch('http://localhost:3333/api/watches');
            if (response.ok) {
                const data = await response.json();
                console.log('Relojes recibidos:', data);
                setWatches(data);
            } else {
                console.error('Error al cargar relojes:', response.status);
            }
        } catch (error) {
            console.error('Error al cargar relojes:', error);
        }
    };

    // GET - Obtener todas las sucursales para el dropdown
    const fetchBranches = async () => {
        try {
            const response = await authenticatedFetch('http://localhost:3333/api/branches');
            if (response.ok) {
                const data = await response.json();
                console.log('Sucursales recibidas:', data);
                setBranches(data);
            } else {
                console.error('Error al cargar sucursales:', response.status);
            }
        } catch (error) {
            console.error('Error al cargar sucursales:', error);
        }
    };

    // GET - Obtener todos los inventarios
    const fetchInventories = async () => {
        // Validar autenticación
        if (!isAuthenticated) {
            setError('Debes iniciar sesión para ver el inventario.');
            return;
        }

        // Validar tipo de usuario
        if (!user || (user.userType !== 'admin' && user.userType !== 'employee')) {
            setError('No tienes permisos para ver el inventario.');
            setInventories([]);
            return;
        }

        try {
            setIsLoading(true);
            setError('');
            
            const response = await authenticatedFetch('http://localhost:3333/api/inventories');
            
            console.log('Respuesta del servidor inventario:', response);
            
            if (!response.ok) {
                throw new Error(`Error al cargar el inventario: ${response.status} ${response.statusText}`);
            }
            
            const data = await response.json();
            console.log('Inventarios recibidos:', data);
            
            // Procesar inventarios para calcular stock actual
            const processedInventories = data.map(inventory => ({
                ...inventory,
                calculatedStock: calculateStockFromMovements(inventory)
            }));
            
            setInventories(processedInventories);
        } catch (error) {
            console.error('Error al cargar inventarios:', error);
            setError('No se pudieron cargar los inventarios. ' + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    // POST/PUT - Crear o actualizar inventario
    const handleSubmit = async (inventoryData) => {
        try {
            setIsLoading(true);
            setError('');
            
            let dataToSend;
            
            if (isEditing) {
                // Para actualización: agregar un nuevo movimiento
                dataToSend = {
                    movementType: inventoryData.operation, // 'add' o 'subtract'
                    quantity: inventoryData.stockChange,
                    notes: inventoryData.notes || '',
                    date: new Date().toISOString()
                };
                
                console.log('Enviando movimiento de inventario:', dataToSend);
            } else {
                // Para creación: crear inventario inicial
                dataToSend = {
                    watchId: inventoryData.watchId,
                    branchId: inventoryData.branchId,
                    initialStock: inventoryData.stockChange,
                    notes: inventoryData.notes || 'Stock inicial'
                };
                
                console.log('Creando inventario inicial:', dataToSend);
            }

            // Validaciones
            if (!isEditing) {
                if (!dataToSend.watchId) {
                    setError('El reloj es obligatorio');
                    return;
                }
                
                if (!dataToSend.branchId) {
                    setError('La sucursal es obligatoria');
                    return;
                }
                
                if (!dataToSend.initialStock || dataToSend.initialStock <= 0) {
                    setError('El stock inicial debe ser mayor a 0');
                    return;
                }
            } else {
                if (!dataToSend.quantity || dataToSend.quantity <= 0) {
                    setError('La cantidad debe ser mayor a 0');
                    return;
                }
                
                // Validar que no se reste más stock del disponible
                if (dataToSend.movementType === 'subtract' && dataToSend.quantity > currentStock) {
                    setError('No se puede restar más stock del disponible');
                    return;
                }
            }
            
            let response;
            
            if (isEditing && currentInventoryId) {
                // Agregar movimiento a inventario existente (PUT)
                console.log('Agregando movimiento a inventario con ID:', currentInventoryId);
                
                response = await authenticatedFetch(`http://localhost:3333/api/inventories/${currentInventoryId}/movement`, {
                    method: 'PUT',
                    body: JSON.stringify(dataToSend),
                });
            } else {
                // Crear nuevo inventario (POST)
                console.log('Creando nuevo inventario');
                
                response = await authenticatedFetch('http://localhost:3333/api/inventories', {
                    method: 'POST',
                    body: JSON.stringify(dataToSend),
                });
            }
            
            console.log('Respuesta del servidor:', response);
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `Error al ${isEditing ? 'actualizar' : 'crear'} el inventario`);
            }
            
            // Obtener la respuesta para manejar el caso de inventario existente
            const responseData = await response.json();
            
            // Mostrar mensaje de éxito apropiado
            let successMessage;
            if (isEditing) {
                successMessage = inventoryData.operation === 'add' ? 'Stock agregado exitosamente' : 'Stock reducido exitosamente';
            } else {
                // Para creación, verificar si era un inventario existente
                if (responseData.isExisting) {
                    successMessage = 'Inventario existente, se agregó movimiento en su lugar';
                } else {
                    successMessage = 'Inventario creado exitosamente';
                }
            }
            
            setSuccess(successMessage);
            setTimeout(() => setSuccess(''), 4000);
            
            // Actualizar la lista de inventarios
            await fetchInventories();
            
            // Cerrar modal y limpiar formulario
            setShowModal(false);
            resetForm();
            
        } catch (error) {
            console.error(`Error al ${isEditing ? 'actualizar' : 'crear'} inventario:`, error);
            setError(error.message || `Error al ${isEditing ? 'actualizar' : 'crear'} el inventario`);
        } finally {
            setIsLoading(false);
        }
    };

    // DELETE - Eliminar inventario
    const handleDeleteInventory = (inventoryId, event = null) => {
        if (event && typeof event.stopPropagation === 'function') {
            event.stopPropagation();
        }
        
        if (!inventoryId) {
            console.error('ID de inventario no válido');
            setError('Error: ID de inventario no válido');
            return;
        }

        if (!isAuthenticated) {
            setError('Debes iniciar sesión para eliminar inventarios');
            return;
        }
        
        // Buscar el inventario para mostrar en el modal
        const inventoryToDelete = inventories.find(inventory => inventory._id === inventoryId);
        setInventoryToDelete(inventoryToDelete);
        setShowDeleteModal(true);
    };

    // Confirmar eliminación
    const confirmDeleteInventory = async () => {
        if (!inventoryToDelete) return;
        
        try {
            setIsLoading(true);
            setError('');
            
            console.log('Intentando eliminar inventario con ID:', inventoryToDelete._id);
            
            const response = await authenticatedFetch(`http://localhost:3333/api/inventories/${inventoryToDelete._id}`, {
                method: 'DELETE',
            });
            
            console.log('Respuesta de eliminación:', response);
            
            if (!response.ok) {
                const errorData = await response.json();
                
                // Manejar errores específicos
                if (response.status === 404) {
                    throw new Error('El registro de inventario ya no existe o fue eliminado previamente');
                } else if (response.status === 403) {
                    throw new Error('No tienes permisos para eliminar este inventario');
                } else {
                    throw new Error(errorData.message || `Error al eliminar el inventario: ${response.status} ${response.statusText}`);
                }
            }
            
            // Mostrar mensaje de éxito
            setSuccess('Registro de inventario eliminado exitosamente');
            setTimeout(() => setSuccess(''), 4000);
            
            // Cerrar modal de confirmación
            setShowDeleteModal(false);
            setInventoryToDelete(null);
            
            // Actualizar la lista de inventarios
            await fetchInventories();
            
        } catch (error) {
            console.error('Error al eliminar inventario:', error);
            setError(error.message || 'Error al eliminar el inventario');
            
            // Limpiar el error después de 5 segundos
            setTimeout(() => setError(''), 5000);
        } finally {
            setIsLoading(false);
        }
    };

    // Cancelar eliminación
    const cancelDeleteInventory = () => {
        setShowDeleteModal(false);
        setInventoryToDelete(null);
    };

    // Limpiar el formulario
    const resetForm = () => {
        setWatchId('');
        setBranchId('');
        setStockChange(0);
        setOperation('add');
        setNotes('');
        setCurrentStock(0);
        setIsEditing(false);
        setCurrentInventoryId(null);
        setError('');
    };

    // Preparar la edición de un inventario
    const handleEditInventory = (inventory) => {
        // Establecer los datos en el estado del hook para el modal
        setWatchId(inventory.watchId?._id || inventory.watchId || '');
        setBranchId(inventory.branchId?._id || inventory.branchId || '');
        setStockChange(0);
        setOperation('add');
        setNotes('');
        
        // Usar el stock calculado
        const calculatedStock = inventory.calculatedStock || calculateStockFromMovements(inventory);
        setCurrentStock(calculatedStock);
        setIsEditing(true);
        setCurrentInventoryId(inventory._id);
        setShowModal(true);
        
        // Cargar relojes y sucursales cuando se abre el modal
        fetchWatches();
        fetchBranches();
        
        console.log('Modal abierto para editar inventario:', {
            inventoryId: inventory._id,
            calculatedStock,
            directStock: inventory.stock,
            movements: inventory.movements?.length || 0,
            watchId: inventory.watchId,
            branchId: inventory.branchId
        });
    };

    // Manejar agregar nuevo inventario
    const handleAddNew = () => {
        resetForm();
        setShowModal(true);
        // Cargar relojes y sucursales cuando se abre el modal
        fetchWatches();
        fetchBranches();
        console.log('Modal abierto para nuevo inventario, cargando datos...');
    };

    // Manejar refrescar datos
    const handleRefresh = () => {
        fetchInventories();
    };

    // Función para obtener información del reloj
    const getWatchInfo = (watchId) => {
        const id = watchId?._id || watchId;
        return watches.find(w => w._id === id);
    };

    // Función para obtener información de la sucursal
    const getBranchInfo = (branchId) => {
        const id = branchId?._id || branchId;
        return branches.find(b => b._id === id);
    };

    // Función para filtrar/ordenar inventarios
    const getFilteredInventories = (sortBy = '', searchTerm = '', branchFilter = '') => {
        let filtered = [...inventories];
        
        // Filtrar por sucursal
        if (branchFilter && branchFilter !== 'all') {
            filtered = filtered.filter(inventory => {
                const branchId = inventory.branchId?._id || inventory.branchId;
                return branchId === branchFilter;
            });
        }
        
        // Filtrar por término de búsqueda
        if (searchTerm.trim()) {
            filtered = filtered.filter(inventory => {
                const watch = getWatchInfo(inventory.watchId);
                const branch = getBranchInfo(inventory.branchId);
                return (
                    watch?.model?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    branch?.branch_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    branch?.address?.toLowerCase().includes(searchTerm.toLowerCase())
                );
            });
        }
        
        // Aplicar ordenamiento
        switch (sortBy) {
            case 'stock-low':
                return filtered.sort((a, b) => 
                    (a.calculatedStock || calculateStockFromMovements(a)) - (b.calculatedStock || calculateStockFromMovements(b))
                );
            case 'stock-high':
                return filtered.sort((a, b) => 
                    (b.calculatedStock || calculateStockFromMovements(b)) - (a.calculatedStock || calculateStockFromMovements(a))
                );
            case 'model':
                return filtered.sort((a, b) => {
                    const watchA = getWatchInfo(a.watchId);
                    const watchB = getWatchInfo(b.watchId);
                    return (watchA?.model || '').localeCompare(watchB?.model || '');
                });
            case 'branch':
                return filtered.sort((a, b) => {
                    const branchA = getBranchInfo(a.branchId);
                    const branchB = getBranchInfo(b.branchId);
                    return (branchA?.branch_name || '').localeCompare(branchB?.branch_name || '');
                });
            case 'value':
                return filtered.sort((a, b) => {
                    const watchA = getWatchInfo(a.watchId);
                    const watchB = getWatchInfo(b.watchId);
                    const stockA = a.calculatedStock || calculateStockFromMovements(a);
                    const stockB = b.calculatedStock || calculateStockFromMovements(b);
                    const valueA = (watchA?.price || 0) * stockA;
                    const valueB = (watchB?.price || 0) * stockB;
                    return valueB - valueA;
                });
            case 'recent':
                return filtered.sort((a, b) => {
                    const lastMovementA = getLastMovement(a);
                    const lastMovementB = getLastMovement(b);
                    const dateA = lastMovementA ? new Date(lastMovementA.date) : new Date(0);
                    const dateB = lastMovementB ? new Date(lastMovementB.date) : new Date(0);
                    return dateB - dateA;
                });
            default:
                // Por defecto, ordenar por modelo
                return filtered.sort((a, b) => {
                    const watchA = getWatchInfo(a.watchId);
                    const watchB = getWatchInfo(b.watchId);
                    return (watchA?.model || '').localeCompare(watchB?.model || '');
                });
        }
    };

    // Función para calcular stock actual desde movimientos
    const calculateStockFromMovements = (inventory) => {
        if (!inventory.movements || !Array.isArray(inventory.movements)) {
            return inventory.stock || 0; // Fallback al stock directo
        }
        
        return inventory.movements.reduce((total, movement) => {
            switch (movement.type) {
                case 'initial':
                case 'add':
                    return total + (movement.quantity || 0);
                case 'subtract':
                    return total - (movement.quantity || 0);
                default:
                    return total;
            }
        }, 0);
    };

    // Calcular estadísticas
    const getTotalStock = () => {
        return inventories.reduce((total, inv) => {
            return total + (inv.calculatedStock || calculateStockFromMovements(inv));
        }, 0);
    };

    const getTotalValue = () => {
        return inventories.reduce((total, inv) => {
            const watch = getWatchInfo(inv.watchId);
            const stock = inv.calculatedStock || calculateStockFromMovements(inv);
            return total + (watch?.price || 0) * stock;
        }, 0);
    };

    // Función para obtener el último movimiento
    const getLastMovement = (inventory) => {
        if (!inventory.movements || inventory.movements.length === 0) {
            return null;
        }
        
        return inventory.movements
            .sort((a, b) => new Date(b.date) - new Date(a.date))[0];
    };

    return {
        // Estados
        inventories,
        setInventories,
        watches,
        setWatches,
        branches,
        setBranches,
        showModal,
        setShowModal,
        showDeleteModal,
        setShowDeleteModal,
        inventoryToDelete,
        setInventoryToDelete,
        isLoading,
        setIsLoading,
        error,
        setError,
        success,
        setSuccess,
        isEditing,
        setIsEditing,
        currentInventoryId,
        setCurrentInventoryId,
        
        // Estados de paginación
        currentPage,
        setCurrentPage,
        itemsPerPage,
        setItemsPerPage,
        
        // Estados del formulario
        watchId,
        setWatchId,
        branchId,
        setBranchId,
        stockChange,
        setStockChange,
        operation,
        setOperation,
        notes,
        setNotes,
        currentStock,
        setCurrentStock,
        
        // Funciones
        fetchInventories,
        fetchWatches,
        fetchBranches,
        handleSubmit,
        handleDeleteInventory,
        confirmDeleteInventory,
        cancelDeleteInventory,
        resetForm,
        handleEditInventory,
        handleAddNew,
        handleRefresh,
        getWatchInfo,
        getBranchInfo,
        getFilteredInventories,
        getTotalStock,
        getTotalValue,
        calculateStockFromMovements,
        getLastMovement,
    };
}