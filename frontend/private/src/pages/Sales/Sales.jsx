// Sales.jsx
import React, { useState, useEffect } from 'react';
import Header from '../../components/Header/header';
import SalesCard from '../../components/Cards/SalesCard/SalesCard';
import Pagination from '../../components/Pagination/Pagination';
import SalesEditModal from '../../components/Modals/SalesModals/SalesEditModal';
import './Sales.css';

const SalesPage = () => {
  const [sales, setSales] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(9);
  const [selectedSale, setSelectedSale] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sortBy, setSortBy] = useState('');
  
  // Simulated data fetch
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Datos simulados de ventas
        const mockSalesData = [
          {
            "_id": "67acd45e3bd247ca51cec559",
            "customerId": { "$oid": "67ab85c1222df07400b382bb" },
            "employeeId": { "$oid": "67acd0e50a6d1c53a6669ec1" },
            "address": "Fake Street 456, San Salvador",
            "reference": "Home delivery",
            "status": "Shipped",
            "selectedPaymentMethod": "Credit Card",
            "total": 19100,
            "selectedProducts": [
              {
                "watchId": { "$oid": "67ab8499398487f1caccc64f" },
                "quantity": 2,
                "subtotal": 8500
              },
              {
                "watchId": { "$oid": "67ab853f398487f1caccc650" },
                "quantity": 1,
                "subtotal": 2100
              }
            ],
            "createdAt": { "$date": "2024-12-15T10:30:00.000Z" }
          },
          {
            "_id": "67acd45e3bd247ca51cec55d",
            "customerId": { "$oid": "67ab82e5222df07400b382b5" },
            "employeeId": { "$oid": "67acd0e50a6d1c53a6669ec5" },
            "address": "Sunset Blvd 321, Los Angeles",
            "reference": "Home delivery",
            "status": "Shipped",
            "selectedPaymentMethod": "Credit Card",
            "total": 6300,
            "selectedProducts": [
              {
                "watchId": { "$oid": "67ab853f398487f1caccc650" },
                "quantity": 1,
                "subtotal": 2100
              },
              {
                "watchId": { "$oid": "67ab8499398487f1caccc64f" },
                "quantity": 2,
                "subtotal": 8500
              }
            ],
            "createdAt": { "$date": "2024-12-14T15:45:00.000Z" }
          },
          {
            "_id": "67acd45e3bd247ca51cec55e",
            "customerId": { "$oid": "67ab82e5222df07400b382b6" },
            "employeeId": { "$oid": "67acd0e50a6d1c53a6669ec6" },
            "address": "Avenida Reforma 555, CDMX",
            "reference": "Pickup at store",
            "status": "Delivered",
            "selectedPaymentMethod": "PayPal",
            "total": 25500,
            "selectedProducts": [
              {
                "watchId": { "$oid": "67ab8499398487f1caccc64f" },
                "quantity": 2,
                "subtotal": 8500
              },
              {
                "watchId": { "$oid": "67ab853f398487f1caccc650" },
                "quantity": 1,
                "subtotal": 2100
              }
            ],
            "createdAt": { "$date": "2024-12-13T09:20:00.000Z" }
          }
        ];
        
        // Datos simulados de clientes
        const mockCustomerData = [
          {
            "_id": "67ab85c1222df07400b382bb",
            "name": "Manuel Rockefeller",
            "email": "20220416@ricaldone.edu.sv"
          },
          {
            "_id": "67ab82e5222df07400b382b5",
            "name": "William Fairfax",
            "email": "william.fairfax@gmail.com"
          },
          {
            "_id": "67ab82e5222df07400b382b6",
            "name": "Penelope Windsor",
            "email": "penelope.windsor@gmail.com"
          }
        ];
        
        // Datos simulados de empleados
        const mockEmployeeData = [
          {
            "_id": "67acd0e50a6d1c53a6669ec1",
            "name": "Gabriela Méndez",
            "position": "Coordinadora de operaciones"
          },
          {
            "_id": "67acd0e50a6d1c53a6669ec5",
            "name": "Lucía Fernández",
            "position": "Especialista en recursos humanos"
          },
          {
            "_id": "67acd0e50a6d1c53a6669ec6",
            "name": "Daniel Rojas",
            "position": "Coordinador de logística"
          }
        ];
        
        // Datos simulados de productos
        const mockProductData = [
          {
            "_id": "67ab8499398487f1caccc64f",
            "model": "Xælör noir deluxe",
            "price": 8500
          },
          {
            "_id": "67ab853f398487f1caccc650",
            "model": "Xælör Classic",
            "price": 2100
          },
          {
            "_id": "67ab844d398487f1caccc64e",
            "model": "Xælör Submariner",
            "price": 4200
          }
        ];
        
        setSales(mockSalesData);
        setCustomers(mockCustomerData);
        setEmployees(mockEmployeeData);
        setProducts(mockProductData);
      } catch (error) {
        console.error('Error fetching sales:', error);
      }
    };
    
    fetchData();
  }, []);
  
  // Función para añadir una nueva venta
  const handleAddNew = () => {
    setSelectedSale(null);
    setIsModalOpen(true);
  };
  
  // Función para refrescar los datos
  const handleRefresh = () => {
    console.log('Refreshing sales data...');
  };
  
  // Función para editar una venta
  const handleEditSale = (sale) => {
    setSelectedSale(sale);
    setIsModalOpen(true);
  };
  
  // Función para eliminar una venta
  const handleDeleteSale = (saleId) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta venta?')) {
      console.log(`Deleting sale ${saleId}`);
      setSales(sales.filter(s => s._id !== saleId));
    }
  };
  
  // Función para guardar cambios de venta
  const handleSaveSale = (updatedSale) => {
    if (updatedSale._id) {
      // Actualizar venta existente
      setSales(sales.map(s => 
        s._id === updatedSale._id ? updatedSale : s
      ));
    } else {
      // Añadir nueva venta con un ID temporal
      const newSale = {
        ...updatedSale,
        _id: Date.now().toString(),
        createdAt: { $date: new Date().toISOString() }
      };
      setSales([...sales, newSale]);
    }
    
    setIsModalOpen(false);
  };
  
  // Función para obtener información del cliente
  const getCustomerInfo = (customerId) => {
    const id = customerId?.$oid || customerId;
    return customers.find(c => c._id === id);
  };
  
  // Función para obtener información del empleado
  const getEmployeeInfo = (employeeId) => {
    const id = employeeId?.$oid || employeeId;
    return employees.find(e => e._id === id);
  };
  
  // Función para obtener información de productos
  const getProductsInfo = () => products;
  
  // Función para obtener ventas procesadas/ordenadas
  const getProcessedSales = () => {
    let processedSales = [...sales];
    
    switch (sortBy) {
      case 'date-new':
        processedSales.sort((a, b) => 
          new Date(b.createdAt?.$date) - new Date(a.createdAt?.$date)
        );
        break;
      case 'date-old':
        processedSales.sort((a, b) => 
          new Date(a.createdAt?.$date) - new Date(b.createdAt?.$date)
        );
        break;
      case 'amount-high':
        processedSales.sort((a, b) => b.total - a.total);
        break;
      case 'amount-low':
        processedSales.sort((a, b) => a.total - b.total);
        break;
      case 'status':
        processedSales.sort((a, b) => a.status.localeCompare(b.status));
        break;
      default:
        // Por defecto, ordenar por fecha más reciente
        processedSales.sort((a, b) => 
          new Date(b.createdAt?.$date) - new Date(a.createdAt?.$date)
        );
    }
    
    return processedSales;
  };
  
  const processedSales = getProcessedSales();
  
  // Obtener ventas para la página actual
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentSales = processedSales.slice(indexOfFirstItem, indexOfLastItem);
  
  // Calcular estadísticas
  const getTotalSales = () => sales.length;
  
  const getTotalRevenue = () => {
    return sales.reduce((total, sale) => total + sale.total, 0);
  };
  
  const getAverageTicket = () => {
    if (sales.length === 0) return 0;
    return getTotalRevenue() / sales.length;
  };
  
  const getSalesByStatus = (status) => {
    return sales.filter(s => s.status === status).length;
  };
  
  return (
    <div className="sales-page">
      <Header 
        title="Ventas" 
        onAddNew={handleAddNew} 
        onRefresh={handleRefresh}
        sortOptions={[
          { label: 'Fecha (Más reciente)', value: 'date-new' },
          { label: 'Fecha (Más antigua)', value: 'date-old' },
          { label: 'Monto (Mayor a Menor)', value: 'amount-high' },
          { label: 'Monto (Menor a Mayor)', value: 'amount-low' },
          { label: 'Estado', value: 'status' }
        ]}
        onSort={setSortBy}
        showSearch={false}
      />
      
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
                onEdit={handleEditSale}
                onDelete={handleDeleteSale}
              />
            ))
          ) : (
            <div className="no-sales">
              <p>No se encontraron ventas</p>
            </div>
          )}
        </div>
      </div>
      
      <Pagination 
        totalItems={processedSales.length}
        itemsPerPage={itemsPerPage}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        onItemsPerPageChange={setItemsPerPage}
      />
      
      {isModalOpen && (
        <SalesEditModal 
          sale={selectedSale}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveSale}
          customers={customers}
          employees={employees}
          products={products}
        />
      )}
    </div>
  );
};

export default SalesPage;