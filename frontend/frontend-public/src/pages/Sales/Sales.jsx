// Sales.jsx - Actualizado para usar el hook real
import React, { useEffect, useState } from 'react';
import { useSales } from '../../hooks/SalesHooks/useSales';
import SalesCard from '../../components/SalesCard/SalesCard';
import toast, { Toaster } from 'react-hot-toast'; 
import './Sales.css';


const SalesPage = () => {
  const {
    // Estados principales
    sales,
    currentSales,
    customers,
    employees,
    products,
    showModal,
    setShowModal,
    showDeleteModal,
    saleToDelete,
    isLoading,
    error,
    success,
    setError,
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
    fetchSales,
    handleSubmit,
    handleDeleteSale,
    confirmDeleteSale,
    cancelDeleteSale,
    handleEditSale,
    getCustomerInfo,
    getEmployeeInfo,
    getProductsInfo,
  } = useSales();

  // Estados locales para filtros y búsqueda
  const [sortBy, setSortBy] = useState('date-new');
  const [searchTerm, setSearchTerm] = useState('');
  




  // Mostrar notificaciones de error y éxito
  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  useEffect(() => {
    if (success) toast.success(success);
  }, [success]);

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



      {/* Mostrar indicador de carga */}
      {isLoading && (
        <div className="loading-indicator">
          <div className="spinner"></div>
          <span>Cargando...</span>
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

      <Toaster position="top-right" />
    </div>
  );
};

export default SalesPage;