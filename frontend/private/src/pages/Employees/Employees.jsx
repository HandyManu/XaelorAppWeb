// Employees.jsx
import React, { useState, useEffect } from 'react';
import Header from '../../components/Header/header';
import EmployeeCard from '../../components/Cards/EmployeeCard/EmployeeCard';
import Pagination from '../../components/Pagination/Pagination';
import EmployeeEditModal from '../../components/Modals/EmployeeModals/EmployeeEditModal';
import './Employees.css';

const EmployeesPage = () => {
  const [employees, setEmployees] = useState([]);
  const [branches, setBranches] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sortBy, setSortBy] = useState('');
  
  // Simulated data fetch
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Datos simulados de empleados
        const mockEmployeeData = [
          {
            "_id": "67acd0e50a6d1c53a6669ec0",
            "name": "Alejandro Gómez",
            "email": "agomez@xaelor.com",
            "password": "hashed_password",
            "phone": "5555-1234",
            "branchId": { "$oid": "67ab842f0dcf66e92c78842a" },
            "position": "Gerente de ventas",
            "salary": 3200
          },
          {
            "_id": "67acd0e50a6d1c53a6669ec1",
            "name": "Gabriela Méndez",
            "email": "gmendez@xaelor.com",
            "password": "hashed_password",
            "phone": "5555-5678",
            "branchId": { "$oid": "67ab842f0dcf66e92c78842b" },
            "position": "Coordinadora de operaciones",
            "salary": 2800
          },
          {
            "_id": "67acd0e50a6d1c53a6669ec2",
            "name": "Jorge Ramírez",
            "email": "jramirez@xaelor.com",
            "password": "hashed_password",
            "phone": "5555-9101",
            "branchId": { "$oid": "67ab842f0dcf66e92c78842c" },
            "position": "Analista financiero",
            "salary": 3500
          },
          {
            "_id": "67acd0e50a6d1c53a6669ec3",
            "name": "Mariana Estrada",
            "email": "mestrada@xaelor.com",
            "password": "hashed_password",
            "phone": "5555-1122",
            "branchId": { "$oid": "67ab842f0dcf66e92c78842d" },
            "position": "Supervisora de atención al cliente",
            "salary": 2700
          },
          {
            "_id": "67acd0e50a6d1c53a6669ec4",
            "name": "Eduardo Salazar",
            "email": "esalazar@xaelor.com",
            "password": "hashed_password",
            "phone": "5555-3344",
            "branchId": { "$oid": "67ab842f0dcf66e92c78842e" },
            "position": "Director de sucursal",
            "salary": 4500
          },
          {
            "_id": "67acd0e50a6d1c53a6669ec5",
            "name": "Lucía Fernández",
            "email": "lfernandez@xaelor.com",
            "password": "hashed_password",
            "phone": "5555-5566",
            "branchId": { "$oid": "67ab842f0dcf66e92c78842f" },
            "position": "Especialista en recursos humanos",
            "salary": 3100
          },
          {
            "_id": "67acd0e50a6d1c53a6669ec6",
            "name": "Daniel Rojas",
            "email": "drojas@xaelor.com",
            "password": "hashed_password",
            "phone": "5555-7788",
            "branchId": { "$oid": "67ab842f0dcf66e92c788430" },
            "position": "Coordinador de logística",
            "salary": 2900
          },
          {
            "_id": "67acd0e50a6d1c53a6669ec7",
            "name": "Paula Navarro",
            "email": "pnavarro@xaelor.com",
            "password": "hashed_password",
            "phone": "5555-9900",
            "branchId": { "$oid": "67ab842f0dcf66e92c788431" },
            "position": "Jefa de administración",
            "salary": 4000
          },
          {
            "_id": "67acd0e50a6d1c53a6669ec8",
            "name": "Fernando Ortega",
            "email": "fortega@xaelor.com",
            "password": "hashed_password",
            "phone": "5555-2233",
            "branchId": { "$oid": "67ab842f0dcf66e92c788432" },
            "position": "Ejecutivo de cuentas",
            "salary": 2600
          },
          {
            "_id": "67acd0e50a6d1c53a6669ec9",
            "name": "Silvia Castillo",
            "email": "scastillo@xaelor.com",
            "password": "hashed_password",
            "phone": "5555-4455",
            "branchId": { "$oid": "67ab842f0dcf66e92c788433" },
            "position": "Gerente de proyectos",
            "salary": 4200
          }
        ];
        
        // Datos simulados de sucursales
        const mockBranchData = [
          {
            "_id": { "$oid": "67ab842f0dcf66e92c78842a" },
            "address": "Av. América #142",
            "city": "San Salvador",
            "country": "El Salvador"
          },
          {
            "_id": { "$oid": "67ab842f0dcf66e92c78842b" },
            "address": "Centro Comercial Plaza Merliot",
            "city": "Santa Tecla",
            "country": "El Salvador"
          }
        ];
        
        setEmployees(mockEmployeeData);
        setBranches(mockBranchData);
      } catch (error) {
        console.error('Error fetching employees:', error);
      }
    };
    
    fetchData();
  }, []);
  
  // Función para añadir un nuevo empleado
  const handleAddNew = () => {
    setSelectedEmployee(null);
    setIsModalOpen(true);
  };
  
  // Función para refrescar los datos
  const handleRefresh = () => {
    console.log('Refreshing employees data...');
  };
  
  // Función para editar un empleado
  const handleEditEmployee = (employee) => {
    setSelectedEmployee(employee);
    setIsModalOpen(true);
  };
  
  // Función para eliminar un empleado
  const handleDeleteEmployee = (employeeId) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este empleado?')) {
      console.log(`Deleting employee ${employeeId}`);
      setEmployees(employees.filter(e => e._id !== employeeId));
    }
  };
  
  // Función para guardar cambios de empleado
  const handleSaveEmployee = (updatedEmployee) => {
    if (updatedEmployee._id) {
      // Actualizar empleado existente
      setEmployees(employees.map(e => 
        e._id === updatedEmployee._id ? updatedEmployee : e
      ));
    } else {
      // Añadir nuevo empleado con un ID temporal
      const newEmployee = {
        ...updatedEmployee,
        _id: Date.now().toString()
      };
      setEmployees([...employees, newEmployee]);
    }
    
    setIsModalOpen(false);
  };
  
  // Función para obtener información de la sucursal por ID
  const getBranchInfo = (branchId) => {
    if (!branchId) return null;
    const branchIdString = branchId.$oid || branchId;
    return branches.find(b => (b._id.$oid || b._id) === branchIdString);
  };
  
  // Función para obtener empleados procesados/ordenados
  const getProcessedEmployees = () => {
    let processedEmployees = [...employees];
    
    switch (sortBy) {
      case 'name':
        processedEmployees.sort((a, b) => 
          a.name.localeCompare(b.name)
        );
        break;
      case 'position':
        processedEmployees.sort((a, b) => 
          a.position.localeCompare(b.position)
        );
        break;
      case 'salary-low':
        processedEmployees.sort((a, b) => a.salary - b.salary);
        break;
      case 'salary-high':
        processedEmployees.sort((a, b) => b.salary - a.salary);
        break;
      case 'branch':
        processedEmployees.sort((a, b) => {
          const branchA = getBranchInfo(a.branchId);
          const branchB = getBranchInfo(b.branchId);
          return (branchA?.address || '').localeCompare(branchB?.address || '');
        });
        break;
      default:
        // Por defecto, ordenar por nombre
        processedEmployees.sort((a, b) => 
          a.name.localeCompare(b.name)
        );
    }
    
    return processedEmployees;
  };
  
  const processedEmployees = getProcessedEmployees();
  
  // Obtener empleados para la página current
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentEmployees = processedEmployees.slice(indexOfFirstItem, indexOfLastItem);
  
  // Calcular estadísticas de empleados
  const getTotalEmployees = () => employees.length;
  
  const getTotalSalary = () => {
    return employees.reduce((total, emp) => total + emp.salary, 0);
  };
  
  const getAverageSalary = () => {
    if (employees.length === 0) return 0;
    return getTotalSalary() / employees.length;
  };
  
  return (
    <div className="employees-page">
      <Header 
        title="Empleados" 
        onAddNew={handleAddNew} 
        onRefresh={handleRefresh}
        sortOptions={[
          { label: 'Nombre', value: 'name' },
          { label: 'Cargo', value: 'position' },
          { label: 'Salario (Menor a Mayor)', value: 'salary-low' },
          { label: 'Salario (Mayor a Menor)', value: 'salary-high' },
          { label: 'Sucursal', value: 'branch' }
        ]}
        onSort={setSortBy}
        showSearch={true}
      />

      <div className="employees-content-scrollable">
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
        <div className="employees-grid-container">
          <div className="employees-grid">
            {currentEmployees.length > 0 ? (
              currentEmployees.map(employee => (
                <EmployeeCard 
                  key={employee._id} 
                  data={employee}
                  branchInfo={getBranchInfo(employee.branchId)}
                  onEdit={handleEditEmployee}
                  onDelete={handleDeleteEmployee}
                />
              ))
            ) : (
              <div className="no-employees">
                <p>No se encontraron empleados</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <Pagination 
        totalItems={processedEmployees.length}
        itemsPerPage={itemsPerPage}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        onItemsPerPageChange={setItemsPerPage}
      />

      {isModalOpen && (
        <EmployeeEditModal 
          employee={selectedEmployee}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveEmployee}
          branches={branches}
        />
      )}
    </div>
  );
};

export default EmployeesPage;