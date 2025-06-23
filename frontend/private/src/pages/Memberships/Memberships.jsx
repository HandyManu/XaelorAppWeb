// Memberships.jsx - Actualizado para usar el hook real
import React, { useEffect, useState } from 'react';
import { useMembershipsManager } from '../../hooks/MembershipsHooks/useMemberships';
import Header from '../../components/Header/header';
import MembershipCard from '../../components/Cards/MembershipCard/MembershipCard';
import Pagination from '../../components/Pagination/Pagination';
import MembershipEditModal from '../../components/Modals/MembershipsModals/MembershipsEditModal';
import DeleteConfirmationModal from '../../components/Modals/DeleteConfirmationModal/DeleteConfirmationModal';
import toast, { Toaster } from 'react-hot-toast'; // <-- Agrega esto
import './Memberships.css';

const MembershipsPage = () => {
  const {
    // Estados principales
    memberships,
    showModal,
    setShowModal,
    showDeleteModal,
    membershipToDelete,
    isLoading,
    error,
    success,
    setError,
    isEditing,
    currentMembershipId,
    
    // Estados de paginación
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    
    // Estados del formulario
    membershipTier,
    setMembershipTier,
    price,
    setPrice,
    benefits,
    setBenefits,
    discount,
    setDiscount,
    
    // Funciones
    loadInitialData,
    handleSubmit,
    handleDeleteMembership,
    confirmDeleteMembership,
    cancelDeleteMembership,
    handleEditMembership,
    handleAddNew,
    handleRefresh,
    getFilteredMemberships,
    getTotalMemberships,
    getAveragePrice,
    getAverageDiscount,
    getHighestPrice,
  } = useMembershipsManager();

  // Estados locales para filtros y búsqueda
  const [sortBy, setSortBy] = useState('tier');
  const [searchTerm, setSearchTerm] = useState('');
  
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

  // Obtener membresías procesadas (filtradas y ordenadas)
  const processedMemberships = getFilteredMemberships(sortBy, searchTerm);

  // Calcular paginación con las membresías procesadas
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentMemberships = processedMemberships.slice(indexOfFirstItem, indexOfLastItem);
  const calculatedTotalPages = Math.ceil(processedMemberships.length / itemsPerPage);

  // Resetear página al cambiar filtros o items per page
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, sortBy, itemsPerPage]);

  // Mostrar notificaciones de error y éxito
  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  useEffect(() => {
    if (success) toast.success(success);
  }, [success]);

  // Función para preparar datos del formulario para el submit
  const handleFormSubmit = (formData) => {
    const membershipData = {
      _id: isEditing ? currentMembershipId : null,
      membershipTier: formData.membershipTier,
      price: formData.price,
      benefits: formData.benefits,
      discount: formData.discount
    };
    
    handleSubmit(membershipData);
  };

  return (
    <div className="memberships-page">
      <Header 
        title="Membresías" 
        onAddNew={handleAddNew} 
        onRefresh={handleRefresh}
        showSearch={false}
        onSearch={handleSearch}
        searchPlaceholder="Buscar por tier o beneficios..."
        sortOptions={[
          { label: 'Tier', value: 'tier' },
          { label: 'Precio (Menor a Mayor)', value: 'price-low' },
          { label: 'Precio (Mayor a Menor)', value: 'price-high' },
          { label: 'Descuento (Menor a Mayor)', value: 'discount-low' },
          { label: 'Descuento (Mayor a Menor)', value: 'discount-high' }
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

      {/* Estadísticas de membresías */}
      {!isLoading && (
        <div className="memberships-stats">
          <div className="stat-card">
            <div className="stat-label">Tipos de Membresía</div>
            <div className="stat-value">{getTotalMemberships()}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Precio Promedio</div>
            <div className="stat-value">${Math.round(getAveragePrice()).toLocaleString()}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Descuento Promedio</div>
            <div className="stat-value">{getAverageDiscount().toFixed(1)}%</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Precio Máximo</div>
            <div className="stat-value">${getHighestPrice().toLocaleString()}</div>
          </div>
        </div>
      )}

      <div className="memberships-content-scrollable">
        <div className="memberships-grid-container">
          <div className="memberships-grid">
            {currentMemberships.length > 0 ? (
              currentMemberships.map(membership => (
                <MembershipCard 
                  key={membership._id} 
                  data={membership}
                  onEdit={() => handleEditMembership(membership)}
                  onDelete={() => handleDeleteMembership(membership._id)}
                />
              ))
            ) : (
              !isLoading && (
                <div className="no-memberships">
                  {searchTerm ? (
                    <>
                      <p>No se encontraron membresías que coincidan con "{searchTerm}"</p>
                      <button onClick={() => setSearchTerm('')} className="btn btn-secondary">
                        Limpiar búsqueda
                      </button>
                    </>
                  ) : (
                    <>
                      <p>No hay membresías registradas, revisa tu conexión a internet o agrega una.</p>
                      
                    </>
                  )}
                </div>
              )
            )}
          </div>
        </div>
      </div>

      {/* Paginación - Solo mostrar si hay elementos */}
      {processedMemberships.length > 0 && (
        <Pagination 
          totalItems={processedMemberships.length}
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
        <MembershipEditModal 
          // Estados del formulario
          membershipTier={membershipTier}
          setMembershipTier={setMembershipTier}
          price={price}
          setPrice={setPrice}
          benefits={benefits}
          setBenefits={setBenefits}
          discount={discount}
          setDiscount={setDiscount}
          
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
          onClose={cancelDeleteMembership}
          onConfirm={confirmDeleteMembership}
          title="Eliminar Membresía"
          message="¿Estás seguro de que deseas eliminar esta membresía?"
          itemName={`${membershipToDelete?.membershipTier || 'Membresía'} - ${membershipToDelete?.price || '0'}`}
          isLoading={isLoading}
        />
      )}

      <Toaster position="top-right" />
    </div>
  );
};

export default MembershipsPage;