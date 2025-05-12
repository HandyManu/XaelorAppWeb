// Branches.jsx
import React, { useState, useEffect } from 'react';
import Header from '../../components/Header/header';
import BranchCard from '../../components/Cards/BranchCard/BranchCard';
import Pagination from '../../components/Pagination/Pagination';
import BranchEditModal from '../../components/Modals/BranchesModals/BranchEditModal';
import './Branch.css';

const BranchesPage = () => {
  const [branches, setBranches] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Simulated data fetch
  useEffect(() => {
    // En una aplicación real, aquí harías una llamada a tu API
    const fetchData = async () => {
      try {
        // Simulamos la obtención de datos
        const mockData = [
          {
            "_id": "67ab842f0dcf66e92c78842a",
            "branch_name": "Sucursal San Salvador",
            "country": "El Salvador",
            "address": "San Salvador, Calle Principal 123",
            "phone_number": "1234-5678",
            "business_hours": [
              {
                "day": "Lunes",
                "open": "08:00",
                "close": "18:00"
              },
              {
                "day": "Martes",
                "open": "08:00",
                "close": "18:00"
              }
            ]
          },
          {
            "_id": "67ab842f0dcf66e92c78842b",
            "branch_name": "Sucursal Ciudad de Guatemala",
            "country": "Guatemala",
            "address": "Zona 1, Avenida Reforma, Ciudad de Guatemala",
            "phone_number": "5678-1234",
            "business_hours": [
              {
                "day": "Lunes-Sábado",
                "open": "08:00",
                "close": "19:00"
              },
              {
                "day": "Domingo",
                "open": "10:00",
                "close": "15:00"
              }
            ]
          },
          {
            "_id": "67ab842f0dcf66e92c78842c",
            "branch_name": "Sucursal Ciudad de México",
            "country": "México",
            "address": "Paseo de la Reforma 456, Ciudad de México",
            "phone_number": "9876-5432",
            "business_hours": [
              {
                "day": "Lunes",
                "open": "07:30",
                "close": "17:30"
              },
              {
                "day": "Martes",
                "open": "07:30",
                "close": "17:30"
              }
            ]
          },
          // Aquí irían más sucursales
        ];
        
        setBranches(mockData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    
    fetchData();
  }, []);
  
  const handleAddNew = () => {
    setSelectedBranch({
      branch_name: '',
      country: '',
      address: '',
      phone_number: '',
      business_hours: [
        { day: 'Lunes', open: '08:00', close: '18:00' }
      ]
    });
    setIsModalOpen(true);
  };
  
  const handleRefresh = () => {
    // En una aplicación real, aquí recargarías los datos
    console.log('Refreshing data...');
  };
  
  const handleEditBranch = (branch) => {
    setSelectedBranch(branch);
    setIsModalOpen(true);
  };
  
  const handleDeleteBranch = (branchId) => {
    // En una aplicación real, aquí harías una llamada a tu API para eliminar
    console.log(`Deleting branch ${branchId}`);
    setBranches(branches.filter(b => b._id !== branchId));
  };
  
  const handleSaveBranch = (updatedBranch) => {
    // En una aplicación real, aquí harías una llamada a tu API para actualizar
    if (updatedBranch._id) {
      // Actualizar sucursal existente
      setBranches(branches.map(b => 
        b._id === updatedBranch._id ? updatedBranch : b
      ));
    } else {
      // Añadir nueva sucursal con un ID temporal
      const newBranch = {
        ...updatedBranch,
        _id: Date.now().toString() // ID temporal
      };
      setBranches([...branches, newBranch]);
    }
    
    setIsModalOpen(false);
  };
  
  // Obtener sucursales para la página actual
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentBranches = branches.slice(indexOfFirstItem, indexOfLastItem);
  
  return (
    <div className="branches-page">
      <Header 
        title="Sucursales" 
        onAddNew={handleAddNew} 
        onRefresh={handleRefresh}
      />
      
      <div className="branch-grid">
        {currentBranches.map(branch => (
          <BranchCard 
            key={branch._id} 
            data={branch}
            onEdit={handleEditBranch}
            onDelete={handleDeleteBranch}
          />
        ))}
      </div>
      
      <Pagination 
        totalItems={branches.length}
        itemsPerPage={itemsPerPage}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
      
      <BranchEditModal 
        branch={selectedBranch}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveBranch}
      />
    </div>
  );
};

export default BranchesPage;