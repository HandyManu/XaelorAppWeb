// ProductsPage.jsx
import React, { useState, useEffect } from 'react';
import Header from '../../components/Header/header';
import ProductCard from '../../components/Cards/ProductCard/ProductCard';
import Pagination from '../../components/Pagination/Pagination';
import EditModal from '../../components/Modals/WatchesModals/EditModal';
import './Products.css';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Simulated data fetch
  useEffect(() => {
    // En una aplicación real, aquí harías una llamada a tu API
    const fetchData = async () => {
      try {
        // Simulamos la obtención de datos
        const mockData = [
          {
            "_id": "67ab844d398487f1caccc64e",
            "model": "Xælör Submariner",
            "brandId": "67ab80b71b4e14213d6a9baa",
            "price": 8500,
            "category": "Nautilus",
            "description": "Diseñado para resistir las profundidades, el Submariner es tu compañero confiable en cada inmersión.",
            "photos": [
              { "url": "https://www.elrubi.es/wp-content/uploads/2019/07/relojes-sumergibles-1-scaled.jpg" },
              { "url": "https://www.larrabe.com/Blog/wp-content/uploads/2024/07/Aquaracer300-700x450.jpg" },
              { "url": "https://s2.abcstatics.com/media/summum/2021/06/28/0_portada1-kzCB--1248x698@abc.jpg" }
            ],
            "availability": true
          },
          {
            "_id": "67ab8499398487f1caccc64f",
            "model": "Xælör noir deluxe",
            "brandId": "67ab80b71b4e14213d6a9baa",
            "price": 8500,
            "category": "Ett Med Naturen",
            "description": "Fabricada con materiales orgánicos a base de frutas, suave al tacto y respetuosa con el planeta.",
            "photos": [
              { "url": "https://ibizaloe.com/wp-content/uploads/2020/12/reloj-aloe.jpg" },
              { "url": "https://www.woodensonusa.com/wp-content/uploads/sites/14/2019/01/DSC_0383-600x600.jpg" },
              { "url": "https://www.woodenson.cl/wp-content/uploads/sites/2/2019/01/DSC_0476-600x600.jpg" }
            ],
            "availability": true
          },
          // Aquí irían más productos del JSON proporcionado
        ];
        
        setProducts(mockData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    
    fetchData();
  }, []);
  
  const handleAddNew = () => {
    setSelectedProduct({
      model: '',
      price: 0,
      category: '',
      description: '',
      photos: [],
      availability: true
    });
    setIsModalOpen(true);
  };
  
  const handleRefresh = () => {
    // En una aplicación real, aquí recargarías los datos
    console.log('Refreshing data...');
  };
  
  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };
  
  const handleDeleteProduct = (productId) => {
    // En una aplicación real, aquí harías una llamada a tu API para eliminar
    console.log(`Deleting product ${productId}`);
    setProducts(products.filter(p => p._id !== productId));
  };
  
  const handleSaveProduct = (updatedProduct) => {
    // En una aplicación real, aquí harías una llamada a tu API para actualizar
    if (updatedProduct._id) {
      // Actualizar producto existente
      setProducts(products.map(p => 
        p._id === updatedProduct._id ? updatedProduct : p
      ));
    } else {
      // Añadir nuevo producto con un ID temporal
      const newProduct = {
        ...updatedProduct,
        _id: Date.now().toString() // ID temporal
      };
      setProducts([...products, newProduct]);
    }
    
    setIsModalOpen(false);
  };
  
  // Obtener productos para la página actual
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = products.slice(indexOfFirstItem, indexOfLastItem);
  
  return (
    <div className="products-page">
      <Header 
        title="Relojes" 
        onAddNew={handleAddNew} 
        onRefresh={handleRefresh}
      />
      
      <div className="product-grid">
        {currentProducts.map(product => (
          <ProductCard 
            key={product._id} 
            data={product}
            onEdit={handleEditProduct}
            onDelete={handleDeleteProduct}
          />
        ))}
      </div>
      
      <Pagination 
        totalItems={products.length}
        itemsPerPage={itemsPerPage}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
      
      <EditModal 
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveProduct}
      />
    </div>
  );
};

export default ProductsPage;