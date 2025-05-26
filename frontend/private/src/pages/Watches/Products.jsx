// ProductsPage.jsx - Actualizado con hook
import React, { useEffect, useState } from 'react';
import { useWatchesManager } from '../../hooks/WatchesHooks/useWatches';
import Header from '../../components/Header/header';
import ProductCard from '../../components/Cards/ProductCard/ProductCard';
import Pagination from '../../components/Pagination/Pagination';
import EditModal from '../../components/Modals/WatchesModals/EditModal';
import DeleteConfirmationModal from '../../components/Modals/DeleteConfirmationModal/DeleteConfirmationModal';
import './Products.css';

const ProductsPage = () => {
  const {
    // Estados principales
    watches,
    brands, // Agregar brands
    showModal,
    setShowModal,
    showDeleteModal,
    watchToDelete,
    isLoading,
    error,
    setError,
    success,
    isEditing,
    currentWatchId,
    
    // Estados del formulario
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
    
    // Funciones
    fetchWatches,
    handleSubmit,
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
  } = useWatchesManager();

  // Estados locales para paginación y filtros
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortBy, setSortBy] = useState('model-asc');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Cargar relojes al montar el componente
  useEffect(() => {
    fetchWatches();
  }, []);

  // Función para filtrar relojes por búsqueda
  const getFilteredWatches = () => {
    if (!searchTerm.trim()) return watches;
    
    return watches.filter(watch => 
      watch.model?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      watch.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      watch.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  // Función para ordenar relojes
  const getSortedWatches = (watchesToSort) => {
    const sorted = [...watchesToSort];
    
    switch (sortBy) {
      case 'model-asc':
        return sorted.sort((a, b) => 
          (a.model || '').localeCompare(b.model || '')
        );
      case 'model-desc':
        return sorted.sort((a, b) => 
          (b.model || '').localeCompare(a.model || '')
        );
      case 'price-asc':
        return sorted.sort((a, b) => (a.price || 0) - (b.price || 0));
      case 'price-desc':
        return sorted.sort((a, b) => (b.price || 0) - (a.price || 0));
      case 'category-asc':
        return sorted.sort((a, b) => 
          (a.category || '').localeCompare(b.category || '')
        );
      case 'newest':
        return sorted.sort((a, b) => 
          new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
        );
      case 'oldest':
        return sorted.sort((a, b) => 
          new Date(a.createdAt || 0) - new Date(b.createdAt || 0)
        );
      default:
        return sorted;
    }
  };

  // Obtener relojes procesados (filtrados y ordenados)
  const getProcessedWatches = () => {
    const filtered = getFilteredWatches();
    return getSortedWatches(filtered);
  };

  const processedWatches = getProcessedWatches();

  // Calcular paginación
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentWatches = processedWatches.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(processedWatches.length / itemsPerPage);

  // Resetear página al cambiar filtros o items per page
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, sortBy, itemsPerPage]);
  
  // Función para cerrar mensajes de error
  const handleCloseError = () => {
    setError('');
  };

  // Manejar búsqueda desde el Header
  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  // Manejar ordenamiento desde el Header
  const handleSort = (sortOption) => {
    setSortBy(sortOption);
  };

  // Manejar cambio de items per page
  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
  };
  
  return (
    <div className="products-page">
      <Header 
        title="Relojes" 
        onAddNew={handleAddNew} 
        onRefresh={handleRefresh}
        showSearch={false}
        onSearch={handleSearch}
        searchPlaceholder="Buscar relojes por modelo, categoría..."
        sortOptions={[
          { label: 'Modelo (A-Z)', value: 'model-asc' },
          { label: 'Modelo (Z-A)', value: 'model-desc' },
          { label: 'Precio (Menor a Mayor)', value: 'price-asc' },
          { label: 'Precio (Mayor a Menor)', value: 'price-desc' },
          { label: 'Categoría (A-Z)', value: 'category-asc' },
          { label: 'Más recientes', value: 'newest' },
          { label: 'Más antiguos', value: 'oldest' }
        ]}
        onSort={handleSort}
        showAddButton={true}
      />
      
      {/* Mostrar mensajes de error */}
      {error && (
        <div className="error-message">
          <span>{error}</span>
          <button onClick={handleCloseError} className="close-btn">×</button>
        </div>
      )}
      
      {/* Mostrar mensajes de éxito */}
      {success && (
        <div className="success-message">
          {success}
        </div>
      )}
      
      {/* Mostrar indicador de carga */}
      {isLoading && (
        <div className="loading-indicator">
          <div className="spinner"></div>
          <span>Cargando...</span>
        </div>
      )}

      {/* Información de resultados */}
      {!isLoading && (
        <div className="results-info">
          <span>
            {searchTerm && ` (filtrados de ${watches.length} total)`}
          </span>
        </div>
      )}
      
      {/* Grid de relojes */}
      <div className="product-grid">
        {currentWatches.length > 0 ? (
          currentWatches.map(watch => (
            <ProductCard 
              key={watch._id} 
              data={watch}
              onEdit={() => handleEditWatch(watch)}
              onDelete={() => startDeleteWatch(watch._id)}
              isLoading={isLoading}
            />
          ))
        ) : (
          !isLoading && (
            <div className="no-data-message">
              {searchTerm ? (
                <>
                  <p>No se encontraron relojes que coincidan con "{searchTerm}"</p>
                  <button onClick={() => setSearchTerm('')} className="btn btn-secondary">
                    Limpiar búsqueda
                  </button>
                </>
              ) : (
                <>
                  <p>No hay relojes registrados.</p>
                  <button onClick={handleAddNew} className="btn btn-primary">
                    Agregar Primer Reloj
                  </button>
                </>
              )}
            </div>
          )
        )}
      </div>
      
      {/* Paginación - Solo mostrar si hay elementos */}
      {processedWatches.length > 0 && (
        <Pagination 
          totalItems={processedWatches.length}
          itemsPerPage={itemsPerPage}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={handleItemsPerPageChange}
          totalPages={totalPages}
          showItemsPerPage={true}
          itemsPerPageOptions={[8, 10, 16, 24]}
        />
      )}
      
      {/* Modal de edición/creación */}
      {showModal && (
        <EditModal 
          // Estados del formulario
          model={model}
          setModel={setModel}
          brandId={brandId}
          setBrandId={setBrandId}
          brands={brands} // Pasar brands al modal
          price={price}
          setPrice={setPrice}
          category={category}
          setCategory={setCategory}
          description={description}
          setDescription={setDescription}
          availability={availability}
          setAvailability={setAvailability}
          photos={photos}
          setPhotos={setPhotos}
          activePhotoIndex={activePhotoIndex}
          setActivePhotoIndex={setActivePhotoIndex}
          fileInputRef={fileInputRef}
          
          // Funciones
          handleSubmit={handleSubmit}
          handleFileSelect={handleFileSelect}
          handleDeletePhoto={handleDeletePhoto}
          handleSelectImage={handleSelectImage}
          isLoading={isLoading}
          isEditing={isEditing}
          onClose={() => {
            setShowModal(false);
            resetForm();
          }}
        />
      )}
      
      {/* Modal de confirmación de eliminación */}
      {showDeleteModal && (
        <DeleteConfirmationModal
          isOpen={showDeleteModal}
          onClose={cancelDeleteWatch}
          onConfirm={confirmDeleteWatch}
          title="Eliminar Reloj"
          message="¿Estás seguro de que deseas eliminar este reloj?"
          itemName={watchToDelete?.model || ""}
          isLoading={isLoading}
        />
      )}
    </div>
  );
};

export default ProductsPage;