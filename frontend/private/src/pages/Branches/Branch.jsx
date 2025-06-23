// Branch.jsx
import React, { useEffect, useState } from 'react';
import { useBranchesManager } from '../../hooks/BranchesHooks/useBranches';
import Header from '../../components/Header/header';
import BranchCard from '../../components/Cards/BranchCard/BranchCard';
import Pagination from '../../components/Pagination/Pagination';
import BranchEditModal from '../../components/Modals/BranchesModals/BranchEditModal';
import DeleteConfirmationModal from '../../components/Modals/DeleteConfirmationModal/DeleteConfirmationModal';
import './Branch.css';

const BranchesPage = () => {
  const {
    // Estados principales
    branches,
    showModal,
    setShowModal,
    showDeleteModal,
    branchToDelete,
    isLoading,
    error,
    setError,
    success,
    isEditing,
    currentBranchId,
    
    // Estados del formulario (para pasar al modal)
    branch_name,
    country,
    address,
    phone_number,
    business_hours,
    
    // Funciones
    fetchBranches,
    handleSubmit,
    handleDeleteBranch,
    confirmDeleteBranch,
    cancelDeleteBranch,
    resetForm,
    handleEditBranch,
    handleAddNew,
    handleRefresh
  } = useBranchesManager();

  // Estados locales para paginación y filtros
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6); // Permitir cambio
  const [sortBy, setSortBy] = useState('name-asc');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Cargar sucursales al montar el componente
  useEffect(() => {
    fetchBranches();
  }, []);

  // Función para filtrar sucursales por búsqueda
  const getFilteredBranches = () => {
    if (!searchTerm.trim()) return branches;
    
    return branches.filter(branch => 
      branch.branch_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      branch.country?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      branch.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      branch.phone_number?.includes(searchTerm)
    );
  };

  // Función para ordenar sucursales
  const getSortedBranches = (branchesToSort) => {
    const sorted = [...branchesToSort];
    
    switch (sortBy) {
      case 'name-asc':
        return sorted.sort((a, b) => 
          (a.branch_name || '').localeCompare(b.branch_name || '')
        );
      case 'name-desc':
        return sorted.sort((a, b) => 
          (b.branch_name || '').localeCompare(a.branch_name || '')
        );
      case 'country-asc':
        return sorted.sort((a, b) => 
          (a.country || '').localeCompare(b.country || '')
        );
      case 'country-desc':
        return sorted.sort((a, b) => 
          (b.country || '').localeCompare(a.country || '')
        );
      case 'phone-asc':
        return sorted.sort((a, b) => 
          (a.phone_number || '').localeCompare(b.phone_number || '')
        );
      case 'phone-desc':
        return sorted.sort((a, b) => 
          (b.phone_number || '').localeCompare(a.phone_number || '')
        );
      default:
        return sorted;
    }
  };

  // Obtener sucursales procesadas (filtradas y ordenadas)
  const getProcessedBranches = () => {
    const filtered = getFilteredBranches();
    return getSortedBranches(filtered);
  };

  const processedBranches = getProcessedBranches();

  // Calcular paginación
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentBranches = processedBranches.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(processedBranches.length / itemsPerPage);

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
    <div className="branches-page">
      <Header 
        title="Sucursales" 
        onAddNew={handleAddNew} 
        onRefresh={handleRefresh}
        showSearch={false}
        onSearch={handleSearch}
        searchPlaceholder="Buscar por nombre, país, dirección o teléfono..."
        sortOptions={[
          { label: 'Nombre (A-Z)', value: 'name-asc' },
          { label: 'Nombre (Z-A)', value: 'name-desc' },
          { label: 'País (A-Z)', value: 'country-asc' },
          { label: 'País (Z-A)', value: 'country-desc' },
          { label: 'Teléfono (1-9)', value: 'phone-asc' },
          { label: 'Teléfono (9-1)', value: 'phone-desc' }
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
            {searchTerm && ` (filtradas de ${branches.length} total)`}
          </span>
        </div>
      )}
      
      {/* Grid de sucursales */}
      <div className="branch-grid">
        {currentBranches.length > 0 ? (
          currentBranches.map(branch => (
            <BranchCard 
              key={branch._id} 
              data={branch}
              onEdit={() => handleEditBranch(branch)}
              onDelete={() => handleDeleteBranch(branch._id)}
              isLoading={isLoading}
            />
          ))
        ) : (
          !isLoading && (
            <div className="no-data-message">
              {searchTerm ? (
                <>
                  <p>No se encontraron sucursales que coincidan con "{searchTerm}"</p>
                  <button onClick={() => setSearchTerm('')} className="btn btn-secondary">
                    Limpiar búsqueda
                  </button>
                </>
              ) : (
                <>
                  <p>No hay sucursales registradas, revisa tu conexión a internet o agrega una.</p>
                </>
              )}
            </div>
          )
        )}
      </div>
      
      {/* Paginación - Solo mostrar si hay más elementos que itemsPerPage */}
      {processedBranches.length > 0 && (
        <Pagination 
          totalItems={processedBranches.length}
          itemsPerPage={itemsPerPage}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={handleItemsPerPageChange}
          totalPages={totalPages}
          showItemsPerPage={true}
          itemsPerPageOptions={[6, 10, 25, 50]}
        />
      )}
      
      {/* Modal de edición/creación - Usar tu modal original */}
      <BranchEditModal 
        branch={isEditing ? {
          _id: currentBranchId,
          branch_name: branch_name,
          country: country,
          address: address,
          phone_number: phone_number,
          business_hours: business_hours
        } : {
          branch_name: '',
          country: '',
          address: '',
          phone_number: '',
          business_hours: [{ day: 'Lunes', open: '08:00', close: '18:00' }]
        }}
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          resetForm();
        }}
        onSave={handleSubmit}
      />
      
      {/* Modal de confirmación de eliminación */}
      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={cancelDeleteBranch}
        onConfirm={confirmDeleteBranch}
        title="Eliminar Sucursal"
        message="¿Estás seguro de que deseas eliminar esta sucursal?"
        itemName={branchToDelete?.branch_name || ""}
        isLoading={isLoading}
      />
    </div>
  );
};

export default BranchesPage;