import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { config } from '../../config';

const API_BASE = config.api.API_BASE;

export function useSalesManager() {
    const { authenticatedFetch, isAuthenticated, user } = useAuth();
    
    const [sales, setSales] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [products, setProducts] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [saleToDelete, setSaleToDelete] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [currentSaleId, setCurrentSaleId] = useState(null);

    // Estados de paginación
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(9);

    // Estados del formulario
    const [customerId, setCustomerId] = useState('');
    const [employeeId, setEmployeeId] = useState('');
    const [address, setAddress] = useState('');
    const [reference, setReference] = useState('');
    const [status, setStatus] = useState('Processing');
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('Credit Card');
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [total, setTotal] = useState(0);

    // GET - Obtener todos los clientes para el dropdown
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

    // GET - Obtener todos los empleados para el dropdown
    const fetchEmployees = async () => {
        try {
            const response = await authenticatedFetch(`${API_BASE}/employees`, {
                credentials: 'include'
            });
            if (response.ok) {
                const data = await response.json();
                setEmployees(data);
            } else {
                console.error('Error al cargar empleados:', response.status);
            }
        } catch (error) {
            console.error('Error al cargar empleados:', error);
        }
    };

    // GET - Obtener todos los productos para el dropdown
    const fetchProducts = async () => {
        try {
            const response = await authenticatedFetch(`${API_BASE}/watches`, {
                credentials: 'include'
            });
            if (response.ok) {
                const data = await response.json();
                setProducts(data);
            } else {
                console.error('Error al cargar productos:', response.status);
            }
        } catch (error) {
            console.error('Error al cargar productos:', error);
        }
    };

    // GET - Obtener todas las ventas
    const fetchSales = async () => {
        // Validar autenticación
        if (!isAuthenticated) {
            setError('Debes iniciar sesión para ver las ventas.');
            return;
        }

        // Validar tipo de usuario
        if (!user || (user.userType !== 'admin' && user.userType !== 'employee')) {
            setError('No tienes permisos para ver las ventas.');
            setSales([]);
            return;
        }

        try {
            setError('');
            
            const response = await authenticatedFetch(`${API_BASE}/sales`, {
                credentials: 'include'
            });
            
            if (!response.ok) {
                throw new Error(`Error al cargar las ventas: ${response.status} ${response.statusText}`);
            }
            
            const data = await response.json();
            setSales(data);
            
        } catch (error) {
            console.error('Error al cargar ventas:', error);
            setError('No se pudieron cargar las ventas. ' + error.message);
        }
    };

    // Función para cargar todos los datos iniciales
    const loadInitialData = async () => {
        try {
            setIsLoading(true);
            setError('');
            
            // Cargar ventas, clientes, empleados y productos en paralelo
            await Promise.all([
                fetchSales(),
                fetchCustomers(), 
                fetchEmployees(),
                fetchProducts()
            ]);
            
        } catch (error) {
            console.error('Error al cargar datos iniciales:', error);
            setError('Error al cargar los datos de ventas');
        } finally {
            setIsLoading(false);
        }
    };

    // POST/PUT - Crear o actualizar venta
    const handleSubmit = async (saleData) => {
        try {
            setIsLoading(true);
            setError('');
            
            // Validaciones
            if (!saleData.customerId) {
                setError('El cliente es obligatorio');
                return;
            }
            
            if (!saleData.employeeId) {
                setError('El empleado es obligatorio');
                return;
            }
            
            if (!saleData.address || saleData.address.trim() === '') {
                setError('La dirección de entrega es obligatoria');
                return;
            }
            
            if (!saleData.selectedProducts || saleData.selectedProducts.length === 0) {
                setError('Debe agregar al menos un producto');
                return;
            }

            if (saleData.total <= 0) {
                setError('El total debe ser mayor a 0');
                return;
            }
            
            const dataToSend = {
                customerId: saleData.customerId,
                employeeId: saleData.employeeId,
                address: saleData.address.trim(),
                reference: saleData.reference?.trim() || '',
                status: saleData.status,
                selectedPaymentMethod: saleData.selectedPaymentMethod,
                selectedProducts: saleData.selectedProducts,
                total: saleData.total
            };
                        
            let response;
            
            if (isEditing && currentSaleId) {
                // Actualizar venta existente (PUT)
                
                response = await authenticatedFetch(`${API_BASE}/sales/${currentSaleId}`, {
                    method: 'PUT',
                    body: JSON.stringify(dataToSend),
                });
            } else {
                // Crear nueva venta (POST)
                            
                response = await authenticatedFetch(`${API_BASE}/sales`, {
                    method: 'POST',
                    body: JSON.stringify(dataToSend),
                });
            }
            
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `Error al ${isEditing ? 'actualizar' : 'crear'} la venta`);
            }
            
            // Obtener la respuesta del servidor (incluye createdAt automático)
            const responseData = await response.json();
            console.log('Venta guardada exitosamente:');
            
            // Mostrar mensaje de éxito
            const successMessage = isEditing ? 'Venta actualizada exitosamente' : 'Venta creada exitosamente';
            setSuccess(successMessage);
            setTimeout(() => setSuccess(''), 4000);
            
            // Actualizar la lista de ventas
            await fetchSales();
            
            // Cerrar modal y limpiar formulario
            setShowModal(false);
            resetForm();
            
        } catch (error) {
            console.error(`Error al ${isEditing ? 'actualizar' : 'crear'} venta:`, error);
            setError(error.message || `Error al ${isEditing ? 'actualizar' : 'crear'} la venta`);
        } finally {
            setIsLoading(false);
        }
    };

    // DELETE - Eliminar venta
    const handleDeleteSale = (saleId, event = null) => {
        if (event && typeof event.stopPropagation === 'function') {
            event.stopPropagation();
        }
        
        if (!saleId) {
            console.error('ID de venta no válido');
            setError('Error: ID de venta no válido');
            return;
        }

        if (!isAuthenticated) {
            setError('Debes iniciar sesión para eliminar ventas');
            return;
        }
        
        // Buscar la venta para mostrar en el modal
        const saleToDelete = sales.find(sale => sale._id === saleId);
        setSaleToDelete(saleToDelete);
        setShowDeleteModal(true);
    };

    // Confirmar eliminación
    const confirmDeleteSale = async () => {
        if (!saleToDelete) return;
        
        try {
            setIsLoading(true);
            setError('');
            
            
            const response = await authenticatedFetch(`${API_BASE}/sales/${saleToDelete._id}`, {
                method: 'DELETE',
            });
            
            console.log('Respuesta de eliminación:', response);
            
            if (!response.ok) {
                const errorData = await response.json();
                
                // Manejar errores específicos
                if (response.status === 404) {
                    throw new Error('La venta ya no existe o fue eliminada previamente');
                } else if (response.status === 403) {
                    throw new Error('No tienes permisos para eliminar esta venta');
                } else {
                    throw new Error(errorData.message || `Error al eliminar la venta: ${response.status} ${response.statusText}`);
                }
            }
            
            // Mostrar mensaje de éxito
            setSuccess('Venta eliminada exitosamente');
            setTimeout(() => setSuccess(''), 4000);
            
            // Cerrar modal de confirmación
            setShowDeleteModal(false);
            setSaleToDelete(null);
            
            // Actualizar la lista de ventas
            await fetchSales();
            
        } catch (error) {
            console.error('Error al eliminar venta:', error);
            setError(error.message || 'Error al eliminar la venta');
            
            // Limpiar el error después de 5 segundos
            setTimeout(() => setError(''), 5000);
        } finally {
            setIsLoading(false);
        }
    };

    // Cancelar eliminación
    const cancelDeleteSale = () => {
        setShowDeleteModal(false);
        setSaleToDelete(null);
    };

    // Limpiar el formulario
    const resetForm = () => {
        setCustomerId('');
        setEmployeeId('');
        setAddress('');
        setReference('');
        setStatus('Processing');
        setSelectedPaymentMethod('Credit Card');
        setSelectedProducts([]);
        setTotal(0);
        setIsEditing(false);
        setCurrentSaleId(null);
        setError('');
    };

    // Preparar la edición de una venta
    const handleEditSale = (sale) => {
        // Establecer los datos en el estado del hook para el modal
        setCustomerId(sale.customerId?._id || sale.customerId || '');
        setEmployeeId(sale.employeeId?._id || sale.employeeId || '');
        setAddress(sale.address || '');
        setReference(sale.reference || '');
        setStatus(sale.status || 'Processing');
        setSelectedPaymentMethod(sale.selectedPaymentMethod || 'Credit Card');
        setSelectedProducts(sale.selectedProducts || []);
        setTotal(sale.total || 0);
        setIsEditing(true);
        setCurrentSaleId(sale._id);
        setShowModal(true);
    
    };

    // Manejar agregar nueva venta
    const handleAddNew = () => {
        resetForm();
        setShowModal(true);
    };

    // Manejar refrescar datos
    const handleRefresh = () => {
        loadInitialData();
    };

    // Función para obtener información del cliente
    const getCustomerInfo = (customerId) => {
        const id = customerId?._id || customerId;
        return customers.find(c => c._id === id);
    };

    // Función para obtener información del empleado
    const getEmployeeInfo = (employeeId) => {
        const id = employeeId?._id || employeeId;
        return employees.find(e => e._id === id);
    };

    // Función para obtener información de productos
    const getProductsInfo = () => products;

    // Función para filtrar/ordenar ventas
    const getFilteredSales = (sortBy = '', searchTerm = '') => {
        let filtered = [...sales];
        
        // Filtrar por término de búsqueda
        if (searchTerm.trim()) {
            filtered = filtered.filter(sale => {
                const customer = getCustomerInfo(sale.customerId);
                const employee = getEmployeeInfo(sale.employeeId);
                return (
                    customer?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    customer?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    employee?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    sale.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    sale.status?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    sale._id?.toLowerCase().includes(searchTerm.toLowerCase())
                );
            });
        }
        
        // Aplicar ordenamiento
        switch (sortBy) {
            case 'date-new':
                return filtered.sort((a, b) => {
                    const dateA = new Date(a.createdAt || a.createdAt?.$date || 0);
                    const dateB = new Date(b.createdAt || b.createdAt?.$date || 0);
                    return dateB - dateA;
                });
            case 'date-old':
                return filtered.sort((a, b) => {
                    const dateA = new Date(a.createdAt || a.createdAt?.$date || 0);
                    const dateB = new Date(b.createdAt || b.createdAt?.$date || 0);
                    return dateA - dateB;
                });
            case 'amount-high':
                return filtered.sort((a, b) => b.total - a.total);
            case 'amount-low':
                return filtered.sort((a, b) => a.total - b.total);
            case 'status':
                return filtered.sort((a, b) => a.status.localeCompare(b.status));
            case 'customer':
                return filtered.sort((a, b) => {
                    const customerA = getCustomerInfo(a.customerId);
                    const customerB = getCustomerInfo(b.customerId);
                    return (customerA?.name || '').localeCompare(customerB?.name || '');
                });
            default:
                // Por defecto, ordenar por fecha más reciente
                return filtered.sort((a, b) => {
                    const dateA = new Date(a.createdAt || a.createdAt?.$date || 0);
                    const dateB = new Date(b.createdAt || b.createdAt?.$date || 0);
                    return dateB - dateA;
                });
        }
    };

    // Calcular estadísticas
    const getTotalSales = () => sales.length;
    
    const getTotalRevenue = () => {
        return sales.reduce((total, sale) => total + sale.total, 0);
    };
    
    const getAverageTicket = () => {
        if (sales.length === 0) return 0;
        return getTotalRevenue() / sales.length;
    };
    
    const getSalesByStatus = (status) => {
        return sales.filter(s => s.status === status).length;
    };

    return {
        // Estados
        sales,
        setSales,
        customers,
        setCustomers,
        employees,
        setEmployees,
        products,
        setProducts,
        showModal,
        setShowModal,
        showDeleteModal,
        setShowDeleteModal,
        saleToDelete,
        setSaleToDelete,
        isLoading,
        setIsLoading,
        error,
        setError,
        success,
        setSuccess,
        isEditing,
        setIsEditing,
        currentSaleId,
        setCurrentSaleId,
        
        // Estados de paginación
        currentPage,
        setCurrentPage,
        itemsPerPage,
        setItemsPerPage,
        
        // Estados del formulario
        customerId,
        setCustomerId,
        employeeId,
        setEmployeeId,
        address,
        setAddress,
        reference,
        setReference,
        status,
        setStatus,
        selectedPaymentMethod,
        setSelectedPaymentMethod,
        selectedProducts,
        setSelectedProducts,
        total,
        setTotal,
        
        // Funciones
        loadInitialData,
        fetchSales,
        fetchCustomers,
        fetchEmployees,
        fetchProducts,
        handleSubmit,
        handleDeleteSale,
        confirmDeleteSale,
        cancelDeleteSale,
        resetForm,
        handleEditSale,
        handleAddNew,
        handleRefresh,
        getCustomerInfo,
        getEmployeeInfo,
        getProductsInfo,
        getFilteredSales,
        getTotalSales,
        getTotalRevenue,
        getAverageTicket,
        getSalesByStatus,
    };
}