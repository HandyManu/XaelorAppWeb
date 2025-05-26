import { useState } from 'react';
import { useAuth } from '../../context/AuthContext'; 

export function useBrandsManager() {
    const { authenticatedFetch, isAuthenticated, user } = useAuth();
    
    const [brands, setBrands] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [brandToDelete, setBrandToDelete] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [currentBrandId, setCurrentBrandId] = useState(null);

    // Estados de paginación
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(16);

    // Estados del formulario
    const [brandName, setBrandName] = useState('');
    const [logoUrl, setLogoUrl] = useState('');

    // Cálculos de paginación
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentBrands = brands.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(brands.length / itemsPerPage);

    // GET - Obtener todas las marcas
    const fetchBrands = async () => {
        // Validar autenticación
        if (!isAuthenticated) {
            setError('Debes iniciar sesión para ver las marcas.');
            return;
        }

        // Validar tipo de usuario (solo admin según tu servidor)
        if (!user || user.userType !== 'admin') {
            setError('No tienes permisos para ver las marcas. Se requiere rol de administrador.');
            setBrands([]);
            return;
        }

        try {
            setIsLoading(true);
            setError('');
            
            console.log('Fetching brands...');
            const response = await authenticatedFetch('http://localhost:3333/api/brands');
            
            console.log('Respuesta del servidor:', response.status, response.statusText);
            
            if (!response.ok) {
                if (response.status === 401) {
                    throw new Error('No autorizado. Verifica que seas administrador.');
                } else if (response.status === 403) {
                    throw new Error('Acceso denegado. Se requiere rol de administrador.');
                } else {
                    throw new Error(`Error al cargar las marcas: ${response.status} ${response.statusText}`);
                }
            }
            
            const data = await response.json();
            console.log('Marcas recibidas:', data.length, 'marcas');
            setBrands(data);
        } catch (error) {
            console.error('Error al cargar marcas:', error);
            setError('No se pudieron cargar las marcas. ' + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    // Función para subir imagen usando FormData directamente
    const uploadImage = async (file) => {
        try {
            const formData = new FormData();
            formData.append('photos', file); // Usar 'photos' para coincidir con el backend
            formData.append('brandName', 'temp-upload'); // Nombre temporal para la subida
            
            const response = await authenticatedFetch('http://localhost:3333/api/brands', {
                method: 'POST',
                body: formData,
            });
            
            if (!response.ok) {
                throw new Error('Error al subir la imagen');
            }
            
            const data = await response.json();
            // Retornar la URL del logo subido
            return data.brand.photos;
        } catch (error) {
            console.error('Error uploading image:', error);
            throw error;
        }
    };

    // POST/PUT - Crear o actualizar marca
    const handleSubmit = async (brandData, imageFile = null) => {
        try {
            setIsLoading(true);
            setError('');
            
            // Validaciones
            if (!brandData.brandName?.trim()) {
                setError('El nombre de la marca es obligatorio');
                return;
            }

            if (brandData.brandName.trim().length < 2) {
                setError('El nombre debe tener al menos 2 caracteres');
                return;
            }
            
            if (brandData._id) {
                // Actualizar marca existente (PUT)
                console.log('Actualizando marca con ID:', brandData._id);
                
                const formData = new FormData();
                formData.append('brandName', brandData.brandName.trim());
                
                // Si hay un archivo nuevo, agregarlo
                if (imageFile) {
                    formData.append('photos', imageFile); // Usar 'photos' para coincidir con el backend
                }
                
                const response = await authenticatedFetch(`http://localhost:3333/api/brands/${brandData._id}`, {
                    method: 'PUT',
                    body: formData,
                });
                
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Error al actualizar la marca');
                }
                
            } else {
                // Crear nueva marca (POST)
                console.log('Creando nueva marca');
                
                const formData = new FormData();
                formData.append('brandName', brandData.brandName.trim());
                
                // Si hay un archivo, agregarlo
                if (imageFile) {
                    formData.append('photos', imageFile); // Usar 'photos' para coincidir con el backend
                }
                
                const response = await authenticatedFetch('http://localhost:3333/api/brands', {
                    method: 'POST',
                    body: formData,
                });
                
                if (!response.ok) {
                    const errorData = await response.json();
                    
                    // Manejar errores específicos
                    if (response.status === 400 && errorData.message) {
                        if (errorData.message.includes('duplicate') || 
                            errorData.message.includes('brandName')) {
                            throw new Error('Ya existe una marca con este nombre');
                        }
                    }
                    
                    throw new Error(errorData.message || 'Error al crear la marca');
                }
            }
            
            // Mostrar mensaje de éxito
            setSuccess(`Marca ${brandData._id ? 'actualizada' : 'creada'} exitosamente`);
            setTimeout(() => setSuccess(''), 3000);
            
            // Actualizar la lista de marcas
            await fetchBrands();
            
            // Cerrar modal y limpiar formulario
            setShowModal(false);
            resetForm();
            
        } catch (error) {
            console.error(`Error al ${brandData._id ? 'actualizar' : 'crear'} marca:`, error);
            setError(error.message || `Error al ${brandData._id ? 'actualizar' : 'crear'} la marca`);
        } finally {
            setIsLoading(false);
        }
    };

    // Iniciar proceso de eliminación
    const handleDeleteBrand = (brandId, event = null) => {
        // Detener la propagación solo si event es un objeto de evento válido
        if (event && typeof event.stopPropagation === 'function') {
            event.stopPropagation();
        }
        
        if (!brandId) {
            console.error('ID de marca no válido');
            setError('Error: ID de marca no válido');
            return;
        }

        if (!isAuthenticated) {
            setError('Debes iniciar sesión para eliminar marcas');
            return;
        }
        
        // Buscar la marca para mostrar en el modal
        const brandToDelete = brands.find(brand => brand._id === brandId);
        setBrandToDelete(brandToDelete);
        setShowDeleteModal(true);
    };

    // Confirmar eliminación
    const confirmDeleteBrand = async () => {
        if (!brandToDelete) return;
        
        try {
            setIsLoading(true);
            setError('');
            
            console.log('Intentando eliminar marca con ID:', brandToDelete._id);
            
            const response = await authenticatedFetch(`http://localhost:3333/api/brands/${brandToDelete._id}`, {
                method: 'DELETE',
            });
            
            console.log('Respuesta de eliminación:', response);
            
            if (!response.ok) {
                const errorData = await response.json();
                
                // Manejar errores específicos
                if (response.status === 404) {
                    throw new Error('La marca ya no existe o fue eliminada previamente');
                } else if (response.status === 403) {
                    throw new Error('No tienes permisos para eliminar esta marca');
                } else if (response.status === 409) {
                    throw new Error('No se puede eliminar la marca porque tiene productos asociados');
                } else {
                    throw new Error(errorData.message || `Error al eliminar la marca: ${response.status} ${response.statusText}`);
                }
            }
            
            // Mostrar mensaje de éxito
            setSuccess(`Marca "${brandToDelete.brandName}" eliminada exitosamente`);
            setTimeout(() => setSuccess(''), 4000);
            
            // Cerrar modal de confirmación
            setShowDeleteModal(false);
            setBrandToDelete(null);
            
            // Si estamos en la última página y eliminamos el último elemento, 
            // retroceder una página
            const newTotal = brands.length - 1;
            const newTotalPages = Math.ceil(newTotal / itemsPerPage);
            if (currentPage > newTotalPages && newTotalPages > 0) {
                setCurrentPage(newTotalPages);
            }
            
            // Actualizar la lista de marcas
            await fetchBrands();
            
        } catch (error) {
            console.error('Error al eliminar marca:', error);
            setError(error.message || 'Error al eliminar la marca');
            
            // Limpiar el error después de 5 segundos
            setTimeout(() => setError(''), 5000);
        } finally {
            setIsLoading(false);
        }
    };

    // Cancelar eliminación
    const cancelDeleteBrand = () => {
        setShowDeleteModal(false);
        setBrandToDelete(null);
    };

    // Limpiar el formulario
    const resetForm = () => {
        setBrandName('');
        setLogoUrl('');
        setIsEditing(false);
        setCurrentBrandId(null);
        setError('');
    };

    // Preparar la edición de una marca
    const handleEditBrand = (brand) => {
        // Establecer los datos en el estado del hook para el modal
        setBrandName(brand.brandName || '');
        setLogoUrl(brand.photos || ''); // El backend usa 'photos' pero el frontend usa 'logoUrl'
        setIsEditing(true);
        setCurrentBrandId(brand._id);
        setShowModal(true);
    };

    // Manejar agregar nueva marca
    const handleAddNew = () => {
        resetForm();
        setShowModal(true);
    };

    // Manejar refrescar datos
    const handleRefresh = () => {
        fetchBrands();
    };

    return {
        // Estados
        brands,
        setBrands,
        showModal,
        setShowModal,
        showDeleteModal,
        setShowDeleteModal,
        brandToDelete,
        setBrandToDelete,
        isLoading,
        setIsLoading,
        error,
        setError,
        success,
        setSuccess,
        isEditing,
        setIsEditing,
        currentBrandId,
        setCurrentBrandId,
        
        // Estados de paginación
        currentPage,
        setCurrentPage,
        itemsPerPage,
        setItemsPerPage,
        totalPages,
        currentBrands,
        
        // Estados del formulario
        brandName,
        setBrandName,
        logoUrl,
        setLogoUrl,
        
        // Funciones
        fetchBrands,
        handleSubmit,
        uploadImage,
        handleDeleteBrand,
        confirmDeleteBrand,
        cancelDeleteBrand,
        resetForm,
        handleEditBrand,
        handleAddNew,
        handleRefresh,
    };
}