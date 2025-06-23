// Inventory.jsx - Actualizado para usar el hook real
import React, { useEffect, useState } from 'react';
import { useInventoryManager } from '../../hooks/InventoryHooks/useInventory';
import Header from '../../components/Header/header';
import InventoryCard from '../../components/Cards/InventoryCard/InventoryCard';
import Pagination from '../../components/Pagination/Pagination';
import InventoryEditModal from '../../components/Modals/InventoryModals/InventoryEditModal';
import DeleteConfirmationModal from '../../components/Modals/DeleteConfirmationModal/DeleteConfirmationModal';
import toast, { Toaster } from 'react-hot-toast'; // <-- Agrega esto
import './Inventory.css';

const InventoryPage = () => {
  const {
    // Estados principales
    inventories,
    watches,
    branches,
    showModal,
    setShowModal,
    showDeleteModal,
    inventoryToDelete,
    isLoading,
    error,
    success,
    setError,
    isEditing,
    currentInventoryId,
    
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
    loadInitialData,
    fetchInventories,
    handleSubmit,
    handleDeleteInventory,
    confirmDeleteInventory,
    cancelDeleteInventory,
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
  } = useInventoryManager();

  // Estados locales para filtros y búsqueda
  const [sortBy, setSortBy] = useState('model');
  const [searchTerm, setSearchTerm] = useState('');
  const [branchFilter, setBranchFilter] = useState('all');
  
  // Cargar todos los datos al montar el componente
  useEffect(() => {
    loadInitialData();
  }, []);

  // Función para manejar búsqueda desde el Header
  const handleSearch = (term) => {
    setSearchTerm(term);
    setCurrentPage(1); // Resetear a la primera página al buscar
  };

  // Función para manejar ordenamiento desde el Header
  const handleSort = (sortOption) => {
    setSortBy(sortOption);
    setCurrentPage(1); // Resetear a la primera página al ordenar
  };

  // Función para manejar filtro por sucursal
  const handleBranchFilter = (branchId) => {
    setBranchFilter(branchId);
    setCurrentPage(1); // Resetear a la primera página al filtrar
  };

  // Obtener inventarios procesados (filtrados y ordenados)
  const processedInventories = getFilteredInventories(sortBy, searchTerm, branchFilter);

  // Calcular paginación con los inventarios procesados
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentInventories = processedInventories.slice(indexOfFirstItem, indexOfLastItem);
  const calculatedTotalPages = Math.ceil(processedInventories.length / itemsPerPage);

  // Resetear página al cambiar filtros o items per page
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, sortBy, itemsPerPage, branchFilter]);

  // Mostrar notificaciones de error y éxito
  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  useEffect(() => {
    if (success) toast.success(success);
  }, [success]);

  // Función para preparar datos del formulario para el submit
  const handleFormSubmit = (formData) => {
    const inventoryData = {
      _id: isEditing ? currentInventoryId : null,
      watchId: formData.watchId,
      branchId: formData.branchId,
      stockChange: formData.stockChange,
      operation: formData.operation,
      notes: formData.notes
    };
    
    handleSubmit(inventoryData);
  };

  return (
    <div className="inventory-page">
      <Header 
        title="Inventario" 
        onAddNew={handleAddNew} 
        onRefresh={handleRefresh}
        showSearch={true}
        onSearch={handleSearch}
        searchPlaceholder="Buscar por modelo de reloj o sucursal..."
        sortOptions={[
          { label: 'Modelo', value: 'model' },
          { label: 'Stock (Menor a Mayor)', value: 'stock-low' },
          { label: 'Stock (Mayor a Menor)', value: 'stock-high' },
          { label: 'Sucursal', value: 'branch' },
          { label: 'Valor Total', value: 'value' },
          { label: 'Movimientos Recientes', value: 'recent' }
        ]}
        onSort={handleSort}
        showAddButton={true}
      />

      {/* Elimina los mensajes visuales de error y éxito */}
      {/* 
      {error && (
        <div className="error-message">
          <span>{error}</span>
          <button onClick={handleCloseError} className="close-btn">×</button>
        </div>
      )}
      {success && (
        <div className="success-message">
          {success}
        </div>
      )}
      */}

      {/* Mostrar indicador de carga */}
      {isLoading && (
        <div className="loading-indicator">
          <div className="spinner"></div>
          <span>Cargando...</span>
        </div>
      )}

      {/* Estadísticas del inventario */}
      {!isLoading && (
        <div className="inventory-stats">
          <div className="stat-card">
            <div className="stat-label">Total Unidades</div>
            <div className="stat-value">{getTotalStock()}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Valor Total</div>
            <div className="stat-value">${getTotalValue().toLocaleString()}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Total Registros</div>
            <div className="stat-value">{inventories.length}</div>
          </div>
          {branchFilter !== 'all' && (
            <div className="stat-card">
              <div className="stat-label">Registros Filtrados</div>
              <div className="stat-value">{processedInventories.length}</div>
            </div>
          )}
        </div>
      )}
      
      {/* Grid de inventarios */}
      <div className="inventory-grid">
        {currentInventories.length > 0 ? (
          currentInventories.map(inventory => (
            <InventoryCard 
              key={inventory._id} 
              data={{
                ...inventory,
                stock: inventory.calculatedStock || calculateStockFromMovements(inventory)
              }}
              watchInfo={getWatchInfo(inventory.watchId)}
              branchInfo={getBranchInfo(inventory.branchId)}
              onEdit={() => handleEditInventory(inventory)}
              onDelete={() => handleDeleteInventory(inventory._id)}
              isLoading={isLoading}
              calculateStockFromMovements={calculateStockFromMovements}
            />
          ))
        ) : (
          !isLoading && (
            <div className="no-inventory">
              {searchTerm || branchFilter !== 'all' ? (
                <>
                  <p>No se encontraron registros que coincidan con los filtros aplicados</p>
                  <button onClick={() => {
                    setSearchTerm('');
                    setBranchFilter('all');
                  }} className="btn btn-secondary">
                    Limpiar filtros
                  </button>
                </>
              ) : (
                <>
                  <p>No hay registros de inventario, revisa tu conexión a internet o agrega uno.</p>
                </>
              )}
            </div>
          )
        )}
      </div>
      
      {/* Paginación - Solo mostrar si hay elementos */}
      {processedInventories.length > 0 && (
        <Pagination 
          totalItems={processedInventories.length}
          itemsPerPage={itemsPerPage}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={setItemsPerPage}
          totalPages={calculatedTotalPages}
          showItemsPerPage={true}
          itemsPerPageOptions={[6, 12, 18, 24]}
        />
      )}
      
      {/* Modal de edición/creación */}
      {showModal && (
        <InventoryEditModal 
          // Estados del formulario
          watchId={watchId}
          setWatchId={setWatchId}
          branchId={branchId}
          setBranchId={setBranchId}
          stockChange={stockChange}
          setStockChange={setStockChange}
          operation={operation}
          setOperation={setOperation}
          notes={notes}
          setNotes={setNotes}
          currentStock={currentStock}
          watches={watches}
          branches={branches}
          
          // Funciones y estados
          handleSubmit={handleFormSubmit}
          isLoading={isLoading}
          isEditing={isEditing}
          onClose={() => {
            setShowModal(false);
          }}
        />
      )}
      
      {/* Modal de confirmación de eliminación */}
      {showDeleteModal && (
        <DeleteConfirmationModal
          isOpen={showDeleteModal}
          onClose={cancelDeleteInventory}
          onConfirm={confirmDeleteInventory}
          title="Eliminar Registro de Inventario"
          message="¿Estás seguro de que deseas eliminar este registro de inventario?"
          itemName={`${getWatchInfo(inventoryToDelete?.watchId)?.model || 'Reloj'} - ${getBranchInfo(inventoryToDelete?.branchId)?.branch_name || 'Sucursal'}`}
          isLoading={isLoading}
        />
      )}

      <Toaster position="top-right" />
    </div>
  );
};

export default InventoryPage;