// Brands.jsx actualizado para trabajar con logos
import React, { useState, useEffect } from 'react';
import Header from '../../components/Header/header';
import BrandCard from '../../components/Cards/BrandCard/BrandCard';
import Pagination from '../../components/Pagination/Pagination';
import BrandEditModal from '../../components/Modals/BrandModals/BrandEditModal';
import './Brands.css';

const BrandsPage = () => {
  const [brands, setBrands] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(16); // Mostramos más marcas por página
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Simulated data fetch
  useEffect(() => {
    // En una aplicación real, aquí harías una llamada a tu API
    const fetchData = async () => {
      try {
        // Simulamos la obtención de datos
        const mockData = [
          {
            "_id": "67ab7f7c1b4e14213d6a9ba3",
            "brandName": "Casio",
            "logoUrl": "https://upload.wikimedia.org/wikipedia/commons/4/4d/Casio_logo.svg"
          },
          {
            "_id": "67ab7ff51b4e14213d6a9ba4",
            "brandName": "Jaeger-LeCoultre",
            "logoUrl": "https://upload.wikimedia.org/wikipedia/commons/d/df/Jaeger-LeCoultre_Logo.png"
          },
          {
            "_id": "67ab800f1b4e14213d6a9ba5",
            "brandName": "Renos",
            "logoUrl": "https://upload.wikimedia.org/wikipedia/commons/6/67/Logo_Reno.svg"
          },
          {
            "_id": "67ab80371b4e14213d6a9ba6",
            "brandName": "Omega",
            "logoUrl": "https://upload.wikimedia.org/wikipedia/commons/f/fb/Omega_Logo.svg"
          },
          {
            "_id": "67ab80531b4e14213d6a9ba7",
            "brandName": "BVLGARI",
            "logoUrl": "https://upload.wikimedia.org/wikipedia/commons/3/32/Bulgari_logo.svg"
          },
          {
            "_id": "67ab807a1b4e14213d6a9ba8",
            "brandName": "Atlantic",
            "logoUrl": "https://upload.wikimedia.org/wikipedia/commons/8/86/The-Atlantic-logo-vector.svg"
          },
          {
            "_id": "67ab80921b4e14213d6a9ba9",
            "brandName": "Bulgari",
            "logoUrl": "https://upload.wikimedia.org/wikipedia/commons/3/32/Bulgari_logo.svg"
          },
          {
            "_id": "67ab80b71b4e14213d6a9baa",
            "brandName": "Xælör",
            "logoUrl": "https://i.imgur.com/O6Z6GTv_d.webp?maxwidth=760&fidelity=grandhttps://i.imgur.com/O6Z6GTv.png"
          },
          {
            "_id": "67ab80ec1b4e14213d6a9bab",
            "brandName": "Condor",
            "logoUrl": "https://upload.wikimedia.org/wikipedia/commons/7/75/Condor_logo.svg"
          },
          {
            "_id": "67ab81191b4e14213d6a9bac",
            "brandName": "Furlan Marri",
            "logoUrl": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSoaxvXr39OXKrwlD91EihV4_mmh11w8qEyag&s"
          }
        ];
        
        setBrands(mockData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    
    fetchData();
  }, []);
  
  const handleAddNew = () => {
    setSelectedBrand({
      brandName: '',
      logoUrl: ''
    });
    setIsModalOpen(true);
  };
  
  const handleRefresh = () => {
    // En una aplicación real, aquí recargarías los datos
    console.log('Refreshing data...');
  };
  
  const handleEditBrand = (brand) => {
    setSelectedBrand(brand);
    setIsModalOpen(true);
  };
  
  const handleDeleteBrand = (brandId) => {
    // En una aplicación real, aquí harías una llamada a tu API para eliminar
    console.log(`Deleting brand ${brandId}`);
    setBrands(brands.filter(b => b._id !== brandId));
  };
  
  const handleSaveBrand = (updatedBrand) => {
    // En una aplicación real, aquí harías una llamada a tu API para actualizar
    if (updatedBrand._id) {
      // Actualizar marca existente
      setBrands(brands.map(b => 
        b._id === updatedBrand._id ? updatedBrand : b
      ));
    } else {
      // Añadir nueva marca con un ID temporal
      const newBrand = {
        ...updatedBrand,
        _id: Date.now().toString() // ID temporal
      };
      setBrands([...brands, newBrand]);
    }
    
    setIsModalOpen(false);
  };
  
  // Obtener marcas para la página actual
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentBrands = brands.slice(indexOfFirstItem, indexOfLastItem);
  
  return (
    <div className="brands-page">
      <Header 
        title="Marcas" 
        onAddNew={handleAddNew} 
        onRefresh={handleRefresh}
      />
      
      <div className="brand-grid">
        {currentBrands.map(brand => (
          <BrandCard 
            key={brand._id} 
            data={brand}
            onEdit={handleEditBrand}
            onDelete={handleDeleteBrand}
          />
        ))}
      </div>
      
      <Pagination 
        totalItems={brands.length}
        itemsPerPage={itemsPerPage}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
      
      <BrandEditModal 
        brand={selectedBrand}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveBrand}
      />
    </div>
  );
};

export default BrandsPage;