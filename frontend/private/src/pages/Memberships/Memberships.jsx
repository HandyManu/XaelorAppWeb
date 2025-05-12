// Memberships.jsx
import React, { useState, useEffect } from 'react';
import Header from '../../components/Header/header';
import MembershipCard from '../../components/Cards/MembershipCard/MembershipCard';
import MembershipEditModal from '../../components/Modals/MembershipsModals/MembershipsEditModal';
import './Memberships.css';

const MembershipsPage = () => {
  const [memberships, setMemberships] = useState([]);
  const [selectedMembership, setSelectedMembership] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sortBy, setSortBy] = useState('');
  
  // Simulated data fetch
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Datos simulados de membresías
        const mockMembershipData = [
          {
            "_id": "67acd69ae1fa12d45243dc76",
            "membershipTier": "Bronze",
            "price": 50,
            "benefits": "10% off all purchases",
            "discount": 0.1
          },
          {
            "_id": "67acd69ae1fa12d45243dc77",
            "membershipTier": "Silver",
            "price": 100,
            "benefits": "15% off all purchases - Free shipping on orders over $100",
            "discount": 0.15
          },
          {
            "_id": "67acd69ae1fa12d45243dc78",
            "membershipTier": "Gold",
            "price": 200,
            "benefits": "25% off all purchases - Free shipping on all - Exclusive early access to sales",
            "discount": 0.25
          }
        ];
        
        setMemberships(mockMembershipData);
      } catch (error) {
        console.error('Error fetching memberships:', error);
      }
    };
    
    fetchData();
  }, []);
  
  // Función para añadir una nueva membresía
  const handleAddNew = () => {
    setSelectedMembership(null);
    setIsModalOpen(true);
  };
  
  // Función para refrescar los datos
  const handleRefresh = () => {
    console.log('Refreshing memberships data...');
  };
  
  // Función para editar una membresía
  const handleEditMembership = (membership) => {
    setSelectedMembership(membership);
    setIsModalOpen(true);
  };
  
  // Función para eliminar una membresía
  const handleDeleteMembership = (membershipId) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta membresía?')) {
      console.log(`Deleting membership ${membershipId}`);
      setMemberships(memberships.filter(m => m._id !== membershipId));
    }
  };
  
  // Función para guardar cambios de membresía
  const handleSaveMembership = (updatedMembership) => {
    if (updatedMembership._id) {
      // Actualizar membresía existente
      setMemberships(memberships.map(m => 
        m._id === updatedMembership._id ? updatedMembership : m
      ));
    } else {
      // Añadir nueva membresía con un ID temporal
      const newMembership = {
        ...updatedMembership,
        _id: Date.now().toString()
      };
      setMemberships([...memberships, newMembership]);
    }
    
    setIsModalOpen(false);
  };
  
  // Función para obtener membresías procesadas/ordenadas
  const getProcessedMemberships = () => {
    let processedMemberships = [...memberships];
    
    switch (sortBy) {
      case 'price-low':
        processedMemberships.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        processedMemberships.sort((a, b) => b.price - a.price);
        break;
      case 'discount-low':
        processedMemberships.sort((a, b) => a.discount - b.discount);
        break;
      case 'discount-high':
        processedMemberships.sort((a, b) => b.discount - a.discount);
        break;
      case 'tier':
        // Ordenar por nivel de tier (Bronze < Silver < Gold)
        const tierOrder = { 'Bronze': 1, 'Silver': 2, 'Gold': 3 };
        processedMemberships.sort((a, b) => 
          (tierOrder[a.membershipTier] || 999) - (tierOrder[b.membershipTier] || 999)
        );
        break;
      default:
        // Por defecto, ordenar por tier
        const defaultTierOrder = { 'Bronze': 1, 'Silver': 2, 'Gold': 3 };
        processedMemberships.sort((a, b) => 
          (defaultTierOrder[a.membershipTier] || 999) - (defaultTierOrder[b.membershipTier] || 999)
        );
    }
    
    return processedMemberships;
  };
  
  const processedMemberships = getProcessedMemberships();
  
  // Calcular estadísticas
  const getTotalRevenue = () => {
    // En una aplicación real, esto se calcularía con el número real de miembros
    return 0; // Por ahora retornamos 0
  };
  
  const getActiveMembers = () => {
    // En una aplicación real, esto vendría de la base de datos
    return 0; // Por ahora retornamos 0
  };
  
  const getAverageDiscount = () => {
    if (memberships.length === 0) return 0;
    const totalDiscount = memberships.reduce((sum, m) => sum + m.discount, 0);
    return (totalDiscount / memberships.length * 100).toFixed(1);
  };
  
  return (
    <div className="memberships-page">
      <Header 
        title="Membresías" 
        onAddNew={handleAddNew} 
        onRefresh={handleRefresh}
        sortOptions={[
          { label: 'Tier', value: 'tier' },
          { label: 'Precio (Menor a Mayor)', value: 'price-low' },
          { label: 'Precio (Mayor a Menor)', value: 'price-high' },
          { label: 'Descuento (Menor a Mayor)', value: 'discount-low' },
          { label: 'Descuento (Mayor a Menor)', value: 'discount-high' }
        ]}
        onSort={setSortBy}
        showSearch={false}
      />
      
      <div className="memberships-stats">
        <div className="stat-card">
          <div className="stat-label">Tipos de Membresía</div>
          <div className="stat-value">{memberships.length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Miembros Activos</div>
          <div className="stat-value">{getActiveMembers()}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Descuento Promedio</div>
          <div className="stat-value">{getAverageDiscount()}%</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Ingresos Totales</div>
          <div className="stat-value">${getTotalRevenue().toLocaleString()}</div>
        </div>
      </div>
      
      <div className="memberships-grid-container">
        <div className="memberships-grid">
          {processedMemberships.length > 0 ? (
            processedMemberships.map(membership => (
              <MembershipCard 
                key={membership._id} 
                data={membership}
                onEdit={handleEditMembership}
                onDelete={handleDeleteMembership}
              />
            ))
          ) : (
            <div className="no-memberships">
              <p>No se encontraron membresías</p>
            </div>
          )}
        </div>
      </div>
      
      {isModalOpen && (
        <MembershipEditModal 
          membership={selectedMembership}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveMembership}
        />
      )}
    </div>
  );
};

export default MembershipsPage;