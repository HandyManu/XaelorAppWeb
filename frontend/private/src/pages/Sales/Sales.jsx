// Sales.jsx - Actualizado para usar el hook real
import React, { useEffect, useState } from 'react';
import { useSalesManager } from '../../hooks/SalesHooks/useSales';
import Header from '../../components/Header/header';
import SalesCard from '../../components/Cards/SalesCard/SalesCard';
import Pagination from '../../components/Pagination/Pagination';
import SalesEditModal from '../../components/Modals/SalesModals/SalesEditModal';
import DeleteConfirmationModal from '../../components/Modals/DeleteConfirmationModal/DeleteConfirmationModal';
import './Sales.css';

const SalesPage = () => {
  const {
    // Estados principales
    sales,
    customers,
    employees,
    products,
    showModal,
    setShowModal,
    showDeleteModal,
    saleToDelete,
    isLoading,
    error,
    setError,
    success,
    isEditing,
    currentSaleId,
    
    // Estados de paginación
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    
    // Estados del formulario
    customerId,
    setCustomerId,
    employeeId,
    setEmployeeId,
    address,
    setAddress,
    reference,
    setReference,
    status,
    setStatus,
    selectedPaymentMethod,
    setSelectedPaymentMethod,
    selectedProducts,
    setSelectedProducts,
    total,
    setTotal,
    
    // Funciones
    loadInitialData,
    fetchSales,
    handleSubmit,
    handleDeleteSale,
    confirmDeleteSale,
    cancelDeleteSale,
    handleEditSale,
    handleAddNew,
    handleRefresh,
    getCustomerInfo,
    getEmployeeInfo,
    getProductsInfo,
    getFilteredSales,
    getTotalSales,
    getTotalRevenue,
    getAverageTicket,
    getSalesByStatus,
  } = useSalesManager();

  // Estados locales para filtros y búsqueda
  const [sortBy, setSortBy] = useState('date-new');
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

  // Obtener ventas procesadas (filtradas y ordenadas)
  const processedSales = getFilteredSales(sortBy, searchTerm);

  // Calcular paginación con las ventas procesadas
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentSales = processedSales.slice(indexOfFirstItem, indexOfLastItem);
  const calculatedTotalPages = Math.ceil(processedSales.length / itemsPerPage);

  // Resetear página al cambiar filtros o items per page
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, sortBy, itemsPerPage]);

  // Función para cerrar mensajes de error
  const handleCloseError = () => {
    setError('');
  };

  // Función para preparar datos del formulario para el submit
  const handleFormSubmit = (formData) => {
    const saleData = {
      _id: isEditing ? currentSaleId : null,
      customerId: formData.customerId,
      employeeId: formData.employeeId,
      address: formData.address,
      reference: formData.reference,
      status: formData.status,
      selectedPaymentMethod: formData.selectedPaymentMethod,
      selectedProducts: formData.selectedProducts,
      total: formData.total
    };
    
    handleSubmit(saleData);
  };

  return (
    <div className="sales-page">
      <Header 
        title="Ventas" 
        onAddNew={handleAddNew} 
        onRefresh={handleRefresh}
        showSearch={true}
        onSearch={handleSearch}
        searchPlaceholder="Buscar por cliente, empleado, ID de venta..."
        sortOptions={[
          { label: 'Fecha (Más reciente)', value: 'date-new' },
          { label: 'Fecha (Más antigua)', value: 'date-old' },
          { label: 'Monto (Mayor a Menor)', value: 'amount-high' },
          { label: 'Monto (Menor a Mayor)', value: 'amount-low' },
          { label: 'Estado', value: 'status' },
          { label: 'Cliente', value: 'customer' }
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

      {/* Estadísticas de ventas */}
      {!isLoading && (
        <div className="sales-stats">
          <div className="stat-card">
            <div className="stat-label">Total Ventas</div>
            <div className="stat-value">{getTotalSales()}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Ingresos Totales</div>
            <div className="stat-value">${getTotalRevenue().toLocaleString()}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Ticket Promedio</div>
            <div className="stat-value">${Math.round(getAverageTicket()).toLocaleString()}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">En Proceso</div>
            <div className="stat-value">{getSalesByStatus('Processing')}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Enviadas</div>
            <div className="stat-value">{getSalesByStatus('Shipped')}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Entregadas</div>
            <div className="stat-value">{getSalesByStatus('Delivered')}</div>
          </div>
        </div>
      )}
      
      <div className="sales-content-scrollable">
        <div className="sales-grid-container">
          <div className="sales-grid">
            {currentSales.length > 0 ? (
              currentSales.map(sale => (
                  <SalesCard 
                    key={sale._id} 
                    data={sale}
                    customerInfo={getCustomerInfo(sale.customerId)}
                    employeeInfo={getEmployeeInfo(sale.employeeId)}
                    productsInfo={getProductsInfo()}
                    onEdit={() => handleEditSale(sale)}
                    onDelete={() => handleDeleteSale(sale._id)}
                    isLoading={isLoading}
                  />
              ))
            ) : (
              !isLoading && (
                <div className="no-sales">
                  {searchTerm ? (
                    <>
                      <p>No se encontraron ventas que coincidan con los filtros aplicados</p>
                      <button onClick={() => setSearchTerm('')} className="btn btn-secondary">
                        Limpiar filtros
                      </button>
                    </>
                  ) : (
                    <>
                      <p>No hay ventas registradas, revisa tu conexión a internet o agrega una.</p>
                    </>
                  )}
                </div>
              )
            )}
          </div>
        </div>
      </div>
      
      {/* Paginación - Solo mostrar si hay elementos */}
      {processedSales.length > 0 && (
        <Pagination 
          totalItems={processedSales.length}
          itemsPerPage={itemsPerPage}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={setItemsPerPage}
          totalPages={calculatedTotalPages}
          showItemsPerPage={true}
          itemsPerPageOptions={[6, 9, 12, 18]}
        />
      )}
      
      {/* Modal de edición/creación */}
      {showModal && (
        <SalesEditModal 
          // Estados del formulario
          customerId={customerId}
          setCustomerId={setCustomerId}
          employeeId={employeeId}
          setEmployeeId={setEmployeeId}
          address={address}
          setAddress={setAddress}
          reference={reference}
          setReference={setReference}
          status={status}
          setStatus={setStatus}
          selectedPaymentMethod={selectedPaymentMethod}
          setSelectedPaymentMethod={setSelectedPaymentMethod}
          selectedProducts={selectedProducts}
          setSelectedProducts={setSelectedProducts}
          total={total}
          setTotal={setTotal}
          customers={customers}
          employees={employees}
          products={products}
          
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
          onClose={cancelDeleteSale}
          onConfirm={confirmDeleteSale}
          title="Eliminar Venta"
          message="¿Estás seguro de que deseas eliminar esta venta?"
          itemName={`Venta #${saleToDelete?._id?.slice(-6) || '000000'} - ${getCustomerInfo(saleToDelete?.customerId)?.name || 'Cliente'}`}
          isLoading={isLoading}
        />
      )}
    </div>
  );
};

export default SalesPage;