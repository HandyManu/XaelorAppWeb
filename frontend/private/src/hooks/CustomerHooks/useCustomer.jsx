import { useState } from 'react';
import { useAuth } from '../../context/AuthContext'; 

export function useCustomersManager() {
    const { authenticatedFetch, isAuthenticated, user } = useAuth();
    
    const [customers, setCustomers] = useState([]);
    const [memberships, setMemberships] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [customerToDelete, setCustomerToDelete] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [currentCustomerId, setCurrentCustomerId] = useState(null);

    // Estados de paginación
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(6);

    // Estados del formulario
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [membershipId, setMembershipId] = useState('');
    const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);

    // Cálculos de paginación
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentCustomers = customers.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(customers.length / itemsPerPage);

    // GET - Obtener todas las membresías para el dropdown
    const fetchMemberships = async () => {
        try {
            const response = await authenticatedFetch('http://localhost:3333/api/memberships');
            if (response.ok) {
                const data = await response.json();
                console.log('Membresías recibidas:', data);
                setMemberships(data);
            } else {
                console.error('Error al cargar membresías:', response.status);
            }
        } catch (error) {
            console.error('Error al cargar membresías:', error);
        }
    };

    // GET - Obtener todos los clientes
    const fetchCustomers = async () => {
        // Validar autenticación
        if (!isAuthenticated) {
            setError('Debes iniciar sesión para ver los clientes.');
            return;
        }

        // Validar tipo de usuario
        if (!user || (user.userType !== 'admin' && user.userType !== 'employee')) {
            setError('No tienes permisos para ver los clientes.');
            setCustomers([]);
            return;
        }

        try {
            setError('');
            
            const response = await authenticatedFetch('http://localhost:3333/api/customers');
            
            console.log('Respuesta del servidor:', response);
            
            if (!response.ok) {
                throw new Error(`Error al cargar los clientes: ${response.status} ${response.statusText}`);
            }
            
            const data = await response.json();
            console.log('Clientes recibidos:', data);
            setCustomers(data);
        } catch (error) {
            console.error('Error al cargar clientes:', error);
            setError('No se pudieron cargar los clientes. ' + error.message);
        }
    };

    // Función para cargar todos los datos iniciales
    const loadInitialData = async () => {
        try {
            setIsLoading(true);
            setError('');
            
            // Cargar clientes y membresías en paralelo
            await Promise.all([
                fetchCustomers(),
                fetchMemberships()
            ]);
            
        } catch (error) {
            console.error('Error al cargar datos iniciales:', error);
            setError('Error al cargar los datos de clientes');
        } finally {
            setIsLoading(false);
        }
    };

    // POST/PUT - Crear o actualizar cliente
    const handleSubmit = async (customerData) => {
        try {
            setIsLoading(true);
            setError('');
            
            // Usar los datos que vienen del modal
            const dataToSend = {
                name: customerData.name?.trim(),
                email: customerData.email?.trim(),
                phone: customerData.phone?.trim(),
            };

            // Solo incluir membership si se seleccionó una
            if (customerData.membershipId && customerData.membershipId !== 'none') {
                dataToSend.membership = {
                    membershipId: customerData.membershipId,
                    startDate: new Date(customerData.startDate)
                };
            }

            // Solo incluir password si se proporciona
            if (customerData.password && customerData.password.trim()) {
                dataToSend.password = customerData.password.trim();
            }

            // Validaciones
            if (!dataToSend.name) {
                setError('El nombre es obligatorio');
                return;
            }
            
            if (!dataToSend.email) {
                setError('El email es obligatorio');
                return;
            }

            // Validar email
            const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            if (!emailRegex.test(dataToSend.email)) {
                setError('El email no tiene un formato válido');
                return;
            }
            
            if (!dataToSend.phone) {
                setError('El teléfono es obligatorio');
                return;
            }

            // La membresía ya no es obligatoria - puede ser 'none' o vacía

            // Para nuevos clientes, la contraseña es obligatoria
            if (!customerData._id && !dataToSend.password) {
                setError('La contraseña es obligatoria para nuevos clientes');
                return;
            }

            // Validar contraseña si se proporciona
            if (dataToSend.password && dataToSend.password.length < 6) {
                setError('La contraseña debe tener al menos 6 caracteres');
                return;
            }
            
            let response;
            
            if (customerData._id) {
                // Actualizar cliente existente (PUT)
                console.log('Actualizando cliente con ID:', customerData._id);
                
                response = await authenticatedFetch(`http://localhost:3333/api/customers/${customerData._id}`, {
                    method: 'PUT',
                    body: JSON.stringify(dataToSend),
                });
            } else {
                // Crear nuevo cliente (POST)
                console.log('Creando nuevo cliente');
                
                response = await authenticatedFetch('http://localhost:3333/api/customers', {
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
                        errorData.message.includes('email')) {
                        throw new Error('Ya existe un cliente con este email');
                    }
                    if (errorData.message.includes('phone')) {
                        throw new Error('Ya existe un cliente con este teléfono');
                    }
                }
                
                throw new Error(errorData.message || `Error al ${customerData._id ? 'actualizar' : 'crear'} el cliente`);
            }
            
            // Mostrar mensaje de éxito
            setSuccess(`Cliente ${customerData._id ? 'actualizado' : 'creado'} exitosamente`);
            setTimeout(() => setSuccess(''), 3000);
            
            // Actualizar la lista de clientes
            await fetchCustomers();
            
            // Cerrar modal y limpiar formulario
            setShowModal(false);
            resetForm();
            
        } catch (error) {
            console.error(`Error al ${customerData._id ? 'actualizar' : 'crear'} cliente:`, error);
            setError(error.message || `Error al ${customerData._id ? 'actualizar' : 'crear'} el cliente`);
        } finally {
            setIsLoading(false);
        }
    };

    // Iniciar proceso de eliminación
    const handleDeleteCustomer = (customerId, event = null) => {
        // Detener la propagación solo si event es un objeto de evento válido
        if (event && typeof event.stopPropagation === 'function') {
            event.stopPropagation();
        }
        
        if (!customerId) {
            console.error('ID de cliente no válido');
            setError('Error: ID de cliente no válido');
            return;
        }

        if (!isAuthenticated) {
            setError('Debes iniciar sesión para eliminar clientes');
            return;
        }
        
        // Buscar el cliente para mostrar en el modal
        const customerToDelete = customers.find(customer => customer._id === customerId);
        setCustomerToDelete(customerToDelete);
        setShowDeleteModal(true);
    };

    // Confirmar eliminación
    const confirmDeleteCustomer = async () => {
        if (!customerToDelete) return;
        
        try {
            setIsLoading(true);
            setError('');
            
            console.log('Intentando eliminar cliente con ID:', customerToDelete._id);
            
            const response = await authenticatedFetch(`http://localhost:3333/api/customers/${customerToDelete._id}`, {
                method: 'DELETE',
            });
            
            console.log('Respuesta de eliminación:', response);
            
            if (!response.ok) {
                const errorData = await response.json();
                
                // Manejar errores específicos
                if (response.status === 404) {
                    throw new Error('El cliente ya no existe o fue eliminado previamente');
                } else if (response.status === 403) {
                    throw new Error('No tienes permisos para eliminar este cliente');
                } else if (response.status === 409) {
                    throw new Error('No se puede eliminar el cliente porque tiene datos relacionados');
                } else {
                    throw new Error(errorData.message || `Error al eliminar el cliente: ${response.status} ${response.statusText}`);
                }
            }
            
            // Mostrar mensaje de éxito
            setSuccess(`Cliente "${customerToDelete.name}" eliminado exitosamente`);
            setTimeout(() => setSuccess(''), 4000);
            
            // Cerrar modal de confirmación
            setShowDeleteModal(false);
            setCustomerToDelete(null);
            
            // Si estamos en la última página y eliminamos el último elemento, 
            // retroceder una página
            const newTotal = customers.length - 1;
            const newTotalPages = Math.ceil(newTotal / itemsPerPage);
            if (currentPage > newTotalPages && newTotalPages > 0) {
                setCurrentPage(newTotalPages);
            }
            
            // Actualizar la lista de clientes
            await fetchCustomers();
            
        } catch (error) {
            console.error('Error al eliminar cliente:', error);
            setError(error.message || 'Error al eliminar el cliente');
            
            // Limpiar el error después de 5 segundos
            setTimeout(() => setError(''), 5000);
        } finally {
            setIsLoading(false);
        }
    };

    // Cancelar eliminación
    const cancelDeleteCustomer = () => {
        setShowDeleteModal(false);
        setCustomerToDelete(null);
    };

    // Limpiar el formulario
    const resetForm = () => {
        setName('');
        setEmail('');
        setPassword('');
        setPhone('');
        setMembershipId('none');
        setStartDate(new Date().toISOString().split('T')[0]);
        setIsEditing(false);
        setCurrentCustomerId(null);
        setError('');
    };

    // Preparar la edición de un cliente
    const handleEditCustomer = (customer) => {
        // Establecer los datos en el estado del hook para el modal
        setName(customer.name || '');
        setEmail(customer.email || '');
        setPassword(''); // No mostrar contraseña actual por seguridad
        setPhone(customer.phone || '');
        setMembershipId(customer.membership?.membershipId?._id || customer.membership?.membershipId || 'none');
        setStartDate(
            customer.membership?.startDate 
                ? new Date(customer.membership.startDate).toISOString().split('T')[0]
                : new Date().toISOString().split('T')[0]
        );
        setIsEditing(true);
        setCurrentCustomerId(customer._id);
        setShowModal(true);
        
        console.log('Modal abierto para editar cliente:', {
            customerMembershipId: customer.membership?.membershipId,
            currentMemberships: memberships
        });
    };

    // Manejar agregar nuevo cliente
    const handleAddNew = () => {
        resetForm();
        setShowModal(true);
        console.log('Modal abierto para nuevo cliente');
    };

    // Manejar refrescar datos
    const handleRefresh = () => {
        loadInitialData();
    };

    // Función para obtener el nombre de la membresía
    const getMembershipName = (membershipId) => {
        if (!membershipId) return 'Sin membresía';
        
        const membership = memberships.find(m => m._id === membershipId);
        if (!membership) return 'Sin membresía';
        
        // Usar membershipTier que es el campo correcto en el modelo
        return membership.membershipTier || `Membresía ${membershipId.slice(-4)}`;
    };

    // Función para filtrar/ordenar clientes
    const getFilteredCustomers = (sortBy = '', searchTerm = '') => {
        let filtered = [...customers];
        
        // Filtrar por término de búsqueda
        if (searchTerm.trim()) {
            filtered = filtered.filter(customer => 
                customer.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                customer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                customer.phone?.includes(searchTerm)
            );
        }
        
        // Aplicar ordenamiento/filtros
        switch (sortBy) {
            case 'name-asc':
                return filtered.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
            case 'name-desc':
                return filtered.sort((a, b) => (b.name || '').localeCompare(a.name || ''));
            case 'email-asc':
                return filtered.sort((a, b) => (a.email || '').localeCompare(b.email || ''));
            case 'newest':
                return filtered.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
            case 'oldest':
                return filtered.sort((a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0));
            default:
                // Por defecto, ordenar por nombre
                return filtered.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
        }
    };

    return {
        // Estados
        customers,
        setCustomers,
        memberships,
        setMemberships,
        showModal,
        setShowModal,
        showDeleteModal,
        setShowDeleteModal,
        customerToDelete,
        setCustomerToDelete,
        isLoading,
        setIsLoading,
        error,
        setError,
        success,
        setSuccess,
        isEditing,
        setIsEditing,
        currentCustomerId,
        setCurrentCustomerId,
        
        // Estados de paginación
        currentPage,
        setCurrentPage,
        itemsPerPage,
        setItemsPerPage,
        totalPages,
        currentCustomers,
        
        // Estados del formulario
        name,
        setName,
        email,
        setEmail,
        password,
        setPassword,
        phone,
        setPhone,
        membershipId,
        setMembershipId,
        startDate,
        setStartDate,
        
        // Funciones
        loadInitialData,
        fetchCustomers,
        fetchMemberships,
        handleSubmit,
        handleDeleteCustomer,
        confirmDeleteCustomer,
        cancelDeleteCustomer,
        resetForm,
        handleEditCustomer,
        handleAddNew,
        handleRefresh,
        getMembershipName,
        getFilteredCustomers,
    };
}