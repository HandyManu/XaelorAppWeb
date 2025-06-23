import { useState, useRef, useEffect } from 'react';
import { config } from '../../config';

const API_BASE = config.api.API_BASE;

export function useWatchesManager() {
    const [watches, setWatches] = useState([]);
    const [brands, setBrands] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [watchToDelete, setWatchToDelete] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [currentWatchId, setCurrentWatchId] = useState(null);

    // Estados del formulario
    const [model, setModel] = useState('');
    const [brandId, setBrandId] = useState('');
    const [price, setPrice] = useState(0);
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');
    const [availability, setAvailability] = useState(true);
    const [photos, setPhotos] = useState([]);
    const [activePhotoIndex, setActivePhotoIndex] = useState(0);
    const fileInputRef = useRef(null);

    // GET - Obtener marcas para el dropdown
    const fetchBrands = async () => {
        try {
            const response = await fetch(`${API_BASE}/brands`);
            if (response.ok) {
                const data = await response.json();
                setBrands(data);
            }
        } catch (error) {
            console.error('Error al cargar marcas:', error);
        }
    };

    // GET - Obtener todos los relojes
    const fetchWatches = async () => {
        try {
            setIsLoading(true);
            setError('');

            const response = await fetch(`${API_BASE}/watches`);

            if (!response.ok) {
                throw new Error(`Error al cargar los relojes: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            console.log('Relojes recibidos:', data);
            setWatches(data);
        } catch (error) {
            console.error('Error al cargar relojes:', error);
            setError('No se pudieron cargar los relojes. ' + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    // Ejecutar fetchWatches solo una vez al montar el hook
    useEffect(() => {
        fetchWatches();
    }, []);

    // POST/PUT - Crear o actualizar reloj
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!model.trim()) {
            setError('El modelo es obligatorio');
            return;
        }
        if (!brandId.trim()) {
            setError('La marca es obligatoria');
            return;
        }
        if (price <= 0) {
            setError('El precio debe ser mayor a 0');
            return;
        }
        if (!category.trim()) {
            setError('La categoría es obligatoria');
            return;
        }
        if (!description.trim()) {
            setError('La descripción es obligatoria');
            return;
        }
        if (!photos.length) {
            setError('Debes añadir al menos una imagen');
            return;
        }

        try {
            setIsLoading(true);
            setError('');

            // Crear FormData para enviar archivos
            const formData = new FormData();
            formData.append('model', model.trim());
            formData.append('brandId', brandId.trim());
            formData.append('price', price);
            formData.append('category', category.trim());
            formData.append('description', description.trim());
            formData.append('availability', availability);

            // Separar fotos nuevas y existentes
            const newPhotos = photos.filter(photo => photo.file && !photo.isServerImage);
            const existingPhotos = photos.filter(photo => photo.isServerImage && !photo.file);

            // Agregar fotos nuevas
            newPhotos.forEach((photo, index) => {
                formData.append('photos', photo.file);
                console.log(`Agregando nueva foto ${index}:`, photo.file.name);
            });

            // Si estamos editando, enviar las URLs de las fotos que queremos mantener
            if (isEditing) {
                const photosToKeep = existingPhotos.map(photo => photo.url);
                formData.append('existingPhotos', JSON.stringify(photosToKeep));
                console.log('Fotos existentes a mantener:', photosToKeep);
            }

            // Log para debug
            console.log('Enviando formulario:', {
                model: model.trim(),
                brandId: brandId.trim(),
                price,
                category: category.trim(),
                description: description.trim(),
                availability,
                newPhotosCount: newPhotos.length,
                existingPhotosCount: existingPhotos.length,
                totalPhotos: photos.length,
                isEditing
            });

            let response;
            if (isEditing && currentWatchId) {
                response = await fetch(`${API_BASE}/watches/${currentWatchId}`, {
                    method: 'PUT',
                    body: formData,
                });
            } else {
                response = await fetch(`${API_BASE}/watches`, {
                    method: 'POST',
                    body: formData,
                });
            }

            if (!response.ok) {
                throw new Error(`Error al ${isEditing ? 'actualizar' : 'crear'} el reloj: ${response.status} ${response.statusText}`);
            }

            setSuccess(`Reloj ${isEditing ? 'actualizado' : 'creado'} exitosamente`);
            setTimeout(() => setSuccess(''), 3000);

            fetchWatches();
            setShowModal(false);
            resetForm();
        } catch (error) {
            setError(error.message || `Error al ${isEditing ? 'actualizar' : 'crear'} el reloj`);
        } finally {
            setIsLoading(false);
        }
    };

    // DELETE - Eliminar reloj
    const handleDeleteWatch = async (watchId, event) => {
        if (event) event.stopPropagation();
        if (!watchId) return;

        try {
            setIsLoading(true);
            const response = await fetch(`${API_BASE}/watches/${watchId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error(`Error al eliminar el reloj: ${response.status} ${response.statusText}`);
            }

            setSuccess('Reloj eliminado exitosamente');
            setTimeout(() => setSuccess(''), 3000);
            fetchWatches();
        } catch (error) {
            setError(error.message || 'Error al eliminar el reloj');
        } finally {
            setIsLoading(false);
        }
    };

    // Manejo de imágenes
    const handleFileSelect = (files) => {
        const newPhotos = Array.from(files).map(file => {
            // Validación de tipo de archivo
            const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
            if (!validTypes.includes(file.type)) {
                setError(`El archivo ${file.name} no es una imagen válida. Use JPG, PNG, WebP o GIF.`);
                return null;
            }

            // Crear URL temporal para vista previa
            const photoUrl = URL.createObjectURL(file);

            return {
                url: photoUrl,
                file: file,
                name: file.name,
                isServerImage: false
            };
        }).filter(photo => photo !== null);

        if (newPhotos.length === 0) return;

        // Actualizamos el estado añadiendo las nuevas fotos
        const updatedPhotos = [...photos, ...newPhotos];
        setPhotos(updatedPhotos);

        // Si no había fotos antes, seleccionamos la primera nueva
        if (photos.length === 0 && newPhotos.length > 0) {
            setActivePhotoIndex(0);
        }
    };

    const handleDeletePhoto = (index) => {
        const updatedPhotos = [...photos];
        const photoToDelete = updatedPhotos[index];

        // Liberar URL si es temporal (blob) - solo para nuevas imágenes
        if (photoToDelete.url && photoToDelete.url.startsWith('blob:')) {
            URL.revokeObjectURL(photoToDelete.url);
        }

        // Eliminar la foto del array inmediatamente
        updatedPhotos.splice(index, 1);
        setPhotos(updatedPhotos);

        // Manejar el índice activo para evitar errores
        if (updatedPhotos.length === 0) {
            setActivePhotoIndex(0);
        } else if (index <= activePhotoIndex) {
            if (index === activePhotoIndex && index === updatedPhotos.length) {
                setActivePhotoIndex(Math.max(0, updatedPhotos.length - 1));
            } else if (index < activePhotoIndex) {
                setActivePhotoIndex(activePhotoIndex - 1);
            } else if (index === activePhotoIndex && updatedPhotos.length > 0) {
                setActivePhotoIndex(Math.min(activePhotoIndex, updatedPhotos.length - 1));
            }
        }

        console.log('Foto eliminada del array local. Fotos restantes:', updatedPhotos.length);
        console.log('Foto eliminada:', photoToDelete.url);
    };

    const handleSelectImage = () => fileInputRef.current.click();

    const resetForm = () => {
        setModel('');
        setBrandId('');
        setPrice(0);
        setCategory('');
        setDescription('');
        setAvailability(true);
        setActivePhotoIndex(0);
        setIsEditing(false);
        setCurrentWatchId(null);
        setError('');

        // Liberar URLs temporales antes de limpiar
        photos.forEach(photo => {
            if (photo.url && photo.url.startsWith('blob:')) {
                URL.revokeObjectURL(photo.url);
            }
        });

        // Limpiar array de fotos
        setPhotos([]);

        console.log('Formulario reiniciado');
    };

    const handleEditWatch = (watch) => {
        setModel(watch.model || '');
        setBrandId(watch.brandId?._id || watch.brandId || '');
        setPrice(watch.price || 0);
        setCategory(watch.category || '');
        setDescription(watch.description || '');
        setAvailability(watch.availability !== undefined ? watch.availability : true);

        // Convertir fotos del formato del servidor al formato del componente
        const formattedPhotos = (watch.photos || []).map((photo, index) => {
            let photoUrl;

            if (typeof photo === 'string') {
                photoUrl = photo;
            } else if (typeof photo === 'object') {
                photoUrl = photo.url || photo.secure_url || photo;
            } else {
                photoUrl = photo;
            }

            return {
                url: photoUrl,
                name: photo.name || photo.original_filename || `Imagen ${index + 1}`,
                isServerImage: true // Marcar como imagen del servidor
            };
        });

        console.log('Fotos formateadas para edición:', formattedPhotos);

        setPhotos(formattedPhotos);
        setActivePhotoIndex(watch.activePhotoIndex || 0);
        setIsEditing(true);
        setCurrentWatchId(watch._id);
        setShowModal(true);

        // Cargar marcas cuando se abre el modal
        fetchBrands();
    };

    const handleAddNew = () => {
        resetForm();
        setShowModal(true);
        // Cargar marcas cuando se abre el modal
        fetchBrands();
    };

    const handleRefresh = () => {
        fetchWatches();
    };

    // Funciones para el modal de eliminación
    const confirmDeleteWatch = async () => {
        if (!watchToDelete) return;
        await handleDeleteWatch(watchToDelete._id);
        setShowDeleteModal(false);
        setWatchToDelete(null);
    };

    const cancelDeleteWatch = () => {
        setShowDeleteModal(false);
        setWatchToDelete(null);
    };

    const startDeleteWatch = (watchId, event) => {
        if (event) event.stopPropagation();
        const watch = watches.find(w => w._id === watchId);
        setWatchToDelete(watch);
        setShowDeleteModal(true);
    };

    // No pongas ningún JSX aquí, solo retorna los estados y funciones
    return {
        watches,
        setWatches,
        brands,
        setBrands,
        showModal,
        setShowModal,
        showDeleteModal,
        setShowDeleteModal,
        watchToDelete,
        setWatchToDelete,
        isLoading,
        setIsLoading,
        error,
        setError,
        success,
        setSuccess,
        isEditing,
        setIsEditing,
        currentWatchId,
        setCurrentWatchId,
        model,
        setModel,
        brandId,
        setBrandId,
        price,
        setPrice,
        category,
        setCategory,
        description,
        setDescription,
        availability,
        setAvailability,
        photos,
        setPhotos,
        activePhotoIndex,
        setActivePhotoIndex,
        fileInputRef,
        fetchWatches,
        fetchBrands,
        handleSubmit,
        handleDeleteWatch,
        startDeleteWatch,
        confirmDeleteWatch,
        cancelDeleteWatch,
        handleFileSelect,
        handleDeletePhoto,
        handleSelectImage,
        resetForm,
        handleEditWatch,
        handleAddNew,
        handleRefresh,
    };
}