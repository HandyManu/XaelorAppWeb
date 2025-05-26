// Reviews.jsx
import React, { useState, useEffect } from 'react';
import Header from '../../components/Header/header';
import ReviewCard from '../../components/Cards/ReviewsCard/ReviewsCard';
import Pagination from '../../components/Pagination/Pagination';
// Modal no necesario - vista de solo lectura para empleados
import './Reviews.css';

const ReviewsPage = () => {
  const [reviews, setReviews] = useState([]);
  const [watches, setWatches] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(9);
  // No se necesitan estos estados en la vista de solo lectura
  // const [selectedReview, setSelectedReview] = useState(null);
  // const [isModalOpen, setIsModalOpen] = useState(false);
  const [sortBy, setSortBy] = useState('');
  
  // Simulated data fetch
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Datos simulados de reviews
        const mockReviewsData = [
          {
            "_id": { "$oid": "67acd4256f6ef65c6c85fcdb" },
            "watchId": { "$oid": "67ab844d398487f1caccc64e" },
            "customerId": { "$oid": "67ab82e5222df07400b382b2" },
            "message": "Excelente reloj, muy cómodo y preciso.",
            "rating": 5,
            "date": { "$date": "2025-02-12T17:02:29.278Z" }
          },
          {
            "_id": { "$oid": "67acd4256f6ef65c6c85fcdc" },
            "watchId": { "$oid": "67ab8499398487f1caccc64f" },
            "customerId": { "$oid": "67ab82e5222df07400b382b3" },
            "message": "Elegante y funcional. ¡Me encanta el diseño!",
            "rating": 4,
            "date": { "$date": "2025-02-12T17:02:29.279Z" }
          },
          {
            "_id": { "$oid": "67acd4256f6ef65c6c85fcdd" },
            "watchId": { "$oid": "67ab853f398487f1caccc650" },
            "customerId": { "$oid": "67ab82e5222df07400b382b4" },
            "message": "Excelente relación calidad-precio. Funciona perfectamente.",
            "rating": 5,
            "date": { "$date": "2025-02-12T17:02:29.279Z" }
          },
          {
            "_id": { "$oid": "67acd4256f6ef65c6c85fcde" },
            "watchId": { "$oid": "67ab8581398487f1caccc651" },
            "customerId": { "$oid": "67ab82e5222df07400b382b5" },
            "message": "La duración de la batería es increíble. Muy recomendable.",
            "rating": 5,
            "date": { "$date": "2025-02-12T17:02:29.279Z" }
          },
          {
            "_id": { "$oid": "67acd4256f6ef65c6c85fcdf" },
            "watchId": { "$oid": "67ab85c7398487f1caccc652" },
            "customerId": { "$oid": "67ab82e5222df07400b382b6" },
            "message": "Buen reloj en general, pero la correa es un poco endeble.",
            "rating": 3,
            "date": { "$date": "2025-02-12T17:02:29.279Z" }
          },
          {
            "_id": { "$oid": "67acd4256f6ef65c6c85fce0" },
            "watchId": { "$oid": "67ab85f9398487f1caccc653" },
            "customerId": { "$oid": "67ab82e5222df07400b382b7" },
            "message": "Tuve algunos problemas de conectividad al principio, pero ahora funciona bien.",
            "rating": 4,
            "date": { "$date": "2025-02-12T17:02:29.279Z" }
          },
          {
            "_id": { "$oid": "67acd4256f6ef65c6c85fce1" },
            "watchId": { "$oid": "67ac1bd9411587c90b0cdd95" },
            "customerId": { "$oid": "67ab82e5222df07400b382b8" },
            "message": "Perfecto para el uso diario. Muy contento con mi compra.",
            "rating": 5,
            "date": { "$date": "2025-02-12T17:02:29.279Z" }
          },
          {
            "_id": { "$oid": "67acd4256f6ef65c6c85fce2" },
            "watchId": { "$oid": "67ac1c08411587c90b0cdd96" },
            "customerId": { "$oid": "67ab82e5222df07400b382b9" },
            "message": "La esfera del reloj es un poco pequeña para mi gusto.",
            "rating": 3,
            "date": { "$date": "2025-02-12T17:02:29.279Z" }
          },
          {
            "_id": { "$oid": "67acd4256f6ef65c6c85fce3" },
            "watchId": { "$oid": "67ac1c66411587c90b0cdd97" },
            "customerId": { "$oid": "67ab82e5222df07400b382ba" },
            "message": "Superó mis expectativas. Excelentes características y rendimiento.",
            "rating": 5,
            "date": { "$date": "2025-02-12T17:02:29.279Z" }
          },
          {
            "_id": { "$oid": "67acd4256f6ef65c6c85fce4" },
            "watchId": { "$oid": "67ac1d09411587c90b0cdd98" },
            "customerId": { "$oid": "67ab85c1222df07400b382bb" },
            "message": "Reloj decente, pero hay mejores opciones por ahí.",
            "rating": 3,
            "date": { "$date": "2025-02-12T17:02:29.279Z" }
          }
        ];
        
        // Datos simulados de relojes
        const mockWatchData = [
          {
            "_id": "67ab8499398487f1caccc64f",
            "model": "Xælör noir deluxe",
            "image": "https://oechsle.vteximg.com.br/arquivos/ids/13620763-1000-1000/imageUrl_2.jpg?v=638103858975830000"
          },
          {
            "_id": "67ab853f398487f1caccc650",
            "model": "Xælör Classic",
            "image": "https://bannatynejoyeros.com/blog/wp-content/uploads/2023/07/reloj-cartier.jpg"
          },
          {
            "_id": "67ab844d398487f1caccc64e",
            "model": "Xælör Submariner",
            "image": "https://www.elrubi.es/wp-content/uploads/2019/07/relojes-sumergibles-1-scaled.jpg"
          },
          {
            "_id": "67ab8581398487f1caccc651",
            "model": "Xælör GMT-Master II",
            "image": "https://ibizaloe.com/wp-content/uploads/2020/12/reloj-aloe.jpg"
          },
          {
            "_id": "67ab85c7398487f1caccc652",
            "model": "Xælör Explorer",
            "image": "https://loft.watches/wp-content/uploads/2022/11/Deepsea-Challenge-00.jpg?v=1691367494"
          },
          {
            "_id": "67ab85f9398487f1caccc653",
            "model": "Xælör Sport",
            "image": "https://magazine.chrono24.com/cdn-cgi/image/f=auto,metadata=none,fit=cover,q=65,w=1190,h=595,dpr=2.0/2023/09/ONP-594-2-1.jpg"
          },
          {
            "_id": "67ac1bd9411587c90b0cdd95",
            "model": "Xælör Prestige",
            "image": "https://phantom-expansion.uecdn.es/7c15312187491a44090dd273f8dfb363/crop/54x0/1166x742/resize/828/f/webp/assets/multimedia/imagenes/2023/05/17/16843234229806.jpg"
          },
          {
            "_id": "67ac1c08411587c90b0cdd96",
            "model": "Xælör Ultra",
            "image": "https://phantom-expansion.uecdn.es/e95bec62a22f96ce66637422db993ccf/crop/0x148/1299x878/resize/1200/f/webp/assets/multimedia/imagenes/2023/05/17/16843241764339.jpg"
          },
          {
            "_id": "67ac1c66411587c90b0cdd97",
            "model": "Xælör Heritage",
            "image": "https://www.carl-f-bucherer.com/sites/default/files/2023-09/Annual%20Calendar%20heritage%20updated.jpg"
          },
          {
            "_id": "67ac1d09411587c90b0cdd98",
            "model": "Xælör Limited",
            "image": "https://thumbs.dreamstime.com/b/reloj-de-diamantes-lujo-limitado-relojes-con-perlas-iridiscentes-horas-limitadas-el-dragón-chino-oro-mosaico-188612220.jpg"
          }
        ];
        
        // Datos simulados de clientes
        const mockCustomerData = [
          {
            "_id": "67ab82e5222df07400b382b2",
            "name": "Fabian Hernandez",
            "email": "fabian.hernandez@gmail.com"
          },
          {
            "_id": "67ab82e5222df07400b382b3",
            "name": "Alice Winthrop",
            "email": "alice.winthrop@gmail.com"
          },
          {
            "_id": "67ab82e5222df07400b382b4",
            "name": "Benjamin Churchill",
            "email": "benjamin.churchill@gmail.com"
          },
          {
            "_id": "67ab82e5222df07400b382b5",
            "name": "Diana Harrington",
            "email": "diana.harrington@gmail.com"
          },
          {
            "_id": "67ab82e5222df07400b382b6",
            "name": "Edgar Fitzgerald",
            "email": "edgar.fitzgerald@gmail.com"
          },
          {
            "_id": "67ab82e5222df07400b382b7",
            "name": "Grace Kensington",
            "email": "grace.kensington@gmail.com"
          },
          {
            "_id": "67ab82e5222df07400b382b8",
            "name": "Henry Blackwood",
            "email": "henry.blackwood@gmail.com"
          },
          {
            "_id": "67ab82e5222df07400b382b9",
            "name": "Isabella Fitzroy",
            "email": "isabella.fitzroy@gmail.com"
          },
          {
            "_id": "67ab82e5222df07400b382ba",
            "name": "James Harlem",
            "email": "james.harlem@gmail.com"
          },
          {
            "_id": "67ab85c1222df07400b382bb",
            "name": "Manuel Rockefeller",
            "email": "20220416@ricaldone.edu.sv"
          }
        ];
        
        setReviews(mockReviewsData);
        setWatches(mockWatchData);
        setCustomers(mockCustomerData);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };
    
    fetchData();
  }, []);
  
  // No se permite añadir nuevos reviews desde la vista de empleado
  const handleAddNew = () => {
    alert('Los empleados no pueden crear reseñas');
  };
  
  // Función para refrescar los datos
  const handleRefresh = () => {
    console.log('Refreshing reviews data...');
  };
  
  // No se permite editar reviews desde la vista de empleado
  const handleEditReview = (review) => {
    alert('Los empleados no pueden editar reseñas');
  };
  
  // Función para eliminar un review
  const handleDeleteReview = (reviewId) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta reseña?')) {
      console.log(`Deleting review ${reviewId}`);
      setReviews(reviews.filter(r => r._id.$oid !== reviewId));
    }
  };
  
  // No se permite guardar reviews desde la vista de empleado
  const handleSaveReview = (updatedReview) => {
    console.log('Save review not allowed for employees');
    setIsModalOpen(false);
  };
  
  // Función para obtener información del reloj
  const getWatchInfo = (watchId) => {
    const id = watchId?.$oid || watchId;
    return watches.find(w => w._id === id);
  };
  
  // Función para obtener información del cliente
  const getCustomerInfo = (customerId) => {
    const id = customerId?.$oid || customerId;
    return customers.find(c => c._id === id);
  };
  
  // Función para obtener reviews procesados/ordenados
  const getProcessedReviews = () => {
    let processedReviews = [...reviews];
    
    switch (sortBy) {
      case 'date-new':
        processedReviews.sort((a, b) => 
          new Date(b.date?.$date) - new Date(a.date?.$date)
        );
        break;
      case 'date-old':
        processedReviews.sort((a, b) => 
          new Date(a.date?.$date) - new Date(b.date?.$date)
        );
        break;
      case 'rating-high':
        processedReviews.sort((a, b) => b.rating - a.rating);
        break;
      case 'rating-low':
        processedReviews.sort((a, b) => a.rating - b.rating);
        break;
      default:
        // Por defecto, ordenar por fecha más reciente
        processedReviews.sort((a, b) => 
          new Date(b.date?.$date) - new Date(a.date?.$date)
        );
    }
    
    return processedReviews;
  };
  
  const processedReviews = getProcessedReviews();
  
  // Obtener reviews para la página current
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentReviews = processedReviews.slice(indexOfFirstItem, indexOfLastItem);
  
  // Calcular estadísticas
  const getTotalReviews = () => reviews.length;
  
  const getAverageRating = () => {
    if (reviews.length === 0) return 0;
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    return totalRating / reviews.length;
  };
  
  const getRatingCount = (rating) => {
    return reviews.filter(r => r.rating === rating).length;
  };
  
  const getRecentReviews = () => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    return reviews.filter(r => new Date(r.date.$date) > oneWeekAgo).length;
  };
  
  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i}>{i < rating ? '⭐' : '☆'}</span>
    ));
  };
  
  return (
    <div className="reviews-page">
      <Header 
        title="Reseñas" 
        onAddNew={null}
        onRefresh={handleRefresh}
        sortOptions={[
          { label: 'Fecha (Más reciente)', value: 'date-new' },
          { label: 'Fecha (Más antigua)', value: 'date-old' },
          { label: 'Rating (Mayor a Menor)', value: 'rating-high' },
          { label: 'Rating (Menor a Mayor)', value: 'rating-low' }
        ]}
        onSort={setSortBy}
        showSearch={true}
        showAddButton={false} 
      />

      <div className="reviews-content-scrollable">
        <div className="reviews-stats">
          <div className="stat-card">
            <div className="stat-label">Total Reseñas</div>
            <div className="stat-value">{getTotalReviews()}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Rating Promedio</div>
            <div className="stat-value">
              <div className="rating-display">
                <span>{getAverageRating().toFixed(1)}</span>
                <div className="rating-stars">
                  {renderStars(Math.round(getAverageRating()))}
                </div>
              </div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-label">5 Estrellas</div>
            <div className="stat-value">{getRatingCount(5)}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">4 Estrellas</div>
            <div className="stat-value">{getRatingCount(4)}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">3 Estrellas</div>
            <div className="stat-value">{getRatingCount(3)}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Últimos 7 días</div>
            <div className="stat-value">{getRecentReviews()}</div>
          </div>
        </div>
        <div className="reviews-grid-container">
          <div className="reviews-grid">
            {currentReviews.length > 0 ? (
              currentReviews.map(review => (
                <ReviewCard 
                  key={review._id.$oid} 
                  data={review}
                  watchInfo={getWatchInfo(review.watchId)}
                  customerInfo={getCustomerInfo(review.customerId)}
                  onEdit={null} // Sin edición
                  onDelete={handleDeleteReview}
                />
              ))
            ) : (
              <div className="no-reviews">
                <p>No se encontraron reseñas</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <Pagination 
        totalItems={processedReviews.length}
        itemsPerPage={itemsPerPage}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        onItemsPerPageChange={setItemsPerPage}
      />
    </div>
  );
};

export default ReviewsPage;