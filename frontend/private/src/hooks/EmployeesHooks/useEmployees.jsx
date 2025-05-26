import { useState } from 'react';
import { useAuth } from '../../context/AuthContext'; 

export function useEmployeesManager() {
    const { authenticatedFetch, isAuthenticated, user } = useAuth();
    
    const [employees, setEmployees] = useState([]);
    const [branches, setBranches] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [employeeToDelete, setEmployeeToDelete] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [currentEmployeeId, setCurrentEmployeeId] = useState(null);

    // Estados de paginación
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(6);

    // Estados del formulario
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [branchId, setBranchId] = useState('');
    const [position, setPosition] = useState('');
    const [salary, setSalary] = useState(0);

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

    // GET - Obtener todos los empleados
    const fetchEmployees = async () => {
        // Validar autenticación
        if (!isAuthenticated) {
            setError('Debes iniciar sesión para ver los empleados.');
            return;
        }

        // Validar tipo de usuario
        if (!user || user.userType !== 'admin') {
            setError('No tienes permisos para ver los empleados.');
            setEmployees([]);
            return;
        }

        try {
            setError('');
            
            const response = await authenticatedFetch('http://localhost:3333/api/employees');
            
            console.log('Respuesta del servidor empleados:', response);
            
            if (!response.ok) {
                throw new Error(`Error al cargar los empleados: ${response.status} ${response.statusText}`);
            }
            
            const data = await response.json();
            console.log('Empleados recibidos:', data);
            setEmployees(data);
        } catch (error) {
            console.error('Error al cargar empleados:', error);
            setError('No se pudieron cargar los empleados. ' + error.message);
        }
    };

    // Función para cargar todos los datos iniciales
    const loadInitialData = async () => {
        try {
            setIsLoading(true);
            setError('');
            
            // Cargar empleados y sucursales en paralelo
            await Promise.all([
                fetchEmployees(),
                fetchBranches()
            ]);
            
        } catch (error) {
            console.error('Error al cargar datos iniciales:', error);
            setError('Error al cargar los datos de empleados');
        } finally {
            setIsLoading(false);
        }
    };

    // POST/PUT - Crear o actualizar empleado
    const handleSubmit = async (employeeData) => {
        try {
            setIsLoading(true);
            setError('');
            
            // Usar los datos que vienen del modal
            const dataToSend = {
                name: employeeData.name?.trim(),
                email: employeeData.email?.trim(),
                phone: employeeData.phone?.trim(),
                branchId: employeeData.branchId,
                position: employeeData.position?.trim(),
                salary: parseFloat(employeeData.salary) || 0
            };

            // Solo incluir password si se proporciona
            if (employeeData.password && employeeData.password.trim()) {
                dataToSend.password = employeeData.password.trim();
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
            
            if (!dataToSend.position) {
                setError('El cargo es obligatorio');
                return;
            }

            if (!dataToSend.branchId) {
                setError('La sucursal es obligatoria');
                return;
            }

            if (dataToSend.salary <= 0) {
                setError('El salario debe ser mayor a 0');
                return;
            }

            // Para nuevos empleados, la contraseña es obligatoria
            if (!employeeData._id && !dataToSend.password) {
                setError('La contraseña es obligatoria para nuevos empleados');
                return;
            }

            // Validar contraseña si se proporciona
            if (dataToSend.password && dataToSend.password.length < 8) {
                setError('La contraseña debe tener al menos 8 caracteres');
                return;
            }
            
            let response;
            
            if (employeeData._id) {
                // Actualizar empleado existente (PUT)
                console.log('Actualizando empleado con ID:', employeeData._id);
                
                response = await authenticatedFetch(`http://localhost:3333/api/employees/${employeeData._id}`, {
                    method: 'PUT',
                    body: JSON.stringify(dataToSend),
                });
            } else {
                // Crear nuevo empleado (POST)
                console.log('Creando nuevo empleado');
                
                response = await authenticatedFetch('http://localhost:3333/api/employees', {
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
                        throw new Error('Ya existe un empleado con este email');
                    }
                    if (errorData.message.includes('phone')) {
                        throw new Error('Ya existe un empleado con este teléfono');
                    }
                }
                
                throw new Error(errorData.message || `Error al ${employeeData._id ? 'actualizar' : 'crear'} el empleado`);
            }
            
            // Mostrar mensaje de éxito
            setSuccess(`Empleado ${employeeData._id ? 'actualizado' : 'creado'} exitosamente`);
            setTimeout(() => setSuccess(''), 3000);
            
            // Actualizar la lista de empleados
            await fetchEmployees();
            
            // Cerrar modal y limpiar formulario
            setShowModal(false);
            resetForm();
            
        } catch (error) {
            console.error(`Error al ${employeeData._id ? 'actualizar' : 'crear'} empleado:`, error);
            setError(error.message || `Error al ${employeeData._id ? 'actualizar' : 'crear'} el empleado`);
        } finally {
            setIsLoading(false);
        }
    };

    // Iniciar proceso de eliminación
    const handleDeleteEmployee = (employeeId, event = null) => {
        // Detener la propagación solo si event es un objeto de evento válido
        if (event && typeof event.stopPropagation === 'function') {
            event.stopPropagation();
        }
        
        if (!employeeId) {
            console.error('ID de empleado no válido');
            setError('Error: ID de empleado no válido');
            return;
        }

        if (!isAuthenticated) {
            setError('Debes iniciar sesión para eliminar empleados');
            return;
        }
        
        // Buscar el empleado para mostrar en el modal
        const employeeToDelete = employees.find(employee => employee._id === employeeId);
        setEmployeeToDelete(employeeToDelete);
        setShowDeleteModal(true);
    };

    // Confirmar eliminación
    const confirmDeleteEmployee = async () => {
        if (!employeeToDelete) return;
        
        try {
            setIsLoading(true);
            setError('');
            
            console.log('Intentando eliminar empleado con ID:', employeeToDelete._id);
            
            const response = await authenticatedFetch(`http://localhost:3333/api/employees/${employeeToDelete._id}`, {
                method: 'DELETE',
            });
            
            console.log('Respuesta de eliminación:', response);
            
            if (!response.ok) {
                const errorData = await response.json();
                
                // Manejar errores específicos
                if (response.status === 404) {
                    throw new Error('El empleado ya no existe o fue eliminado previamente');
                } else if (response.status === 403) {
                    throw new Error('No tienes permisos para eliminar este empleado');
                } else if (response.status === 409) {
                    throw new Error('No se puede eliminar el empleado porque tiene datos relacionados');
                } else {
                    throw new Error(errorData.message || `Error al eliminar el empleado: ${response.status} ${response.statusText}`);
                }
            }
            
            // Mostrar mensaje de éxito
            setSuccess(`Empleado "${employeeToDelete.name}" eliminado exitosamente`);
            setTimeout(() => setSuccess(''), 4000);
            
            // Cerrar modal de confirmación
            setShowDeleteModal(false);
            setEmployeeToDelete(null);
            
            // Si estamos en la última página y eliminamos el último elemento, 
            // retroceder una página
            const newTotal = employees.length - 1;
            const newTotalPages = Math.ceil(newTotal / itemsPerPage);
            if (currentPage > newTotalPages && newTotalPages > 0) {
                setCurrentPage(newTotalPages);
            }
            
            // Actualizar la lista de empleados
            await fetchEmployees();
            
        } catch (error) {
            console.error('Error al eliminar empleado:', error);
            setError(error.message || 'Error al eliminar el empleado');
            
            // Limpiar el error después de 5 segundos
            setTimeout(() => setError(''), 5000);
        } finally {
            setIsLoading(false);
        }
    };

    // Cancelar eliminación
    const cancelDeleteEmployee = () => {
        setShowDeleteModal(false);
        setEmployeeToDelete(null);
    };

    // Limpiar el formulario
    const resetForm = () => {
        setName('');
        setEmail('');
        setPassword('');
        setPhone('');
        setBranchId('');
        setPosition('');
        setSalary(0);
        setIsEditing(false);
        setCurrentEmployeeId(null);
        setError('');
    };

    // Preparar la edición de un empleado
    const handleEditEmployee = (employee) => {
        // Establecer los datos en el estado del hook para el modal
        setName(employee.name || '');
        setEmail(employee.email || '');
        setPassword(''); // No mostrar contraseña actual por seguridad
        setPhone(employee.phone || '');
        setBranchId(employee.branchId?._id || employee.branchId || '');
        setPosition(employee.position || '');
        setSalary(employee.salary || 0);
        setIsEditing(true);
        setCurrentEmployeeId(employee._id);
        setShowModal(true);
        
        console.log('Modal abierto para editar empleado:', {
            employeeId: employee._id,
            branchId: employee.branchId,
            currentBranches: branches
        });
    };

    // Manejar agregar nuevo empleado
    const handleAddNew = () => {
        resetForm();
        setShowModal(true);
        console.log('Modal abierto para nuevo empleado');
    };

    // Manejar refrescar datos
    const handleRefresh = () => {
        loadInitialData();
    };

    // Función para obtener información de la sucursal
    const getBranchInfo = (branchId) => {
        const id = branchId?._id || branchId;
        return branches.find(b => b._id === id);
    };

    // Función para filtrar/ordenar empleados
    const getFilteredEmployees = (sortBy = '', searchTerm = '') => {
        let filtered = [...employees];
        
        // Filtrar por término de búsqueda
        if (searchTerm.trim()) {
            filtered = filtered.filter(employee => 
                employee.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                employee.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                employee.phone?.includes(searchTerm) ||
                employee.position?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        
        // Aplicar ordenamiento
        switch (sortBy) {
            case 'name':
                return filtered.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
            case 'position':
                return filtered.sort((a, b) => (a.position || '').localeCompare(b.position || ''));
            case 'salary-low':
                return filtered.sort((a, b) => (a.salary || 0) - (b.salary || 0));
            case 'salary-high':
                return filtered.sort((a, b) => (b.salary || 0) - (a.salary || 0));
            case 'branch':
                return filtered.sort((a, b) => {
                    const branchA = getBranchInfo(a.branchId);
                    const branchB = getBranchInfo(b.branchId);
                    return (branchA?.branch_name || branchA?.address || '').localeCompare(branchB?.branch_name || branchB?.address || '');
                });
            default:
                // Por defecto, ordenar por nombre
                return filtered.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
        }
    };

    // Calcular estadísticas
    const getTotalEmployees = () => employees.length;

    const getTotalSalary = () => {
        return employees.reduce((total, emp) => total + (emp.salary || 0), 0);
    };

    const getAverageSalary = () => {
        if (employees.length === 0) return 0;
        return getTotalSalary() / employees.length;
    };

    return {
        // Estados
        employees,
        setEmployees,
        branches,
        setBranches,
        showModal,
        setShowModal,
        showDeleteModal,
        setShowDeleteModal,
        employeeToDelete,
        setEmployeeToDelete,
        isLoading,
        setIsLoading,
        error,
        setError,
        success,
        setSuccess,
        isEditing,
        setIsEditing,
        currentEmployeeId,
        setCurrentEmployeeId,
        
        // Estados de paginación
        currentPage,
        setCurrentPage,
        itemsPerPage,
        setItemsPerPage,
        
        // Estados del formulario
        name,
        setName,
        email,
        setEmail,
        password,
        setPassword,
        phone,
        setPhone,
        branchId,
        setBranchId,
        position,
        setPosition,
        salary,
        setSalary,
        
        // Funciones
        loadInitialData,
        fetchEmployees,
        fetchBranches,
        handleSubmit,
        handleDeleteEmployee,
        confirmDeleteEmployee,
        cancelDeleteEmployee,
        resetForm,
        handleEditEmployee,
        handleAddNew,
        handleRefresh,
        getBranchInfo,
        getFilteredEmployees,
        getTotalEmployees,
        getTotalSalary,
        getAverageSalary,
    };
}