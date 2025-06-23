// Customers.jsx - Actualizado para usar el hook real
import React, { useEffect, useState } from 'react';
import { useCustomersManager } from '../../hooks/CustomerHooks/useCustomer';
import Header from '../../components/Header/header';
import CustomerCard from '../../components/Cards/CustomerCard/CustomerCard';
import Pagination from '../../components/Pagination/Pagination';
import CustomerEditModal from '../../components/Modals/CustomerModals/CustomerEditModal';
import DeleteConfirmationModal from '../../components/Modals/DeleteConfirmationModal/DeleteConfirmationModal';
import toast, { Toaster } from 'react-hot-toast'; // <-- Agrega esto
import './Customers.css';

const CustomersPage = () => {
  const {
    // Estados principales
    customers,
    memberships,
    showModal,
    setShowModal,
    showDeleteModal,
    customerToDelete,
    isLoading,
    error,
    success,
    setError,
    isEditing,
    currentCustomerId,
    
    // Estados de paginación
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    totalPages,
    
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
    fetchCustomers,
    fetchMemberships,
    handleSubmit,
    handleDeleteCustomer,
    confirmDeleteCustomer,
    cancelDeleteCustomer,
    handleEditCustomer,
    handleAddNew,
    handleRefresh,
    getMembershipName,
    getFilteredCustomers,
  } = useCustomersManager();

  // Estados locales para filtros y búsqueda
  const [sortBy, setSortBy] = useState('name-asc');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Cargar clientes y membresías al montar el componente
  useEffect(() => {
    fetchCustomers();
    fetchMemberships(); // Cargar membresías para los nombres y dropdown
  }, []);

  // Debug: Monitor cuando cambien las membresías
  useEffect(() => {
    console.log('Memberships actualizadas:', memberships);
    console.log('Cantidad de membresías:', memberships?.length);
  }, [memberships]);

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

  // Obtener clientes procesados (filtrados y ordenados)
  const processedCustomers = getFilteredCustomers(sortBy, searchTerm);

  // Calcular paginación con los clientes procesados
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCustomers = processedCustomers.slice(indexOfFirstItem, indexOfLastItem);
  const calculatedTotalPages = Math.ceil(processedCustomers.length / itemsPerPage);

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
    const customerData = {
      _id: isEditing ? currentCustomerId : null,
      name: formData.name,
      email: formData.email,
      password: formData.password,
      phone: formData.phone,
      membershipId: formData.membershipId,
      startDate: formData.startDate
    };
    
    handleSubmit(customerData);
  };

  return (
    <div className="customers-page">
      <Header 
        title="Clientes" 
        onAddNew={handleAddNew} 
        onRefresh={handleRefresh}
        showSearch={false}
        onSearch={handleSearch}
        searchPlaceholder="Buscar clientes por nombre, email o teléfono..."
        sortOptions={[
          { label: 'Nombre (A-Z)', value: 'name-asc' },
          { label: 'Nombre (Z-A)', value: 'name-desc' },
          { label: 'Email (A-Z)', value: 'email-asc' },
          { label: 'Más recientes', value: 'newest' },
          { label: 'Más antiguos', value: 'oldest' }
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

      {/* Estadísticas de clientes */}
      {!isLoading && (
        <div className="customer-stats">
          <span className="customers-count">
            {searchTerm && ` (filtrados de ${customers.length} total)`}
          </span>
        </div>
      )}
      
      {/* Grid de clientes */}
      <div className="customer-grid">
        {currentCustomers.length > 0 ? (
          currentCustomers.map(customer => (
            <CustomerCard 
              key={customer._id} 
              data={customer}
              onEdit={() => handleEditCustomer(customer)}
              onDelete={() => handleDeleteCustomer(customer._id)}
              isLoading={isLoading}
              getMembershipName={getMembershipName}
            />
          ))
        ) : (
          !isLoading && (
            <div className="no-customers">
              {searchTerm ? (
                <>
                  <p>No se encontraron clientes que coincidan con "{searchTerm}"</p>
                  <button onClick={() => setSearchTerm('')} className="btn btn-secondary">
                    Limpiar búsqueda
                  </button>
                </>
              ) : (
                <>
                  <p>No hay clientes registrados, revisa tu conexión a internet o agrega uno.</p>
                  
                </>
              )}
            </div>
          )
        )}
      </div>
      
      {/* Paginación - Solo mostrar si hay elementos */}
      {processedCustomers.length > 0 && (
        <Pagination 
          totalItems={processedCustomers.length}
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
        <CustomerEditModal 
          // Estados del formulario
          name={name}
          setName={setName}
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          phone={phone}
          setPhone={setPhone}
          membershipId={membershipId}
          setMembershipId={setMembershipId}
          startDate={startDate}
          setStartDate={setStartDate}
          memberships={memberships}
          
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
          onClose={cancelDeleteCustomer}
          onConfirm={confirmDeleteCustomer}
          title="Eliminar Cliente"
          message="¿Estás seguro de que deseas eliminar este cliente?"
          itemName={customerToDelete?.name || ""}
          isLoading={isLoading}
        />
      )}

      <Toaster position="top-right" />
    </div>
  );
};

export default CustomersPage;