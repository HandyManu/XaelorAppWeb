// Employees.jsx - Actualizado para usar el hook real
import React, { useEffect, useState } from 'react';
import { useEmployeesManager } from '../../hooks/EmployeesHooks/useEmployees';
import Header from '../../components/Header/header';
import EmployeeCard from '../../components/Cards/EmployeeCard/EmployeeCard';
import Pagination from '../../components/Pagination/Pagination';
import EmployeeEditModal from '../../components/Modals/EmployeeModals/EmployeeEditModal';
import DeleteConfirmationModal from '../../components/Modals/DeleteConfirmationModal/DeleteConfirmationModal';
import './Employees.css';

const EmployeesPage = () => {
  const {
    // Estados principales
    employees,
    branches,
    showModal,
    setShowModal,
    showDeleteModal,
    employeeToDelete,
    isLoading,
    error,
    setError,
    success,
    isEditing,
    currentEmployeeId,
    
    // Estados de paginación
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    
    // Estados del formulario
    name,
    setName,
    email,
    setEmail,
    password,
    setPassword,
    phone,
    setPhone,
    branchId,
    setBranchId,
    position,
    setPosition,
    salary,
    setSalary,
    
    // Funciones
    loadInitialData,
    handleSubmit,
    handleDeleteEmployee,
    confirmDeleteEmployee,
    cancelDeleteEmployee,
    handleEditEmployee,
    handleAddNew,
    handleRefresh,
    getBranchInfo,
    getFilteredEmployees,
    getTotalEmployees,
    getTotalSalary,
    getAverageSalary,
  } = useEmployeesManager();

  // Estados locales para filtros y búsqueda
  const [sortBy, setSortBy] = useState('name');
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

  // Obtener empleados procesados (filtrados y ordenados)
  const processedEmployees = getFilteredEmployees(sortBy, searchTerm);

  // Calcular paginación con los empleados procesados
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentEmployees = processedEmployees.slice(indexOfFirstItem, indexOfLastItem);
  const calculatedTotalPages = Math.ceil(processedEmployees.length / itemsPerPage);

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
    const employeeData = {
      _id: isEditing ? currentEmployeeId : null,
      name: formData.name,
      email: formData.email,
      password: formData.password,
      phone: formData.phone,
      branchId: formData.branchId,
      position: formData.position,
      salary: formData.salary
    };
    
    handleSubmit(employeeData);
  };

  return (
    <div className="employees-page">
      <Header 
        title="Empleados" 
        onAddNew={handleAddNew} 
        onRefresh={handleRefresh}
        showSearch={false}
        onSearch={handleSearch}
        searchPlaceholder="Buscar por nombre, email, cargo o teléfono..."
        sortOptions={[
          { label: 'Nombre', value: 'name' },
          { label: 'Cargo', value: 'position' },
          { label: 'Salario (Menor a Mayor)', value: 'salary-low' },
          { label: 'Salario (Mayor a Menor)', value: 'salary-high' },
          { label: 'Sucursal', value: 'branch' }
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

      {/* Estadísticas de empleados */}
      {!isLoading && (
        <div className="employees-stats">
          <div className="stat-card">
            <div className="stat-label">Total Empleados</div>
            <div className="stat-value">{getTotalEmployees()}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Nómina Total</div>
            <div className="stat-value">${getTotalSalary().toLocaleString()}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Salario Promedio</div>
            <div className="stat-value">${Math.round(getAverageSalary()).toLocaleString()}</div>
          </div>
        </div>
      )}

      <div className="employees-content-scrollable">
        <div className="employees-grid-container">
          <div className="employees-grid">
            {currentEmployees.length > 0 ? (
              currentEmployees.map(employee => (
                <EmployeeCard 
                  key={employee._id} 
                  data={employee}
                  branchInfo={getBranchInfo(employee.branchId)}
                  onEdit={() => handleEditEmployee(employee)}
                  onDelete={() => handleDeleteEmployee(employee._id)}
                />
              ))
            ) : (
              !isLoading && (
                <div className="no-employees">
                  {searchTerm ? (
                    <>
                      <p>No se encontraron empleados que coincidan con "{searchTerm}"</p>
                      <button onClick={() => setSearchTerm('')} className="btn btn-secondary">
                        Limpiar búsqueda
                      </button>
                    </>
                  ) : (
                    <>
                      <p>No hay empleados registrados, revisa tu conexión a internet o agrega uno.</p>
                     
                    </>
                  )}
                </div>
              )
            )}
          </div>
        </div>
      </div>

      {/* Paginación - Solo mostrar si hay elementos */}
      {processedEmployees.length > 0 && (
        <Pagination 
          totalItems={processedEmployees.length}
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
        <EmployeeEditModal 
          // Estados del formulario
          name={name}
          setName={setName}
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          phone={phone}
          setPhone={setPhone}
          branchId={branchId}
          setBranchId={setBranchId}
          position={position}
          setPosition={setPosition}
          salary={salary}
          setSalary={setSalary}
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
          onClose={cancelDeleteEmployee}
          onConfirm={confirmDeleteEmployee}
          title="Eliminar Empleado"
          message="¿Estás seguro de que deseas eliminar este empleado?"
          itemName={`${employeeToDelete?.name || 'Empleado'} - ${employeeToDelete?.position || 'Cargo'}`}
          isLoading={isLoading}
        />
      )}
    </div>
  );
};

export default EmployeesPage;