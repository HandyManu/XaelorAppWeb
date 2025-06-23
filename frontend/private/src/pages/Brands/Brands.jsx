// Brands.jsx - Versión completa y corregida
import React, { useEffect, useState } from 'react';
import { useBrandsManager } from '../../hooks/BrandsHooks/useBrands';
import Header from '../../components/Header/header';
import BrandCard from '../../components/Cards/BrandCard/BrandCard';
import Pagination from '../../components/Pagination/Pagination';
import BrandEditModal from '../../components/Modals/BrandModals/BrandEditModal';
import DeleteConfirmationModal from '../../components/Modals/DeleteConfirmationModal/DeleteConfirmationModal';
import toast, { Toaster } from 'react-hot-toast';
import './Brands.css';

const BrandsPage = () => {
  const {
    // Estados principales
    brands,
    showModal,
    setShowModal,
    showDeleteModal,
    brandToDelete,
    isLoading,
    error,
    setError,
    success,
    isEditing,
    currentBrandId,
    
    // Estados del formulario (nombres correctos del hook)
    brandName,
    setBrandName,
    image,
    setImage,
    previewUrl,
    setPreviewUrl,
    fileInputRef,
    
    // Funciones
    fetchBrands,
    handleSubmit,
    startDeleteBrand,
    confirmDeleteBrand,
    cancelDeleteBrand,
    resetForm,
    handleEditBrand,
    handleAddNew,
    handleRefresh,
    handleImageChange,
    handleSelectImage
  } = useBrandsManager();

  // Estados locales para paginación y filtros
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(16);
  const [sortBy, setSortBy] = useState('name-asc');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Cargar marcas al montar el componente
  useEffect(() => {
    fetchBrands();
  }, []);

  // Función para filtrar marcas por búsqueda
  const getFilteredBrands = () => {
    if (!searchTerm.trim()) return brands;
    
    return brands.filter(brand => 
      brand.brandName?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  // Función para ordenar marcas
  const getSortedBrands = (brandsToSort) => {
    const sorted = [...brandsToSort];
    
    switch (sortBy) {
      case 'name-asc':
        return sorted.sort((a, b) => 
          (a.brandName || '').localeCompare(b.brandName || '')
        );
      case 'name-desc':
        return sorted.sort((a, b) => 
          (b.brandName || '').localeCompare(a.brandName || '')
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

  // Obtener marcas procesadas (filtradas y ordenadas)
  const getProcessedBrands = () => {
    const filtered = getFilteredBrands();
    return getSortedBrands(filtered);
  };

  const processedBrands = getProcessedBrands();

  // Calcular paginación
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentBrands = processedBrands.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(processedBrands.length / itemsPerPage);

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
  
  // Mostrar notificaciones de error y éxito
  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  useEffect(() => {
    if (success) toast.success(success);
  }, [success]);
  
  return (
    <div className="brands-page">
      <Header 
        title="Marcas" 
        onAddNew={handleAddNew} 
        onRefresh={handleRefresh}
        showSearch={false}
        onSearch={handleSearch}
        searchPlaceholder="Buscar marcas por nombre..."
        sortOptions={[
          { label: 'Nombre (A-Z)', value: 'name-asc' },
          { label: 'Nombre (Z-A)', value: 'name-desc' },
          { label: 'Más recientes', value: 'newest' },
          { label: 'Más antiguas', value: 'oldest' }
        ]}
        onSort={handleSort}
        showAddButton={true}
      />
    

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
            {searchTerm && ` (filtradas de ${brands.length} total)`}
          </span>
        </div>
      )}
      
      {/* Grid de marcas */}
      <div className="brand-grid">
        {currentBrands.length > 0 ? (
          currentBrands.map(brand => (
            <BrandCard 
              key={brand._id} 
              data={brand}
              onEdit={() => handleEditBrand(brand)}
              onDelete={() => startDeleteBrand(brand._id)}
              isLoading={isLoading}
            />
          ))
        ) : (
          !isLoading && (
            <div className="no-data-message">
              {searchTerm ? (
                <>
                  <p>No se encontraron marcas que coincidan con "{searchTerm}"</p>
                  <button onClick={() => setSearchTerm('')} className="btn btn-secondary">
                    Limpiar búsqueda
                  </button>
                </>
              ) : (
                <>
                  <p>No hay marcas registradas, revisa tu conexión a internet o agrega una.</p>
    
                </>
              )}
            </div>
          )
        )}
      </div>
      
      {/* Paginación - Solo mostrar si hay elementos */}
      {processedBrands.length > 0 && (
        <Pagination 
          totalItems={processedBrands.length}
          itemsPerPage={itemsPerPage}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={handleItemsPerPageChange}
          totalPages={totalPages}
          showItemsPerPage={true}
          itemsPerPageOptions={[8, 16, 24, 32]}
        />
      )}
      
      {/* Modal de edición/creación - Usando TU CSS */}
      {showModal && (
        <BrandEditModal 
          brandName={brandName}
          setBrandName={setBrandName}
          previewUrl={previewUrl}
          setPreviewUrl={setPreviewUrl}
          setImage={setImage}
          handleImageChange={handleImageChange}
          handleSelectImage={handleSelectImage}
          fileInputRef={fileInputRef}
          handleSubmit={handleSubmit}
          isLoading={isLoading}
          isEditing={isEditing}
          onClose={() => {
            setShowModal(false);
            resetForm();
          }}
        >
          <form onSubmit={handleSubmit} className="edit-form">
          <div className="form-group">
            <label htmlFor="brandName">Nombre de la Marca</label>
            <input
              type="text"
              id="brandName"
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
              placeholder="Ingresa el nombre de la marca"
              disabled={isLoading}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Logo de la Marca</label>
            <div className="logo-upload-container">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/jpeg, image/png, image/jpg"
                style={{ display: 'none' }}
              />
              
              <div className="logo-upload" onClick={handleSelectImage}>
                {previewUrl ? (
                  <img src={previewUrl} alt="Vista previa del logo" className="logo-preview" />
                ) : (
                  <div className="upload-placeholder">
                    <div className="upload-icon">📷</div>
                    <div className="upload-text">Seleccionar logo</div>
                  </div>
                )}
              </div>
              
              {previewUrl && (
                <button
                  type="button"
                  className="remove-image-btn"
                  onClick={() => {
                    setPreviewUrl('');
                    setImage(null);
                  }}
                >
                  Cambiar imagen
                </button>
              )}
            </div>
          </div>
          
          <div className="form-actions">
            <button
              type="button"
              className="cancel-button"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="save-button"
              disabled={isLoading}
            >
              {isLoading ? 'Guardando...' : isEditing ? 'Actualizar' : 'Guardar'}
            </button>
          </div>
        </form>
        </BrandEditModal>
      )}
      
      {/* Modal de confirmación de eliminación */}
      {showDeleteModal && (
        <DeleteConfirmationModal
          isOpen={showDeleteModal}
          onClose={cancelDeleteBrand}
          onConfirm={confirmDeleteBrand}
          title="Eliminar Marca"
          message="¿Estás seguro de que deseas eliminar esta marca?"
          itemName={brandToDelete?.brandName || ""}
          isLoading={isLoading}
        />
      )}

      <Toaster position="top-right" />
    </div>
  );
};

export default BrandsPage;