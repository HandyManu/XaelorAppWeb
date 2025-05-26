// Customers.jsx
// Página principal para la gestión de clientes
import React, { useState, useEffect } from 'react';
import Header from '../../components/Header/header';
import CustomerCard from '../../components/Cards/CustomerCard/CustomerCard';
import Pagination from '../../components/Pagination/Pagination';
import CustomerEditModal from '../../components/Modals/CustomerModals/CustomerEditModal';
import './Customers.css';

const CustomersPage = () => {
  const [customers, setCustomers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sortBy, setSortBy] = useState(''); // Para manejar el ordenamiento/filtrado
  
  // Simulated data fetch
  useEffect(() => {
    // En una aplicación real, aquí harías una llamada a tu API
    const fetchData = async () => {
      try {
        // Para esta demo, simulamos la obtención de datos con el JSON proporcionado
        const mockData = [
          {
            "_id": "67ab82e5222df07400b382b2",
            "name": "Isabella Montgomery",
            "email": "isabella.montgomery@gmail.com",
            "password": "SuperSecurePassword123",
            "phone": "5555-1234",
            "membership": {
              "membershipId": {
                "$oid": "67acd69ae1fa12d45243dc76"
              },
              "startDate": {
                "$date": "2024-09-11T00:00:00.000Z"
              }
            }
          },
          {
            "_id": "67ab82e5222df07400b382b3",
            "name": "Alexander Harrington",
            "email": "alexander.harrington@gmail.com",
            "password": "HarringtonLuxury99",
            "phone": "5555-5678",
            "membership": {
              "membershipId": {
                "$oid": "67acd69ae1fa12d45243dc76"
              },
              "startDate": {
                "$date": "2024-09-11T00:00:00.000Z"
              }
            }
          },
          {
            "_id": "67ab82e5222df07400b382b4",
            "name": "Charlotte Beaumont",
            "email": "charlotte.beaumont@gmail.com",
            "password": "Beaumont$Luxury@21",
            "phone": "5555-8765",
            "membership": {
              "membershipId": {
                "$oid": "67acd69ae1fa12d45243dc76"
              },
              "startDate": {
                "$date": "2024-09-11T00:00:00.000Z"
              }
            }
          },
          {
            "_id": "67ab82e5222df07400b382b5",
            "name": "William Fairfax",
            "email": "william.fairfax@gmail.com",
            "password": "Fairfax123$Gold",
            "phone": "5555-4321",
            "membership": {
              "membershipId": {
                "$oid": "67acd69ae1fa12d45243dc77"
              },
              "startDate": {
                "$date": "2024-09-11T00:00:00.000Z"
              }
            }
          },
          {
            "_id": "67ab82e5222df07400b382b6",
            "name": "Penelope Windsor",
            "email": "penelope.windsor@gmail.com",
            "password": "WindsorQueen2024",
            "phone": "5555-1122",
            "membership": {
              "membershipId": {
                "$oid": "67acd69ae1fa12d45243dc77"
              },
              "startDate": {
                "$date": "2024-09-11T00:00:00.000Z"
              }
            }
          },
          {
            "_id": "67ab82e5222df07400b382b7",
            "name": "Sebastian Rockwell",
            "email": "sebastian.rockwell@gmail.com",
            "password": "Rockwell$Rich@2025",
            "phone": "5555-9988",
            "membership": {
              "membershipId": {
                "$oid": "67acd69ae1fa12d45243dc77"
              },
              "startDate": {
                "$date": "2024-09-11T00:00:00.000Z"
              }
            }
          },
          {
            "_id": "67ab82e5222df07400b382b8",
            "name": "Vivienne Carrington",
            "email": "vivienne.carrington@gmail.com",
            "password": "CarringtonElite23",
            "phone": "5555-3344",
            "membership": {
              "membershipId": {
                "$oid": "67acd69ae1fa12d45243dc78"
              },
              "startDate": {
                "$date": "2024-09-11T00:00:00.000Z"
              }
            }
          },
          {
            "_id": "67ab82e5222df07400b382b9",
            "name": "Liam Kensington",
            "email": "liam.kensington@gmail.com",
            "password": "Kensington$2024",
            "phone": "5555-7788",
            "membership": {
              "membershipId": {
                "$oid": "67acd69ae1fa12d45243dc78"
              },
              "startDate": {
                "$date": "2024-09-11T00:00:00.000Z"
              }
            }
          },
          {
            "_id": "67ab82e5222df07400b382ba",
            "name": "Eleanor Rothschild",
            "email": "eleanor.rothschild@gmail.com",
            "password": "RothschildWealth2024",
            "phone": "5555-2233",
            "membership": {
              "membershipId": {
                "$oid": "67acd69ae1fa12d45243dc78"
              },
              "startDate": {
                "$date": "2024-09-11T00:00:00.000Z"
              }
            }
          },
          {
            "_id": "67ab85c1222df07400b382bb",
            "name": "Manuel Rockefeller",
            "email": "20220416@ricaldone.edu.sv",
            "password": "sajsjsjds123456",
            "phone": "4578-5645",
            "membership": {
              "membershipId": {
                "$oid": "67acd69ae1fa12d45243dc78"
              },
              "startDate": {
                "$date": "2024-09-11T00:00:00.000Z"
              }
            }
          }
        ];
        
        setCustomers(mockData);
      } catch (error) {
        console.error('Error fetching customers:', error);
      }
    };
    
    fetchData();
  }, []);
  
  // Función para añadir un nuevo cliente
  const handleAddNew = () => {
    setSelectedCustomer(null); // Crear nuevo cliente
    setIsModalOpen(true);
  };
  
  // Función para refrescar los datos
  const handleRefresh = () => {
    // En una aplicación real, aquí recargarías los datos
    console.log('Refreshing customers data...');
  };
  
  // Función para editar un cliente
  const handleEditCustomer = (customer) => {
    setSelectedCustomer(customer);
    setIsModalOpen(true);
  };
  
  // Función para eliminar un cliente
  const handleDeleteCustomer = (customerId) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este cliente?')) {
      // En una aplicación real, aquí harías una llamada a tu API para eliminar
      console.log(`Deleting customer ${customerId}`);
      setCustomers(customers.filter(c => c._id !== customerId));
    }
  };
  
  // Función para guardar cambios de un cliente
  const handleSaveCustomer = (updatedCustomer) => {
    // En una aplicación real, aquí harías una llamada a tu API para actualizar
    if (updatedCustomer._id) {
      // Actualizar cliente existente
      setCustomers(customers.map(c => 
        c._id === updatedCustomer._id ? updatedCustomer : c
      ));
    } else {
      // Añadir nuevo cliente con un ID temporal
      const newCustomer = {
        ...updatedCustomer,
        _id: Date.now().toString() // ID temporal
      };
      setCustomers([...customers, newCustomer]);
    }
    
    setIsModalOpen(false);
  };
  
  // Función para obtener clientes ordenados/filtrados
  const getProcessedCustomers = () => {
    let processedCustomers = [...customers];
    
    // Filtrar por tipo de membresía o aplicar ordenamiento
    switch (sortBy) {
      case 'bronze':
        processedCustomers = processedCustomers.filter(c => 
          c.membership?.membershipId?.$oid === '67acd69ae1fa12d45243dc76'
        );
        break;
      case 'silver':
        processedCustomers = processedCustomers.filter(c => 
          c.membership?.membershipId?.$oid === '67acd69ae1fa12d45243dc77'
        );
        break;
      case 'gold':
        processedCustomers = processedCustomers.filter(c => 
          c.membership?.membershipId?.$oid === '67acd69ae1fa12d45243dc78'
        );
        break;
      case 'nombre':
        processedCustomers.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'fecha':
        processedCustomers.sort((a, b) => 
          new Date(b.membership?.startDate?.$date) - new Date(a.membership?.startDate?.$date)
        );
        break;
      default:
        // Por defecto, ordenar por nombre
        processedCustomers.sort((a, b) => a.name.localeCompare(b.name));
    }
    
    return processedCustomers;
  };
  
  const processedCustomers = getProcessedCustomers();
  
  // Obtener clientes para la página actual
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCustomers = processedCustomers.slice(indexOfFirstItem, indexOfLastItem);
  
  return (
    <div className="customers-page">
      <Header 
        title="Clientes" 
        onAddNew={handleAddNew} 
        onRefresh={handleRefresh}
        // Pasamos opciones personalizadas para el dropdown
        sortOptions={[
          { label: 'Nombre', value: 'nombre' },
          { label: 'Fecha de registro', value: 'fecha' },
          { label: 'Membresía Bronze', value: 'bronze' },
          { label: 'Membresía Silver', value: 'silver' },
          { label: 'Membresía Gold', value: 'gold' }
        ]}
        onSort={setSortBy}
        showSearch={true} 
      />
      
      <div className="customer-stats">
        <span className="customers-count">
          {processedCustomers.length} {processedCustomers.length === 1 ? 'cliente' : 'clientes'}
        </span>
      </div>
      
      <div className="customer-grid">
        {currentCustomers.length > 0 ? (
          currentCustomers.map(customer => (
            <CustomerCard 
              key={customer._id} 
              data={customer}
              onEdit={handleEditCustomer}
              onDelete={handleDeleteCustomer}
            />
          ))
        ) : (
          <div className="no-customers">
            <p>No se encontraron clientes</p>
          </div>
        )}
      </div>
      
      <Pagination 
        totalItems={processedCustomers.length}
        itemsPerPage={itemsPerPage}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
      
      {isModalOpen && (
        <CustomerEditModal 
          customer={selectedCustomer}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveCustomer}
        />
      )}
    </div>
  );
};

export default CustomersPage;