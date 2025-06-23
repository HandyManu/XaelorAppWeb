// Reviews.jsx - Actualizado para usar el hook useReviews
import React, { useEffect, useState } from 'react';
import { useReviewsManager } from '../../hooks/ReviewsHooks/useReviews';
import Header from '../../components/Header/header';
import ReviewCard from '../../components/Cards/ReviewsCard/ReviewsCard';
import Pagination from '../../components/Pagination/Pagination';
import DeleteConfirmationModal from '../../components/Modals/DeleteConfirmationModal/DeleteConfirmationModal';
import toast, { Toaster } from 'react-hot-toast'; // <-- Agrega esto
import './Reviews.css';

const ReviewsPage = () => {
  const {
    // Estados principales
    reviews,
    watches,
    customers,
    showDeleteModal,
    reviewToDelete,
    isLoading,
    error,
    success,
    setError,
    
    // Estados de paginación
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    
    // Funciones principales
    loadInitialData,
    handleDeleteReview,
    confirmDeleteReview,
    cancelDeleteReview,
    handleRefresh,
    getWatchInfo,
    getCustomerInfo,
    getFilteredReviews,
    
    // Funciones de estadísticas
    getTotalReviews,
    getAverageRating,
    getRatingCount,
    getRecentReviews,
    renderStars,
  } = useReviewsManager();

  // Estados locales para filtros y búsqueda
  const [sortBy, setSortBy] = useState('date-new');
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

  // No se permite añadir nuevos reviews desde la vista de empleado
  const handleAddNew = () => {
    alert('Los empleados no pueden crear reseñas');
  };

  // No se permite editar reviews desde la vista de empleado
  const handleEditReview = (review) => {
    alert('Los empleados no pueden editar reseñas');
  };

  // Obtener reseñas procesadas (filtradas y ordenadas)
  const processedReviews = getFilteredReviews(sortBy, searchTerm);

  // Calcular paginación con las reseñas procesadas
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentReviews = processedReviews.slice(indexOfFirstItem, indexOfLastItem);

  // Resetear página al cambiar filtros o items per page
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, sortBy, itemsPerPage]);

  // Mostrar notificaciones de error y éxito
  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  useEffect(() => {
    if (success) toast.success(success);
  }, [success]);

  // Función para renderizar estrellas con JSX
  const renderStarsJSX = (rating) => {
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
        showSearch={true}
        onSearch={handleSearch}
        searchPlaceholder="Buscar por cliente, producto o mensaje..."
        sortOptions={[
          { label: 'Fecha (Más reciente)', value: 'date-new' },
          { label: 'Fecha (Más antigua)', value: 'date-old' },
          { label: 'Rating (Mayor a Menor)', value: 'rating-high' },
          { label: 'Rating (Menor a Mayor)', value: 'rating-low' },
          { label: 'Cliente (A-Z)', value: 'customer' },
          { label: 'Producto (A-Z)', value: 'product' }
        ]}
        onSort={handleSort}
        showAddButton={false} 
      />

      {/* Elimina los mensajes visuales de error y éxito */}
      {/* 
      {error && (
        <div className="error-message">
          <span>{error}</span>
          <button onClick={handleCloseError} className="close-btn">×</button>
        </div>
      )}
      {success && (
        <div className="success-message">
          {success}
        </div>
      )}
      */}

      {/* Mostrar indicador de carga */}
      {isLoading && (
        <div className="loading-indicator">
          <div className="spinner"></div>
          <span>Cargando...</span>
        </div>
      )}

      <div className="reviews-content-scrollable">
        {/* Estadísticas de reseñas */}
        {!isLoading && (
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
                    {renderStarsJSX(Math.round(getAverageRating()))}
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
        )}
        
        {/* Grid de reseñas */}
        <div className="reviews-grid-container">
          <div className="reviews-grid">
            {currentReviews.length > 0 ? (
              currentReviews.map(review => (
                <ReviewCard 
                  key={review._id?.$oid || review._id} 
                  data={review}
                  watchInfo={getWatchInfo(review.watchId)}
                  customerInfo={getCustomerInfo(review.customerId)}
                  onEdit={null} // Sin edición
                  onDelete={handleDeleteReview}
                />
              ))
            ) : (
              !isLoading && (
                <div className="no-reviews">
                  {searchTerm ? (
                    <>
                      <p>No se encontraron reseñas que coincidan con la búsqueda</p>
                      <button 
                        onClick={() => setSearchTerm('')} 
                        className="btn btn-secondary"
                      >
                        Limpiar búsqueda
                      </button>
                    </>
                  ) : (
                    <p>No se encontraron reseñas</p>
                  )}
                </div>
              )
            )}
          </div>
        </div>
      </div>
      
      {/* Paginación - Solo mostrar si hay elementos */}
      {processedReviews.length > 0 && (
        <Pagination 
          totalItems={processedReviews.length}
          itemsPerPage={itemsPerPage}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={setItemsPerPage}
          showItemsPerPage={true}
          itemsPerPageOptions={[9, 18, 27, 36]}
        />
      )}
      
      {/* Modal de confirmación de eliminación */}
      {showDeleteModal && reviewToDelete && (
        <DeleteConfirmationModal
          isOpen={showDeleteModal}
          onClose={cancelDeleteReview}
          onConfirm={confirmDeleteReview}
          title="Eliminar Reseña"
          message="¿Estás seguro de que deseas eliminar esta reseña?"
          itemName={`Reseña de ${getCustomerInfo(reviewToDelete.customerId)?.name || 'Cliente'} para ${getWatchInfo(reviewToDelete.watchId)?.model || 'Producto'}`}
          isLoading={isLoading}
        />
      )}

      <Toaster position="top-right" />
    </div>
  );
};

export default ReviewsPage;