import { useState, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';

export function useBrandsManager() {
    const auth = useAuth();
    const { isAuthenticated, user } = auth;
    
    // Función para obtener headers de autenticación (compatible con tu AuthContext original)
    const getAuthHeaders = () => {
        // Si tu AuthContext tiene getAuthHeaders, usarlo; sino, crear los headers manualmente
        if (auth.getAuthHeaders && typeof auth.getAuthHeaders === 'function') {
            return auth.getAuthHeaders();
        }
        
        // Fallback: crear headers manualmente
        const token = localStorage.getItem('authToken');
        return token ? { 'Authorization': `Bearer ${token}` } : {};
    };
    
    const [brands, setBrands] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [brandToDelete, setBrandToDelete] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [currentBrandId, setCurrentBrandId] = useState(null);

    // Estados del formulario (exactamente igual que useBlog)
    const [brandName, setBrandName] = useState('');
    const [image, setImage] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');
    const fileInputRef = useRef(null);

    // GET - Obtener todas las marcas (SIN HEADERS como en useBlog)
    const fetchBrands = async () => {
        try {
            setIsLoading(true);
            setError('');
            
            const response = await fetch('http://localhost:3333/api/brands');
            
            if (!response.ok) {
                throw new Error(`Error al cargar las marcas: ${response.status} ${response.statusText}`);
            }
            
            const data = await response.json();
            console.log('Marcas recibidas:', data);
            setBrands(data);
        } catch (error) {
            console.error('Error al cargar marcas:', error);
            setError('No se pudieron cargar las marcas. ' + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    // POST - Crear marca (exactamente igual que createBlog - SIN HEADERS)
    const createBrand = async () => {
        const formData = new FormData();
        formData.append('brandName', brandName);
        if (image) formData.append('photos', image);

        return await fetch('http://localhost:3333/api/brands', {
            method: 'POST',
            body: formData,
        });
    };

    // PUT - Actualizar marca (exactamente igual que updateBlog - SIN HEADERS)
    const updateBrand = async () => {
        const formData = new FormData();
        formData.append('brandName', brandName);
        if (image) formData.append('photos', image);

        return await fetch(`http://localhost:3333/api/brands/${currentBrandId}`, {
            method: 'PUT',
            body: formData,
        });
    };

    // POST/PUT - Crear o actualizar marca (exactamente igual que handleSubmit de useBlog)
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!brandName.trim()) {
            setError('El nombre de la marca es obligatorio');
            return;
        }
        
        try {
            setIsLoading(true);
            setError('');
            
            let response;
            if (isEditing && currentBrandId) {
                response = await updateBrand();
            } else {
                response = await createBrand();
            }
            
            if (!response.ok) {
                throw new Error(`Error al ${isEditing ? 'actualizar' : 'crear'} la marca: ${response.status} ${response.statusText}`);
            }

            setSuccess(`Marca ${isEditing ? 'actualizada' : 'creada'} exitosamente`);
            setTimeout(() => setSuccess(''), 3000);
            
            fetchBrands();
            setShowModal(false);
            resetForm();
        } catch (error) {
            setError(error.message || `Error al ${isEditing ? 'actualizar' : 'crear'} la marca`);
        } finally {
            setIsLoading(false);
        }
    };

    // DELETE - Eliminar marca (exactamente igual que handleDeleteBlog)
    const handleDeleteBrand = async (brandId, event) => {
        if (event) event.stopPropagation();
        if (!brandId) return;
        if (!window.confirm('¿Estás seguro de que deseas eliminar esta marca?')) return;
        
        try {
            setIsLoading(true);
            const response = await fetch(`http://localhost:3333/api/brands/${brandId}`, {
                method: 'DELETE',
            });
            
            if (!response.ok) {
                throw new Error(`Error al eliminar la marca: ${response.status} ${response.statusText}`);
            }
            
            setSuccess('Marca eliminada exitosamente');
            setTimeout(() => setSuccess(''), 3000);
            fetchBrands();
        } catch (error) {
            setError(error.message || 'Error al eliminar la marca');
        } finally {
            setIsLoading(false);
        }
    };

    // Helpers (exactamente igual que useBlog)
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            const reader = new FileReader();
            reader.onloadend = () => setPreviewUrl(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handleSelectImage = () => fileInputRef.current.click();

    const resetForm = () => {
        setBrandName('');
        setImage(null);
        setPreviewUrl('');
        setIsEditing(false);
        setCurrentBrandId(null);
        setError('');
    };

    const handleEditBrand = (brand) => {
        setBrandName(brand.brandName);
        setPreviewUrl(brand.photos || '');
        setIsEditing(true);
        setCurrentBrandId(brand._id);
        setShowModal(true);
    };

    const handleAddNew = () => {
        resetForm();
        setShowModal(true);
    };

    const handleRefresh = () => {
        fetchBrands();
    };

    // Funciones para el modal de eliminación
    const confirmDeleteBrand = async () => {
        if (!brandToDelete) return;
        await handleDeleteBrand(brandToDelete._id);
        setShowDeleteModal(false);
        setBrandToDelete(null);
    };

    const cancelDeleteBrand = () => {
        setShowDeleteModal(false);
        setBrandToDelete(null);
    };

    // Función para iniciar eliminación (para usar con el modal de confirmación)
    const startDeleteBrand = (brandId, event) => {
        if (event) event.stopPropagation();
        const brand = brands.find(b => b._id === brandId);
        setBrandToDelete(brand);
        setShowDeleteModal(true);
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
        
        // Estados del formulario
        brandName,
        setBrandName,
        image,
        setImage,
        previewUrl,
        setPreviewUrl,
        fileInputRef,
        
        // Funciones
        fetchBrands,
        createBrand,
        updateBrand,
        handleSubmit,
        handleDeleteBrand,
        startDeleteBrand,
        confirmDeleteBrand,
        cancelDeleteBrand,
        handleImageChange,
        handleSelectImage,
        resetForm,
        handleEditBrand,
        handleAddNew,
        handleRefresh,
    };
}