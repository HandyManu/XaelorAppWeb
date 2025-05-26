// Inventory.jsx
import React, { useState, useEffect } from 'react';
import Header from '../../components/Header/header';
import InventoryCard from '../../components/Cards/InventoryCard/InventoryCard';
import Pagination from '../../components/Pagination/Pagination';
import InventoryEditModal from '../../components/Modals/InventoryModals/InventoryEditModal';
import './Inventory.css';

const InventoryPage = () => {
  const [inventories, setInventories] = useState([]);
  const [watches, setWatches] = useState([]);
  const [branches, setBranches] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6); // Ajustado para mostrar 2 filas de 3
  const [selectedInventory, setSelectedInventory] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sortBy, setSortBy] = useState('');
  
  // Simulated data fetch
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Datos simulados de inventario
        const mockInventoryData = [
           {
            "_id": "67acd1f9e1a9ab99ca59601a",
            "watchId": { "$oid": "67ab8499398487f1caccc64f" },
            "branchId": { "$oid": "67ab842f0dcf66e92c78842a" },
            "stock": 30
          },
          {
            "_id": "67acd1f9e1a9ab99ca59601b",
            "watchId": { "$oid": "67ab8581398487f1caccc651" },
            "branchId": { "$oid": "67ab842f0dcf66e92c78842a" },
            "stock": 75
          },
          {
            "_id": "67acd1f9e1a9ab99ca59601c",
            "watchId": { "$oid": "67ab85c7398487f1caccc652" },
            "branchId": { "$oid": "67ab842f0dcf66e92c78842a" },
            "stock": 20
          }
        ];
        
        // Datos simulados de relojes
        const mockWatchData = [
          {
            "_id": { "$oid": "67ab844d398487f1caccc64e" },
            "model": "Xælör Submariner",
            "price": 8500,
            "category": "Nautilus",
            "photos": [
              { "url": "https://www.elrubi.es/wp-content/uploads/2019/07/relojes-sumergibles-1-scaled.jpg" }
            ]
          },
          {
            "_id": { "$oid": "67ab8499398487f1caccc64f" },
            "model": "Xælör noir deluxe",
            "price": 8500,
            "category": "Ett Med Naturen",
            "photos": [
              { "url": "https://ibizaloe.com/wp-content/uploads/2020/12/reloj-aloe.jpg" }
            ]
          },
          {
            "_id": { "$oid": "67ab8581398487f1caccc651" },
            "model": "Xælör Explorer",
            "price": 12000,
            "category": "Nautilus",
            "photos": [
              { "url": "https://joyeriainter.com/wp-content/uploads/2022/08/07.Two_Column_M226570-0001_2103jva_002_XL_desktop.jpg" }
            ]
          },
          {
            "_id": { "$oid": "67ab85c7398487f1caccc652" },
            "model": "Xælör Classic",
            "price": 5000,
            "category": "Ett Med Naturen",
            "photos": [
              { "url": "https://kapile.pe/wp-content/uploads/2023/06/reloj-fondo-negro.jpg" }
            ]
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
            "_id": { "$oid": "67ab80b71b4e14213d6a9baa" },
            "address": "Centro Comercial Plaza Merliot",
            "city": "Santa Tecla",
            "country": "El Salvador"
          }
        ];
        
        setInventories(mockInventoryData);
        setWatches(mockWatchData);
        setBranches(mockBranchData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    
    fetchData();
  }, []);
  
  // Función para añadir un nuevo inventario
  const handleAddNew = () => {
    setSelectedInventory(null);
    setIsModalOpen(true);
  };
  
  // Función para refrescar los datos
  const handleRefresh = () => {
    console.log('Refreshing inventory data...');
  };
  
  // Función para editar un inventario
  const handleEditInventory = (inventory) => {
    setSelectedInventory(inventory);
    setIsModalOpen(true);
  };
  
  // Función para eliminar un inventario
  const handleDeleteInventory = (inventoryId) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este registro de inventario?')) {
      console.log(`Deleting inventory ${inventoryId}`);
      setInventories(inventories.filter(i => i._id !== inventoryId));
    }
  };
  
  // Función para guardar cambios de inventario
  const handleSaveInventory = (updatedInventory) => {
    if (updatedInventory._id) {
      // Actualizar inventario existente
      setInventories(inventories.map(i => 
        i._id === updatedInventory._id ? updatedInventory : i
      ));
    } else {
      // Añadir nuevo inventario con un ID temporal
      const newInventory = {
        ...updatedInventory,
        _id: Date.now().toString()
      };
      setInventories([...inventories, newInventory]);
    }
    
    setIsModalOpen(false);
  };
  
  // Función para obtener información del reloj por ID
  const getWatchInfo = (watchId) => {
    return watches.find(w => w._id.$oid === watchId.$oid);
  };
  
  // Función para obtener información de la sucursal por ID
  const getBranchInfo = (branchId) => {
    return branches.find(b => b._id.$oid === branchId.$oid);
  };
  
  // Función para obtener inventarios procesados/ordenados
  const getProcessedInventories = () => {
    let processedInventories = [...inventories];
    
    switch (sortBy) {
      case 'stock-low':
        processedInventories.sort((a, b) => a.stock - b.stock);
        break;
      case 'stock-high':
        processedInventories.sort((a, b) => b.stock - a.stock);
        break;
      case 'model':
        processedInventories.sort((a, b) => {
          const watchA = getWatchInfo(a.watchId);
          const watchB = getWatchInfo(b.watchId);
          return watchA?.model.localeCompare(watchB?.model || '') || 0;
        });
        break;
      case 'branch':
        processedInventories.sort((a, b) => {
          const branchA = getBranchInfo(a.branchId);
          const branchB = getBranchInfo(b.branchId);
          return branchA?.address.localeCompare(branchB?.address || '') || 0;
        });
        break;
      case 'value':
        processedInventories.sort((a, b) => {
          const watchA = getWatchInfo(a.watchId);
          const watchB = getWatchInfo(b.watchId);
          const valueA = (watchA?.price || 0) * a.stock;
          const valueB = (watchB?.price || 0) * b.stock;
          return valueB - valueA;
        });
        break;
      default:
        // Por defecto, ordenar por modelo
        processedInventories.sort((a, b) => {
          const watchA = getWatchInfo(a.watchId);
          const watchB = getWatchInfo(b.watchId);
          return watchA?.model.localeCompare(watchB?.model || '') || 0;
        });
    }
    
    return processedInventories;
  };
  
  const processedInventories = getProcessedInventories();
  
  // Obtener inventarios para la página actual
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentInventories = processedInventories.slice(indexOfFirstItem, indexOfLastItem);
  
  // Calcular estadísticas del inventario
  const getTotalStock = () => {
    return inventories.reduce((total, inv) => total + inv.stock, 0);
  };
  
  const getTotalValue = () => {
    return inventories.reduce((total, inv) => {
      const watch = getWatchInfo(inv.watchId);
      return total + (watch?.price || 0) * inv.stock;
    }, 0);
  };
  
  return (
    <div className="inventory-page">
      <Header 
        title="Inventario" 
        onAddNew={handleAddNew} 
        onRefresh={handleRefresh}
        sortOptions={[
          { label: 'Modelo', value: 'model' },
          { label: 'Stock (Menor a Mayor)', value: 'stock-low' },
          { label: 'Stock (Mayor a Menor)', value: 'stock-high' },
          { label: 'Sucursal', value: 'branch' },
          { label: 'Valor Total', value: 'value' }
        ]}
        onSort={setSortBy}
        showSearch={true}
      />
      
      <div className="inventory-stats">
        <div className="stat-card">
          <div className="stat-label">Total Unidades</div>
          <div className="stat-value">{getTotalStock()}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Valor Total</div>
          <div className="stat-value">${getTotalValue().toLocaleString()}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total Registros</div>
          <div className="stat-value">{inventories.length}</div>
        </div>
      </div>
      
      <div className="inventory-grid">
        {currentInventories.length > 0 ? (
          currentInventories.map(inventory => (
            <InventoryCard 
              key={inventory._id} 
              data={inventory}
              watchInfo={getWatchInfo(inventory.watchId)}
              branchInfo={getBranchInfo(inventory.branchId)}
              onEdit={handleEditInventory}
              onDelete={handleDeleteInventory}
            />
          ))
        ) : (
          <div className="no-inventory">
            <p>No se encontraron registros de inventario</p>
          </div>
        )}
      </div>
      
      <Pagination 
        totalItems={processedInventories.length}
        itemsPerPage={itemsPerPage}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
      
      {isModalOpen && (
        <InventoryEditModal 
          inventory={selectedInventory}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveInventory}
          watches={watches}
          branches={branches}
        />
      )}
    </div>
  );
};

export default InventoryPage;