// Pagination.jsx
import React, { useState, useEffect } from 'react';
import './Pagination.css';

const Pagination = ({ 
  totalItems, 
  itemsPerPage: defaultItemsPerPage = 10, 
  currentPage = 1, 
  onPageChange,
  onItemsPerPageChange
}) => {
  const [itemsPerPage, setItemsPerPage] = useState(defaultItemsPerPage);
  const [showDropdown, setShowDropdown] = useState(false);
  
  // Actualizar itemsPerPage cuando cambie la prop
  useEffect(() => {
    setItemsPerPage(defaultItemsPerPage);
  }, [defaultItemsPerPage]);
  
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  
  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    if (onPageChange) {
      onPageChange(page);
    }
  };
  
  const handleItemsPerPageChange = (value) => {
    setItemsPerPage(value);
    setShowDropdown(false);
    
    if (onItemsPerPageChange) {
      onItemsPerPageChange(value);
    }
    
    // Resetear a la primera página cuando cambia el número de items
    if (onPageChange) {
      onPageChange(1);
    }
  };
  
  const handlePrevPage = () => {
    if (currentPage > 1) {
      handlePageChange(currentPage - 1);
    }
  };
  
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      handlePageChange(currentPage + 1);
    }
  };
  
  const firstItem = totalItems > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0;
  const lastItem = Math.min(currentPage * itemsPerPage, totalItems);
  
  // Validar que currentPage sea válido
  const safeCurrentPage = Math.max(1, Math.min(currentPage, totalPages || 1));
  
  return (
    <div className="pagination">
      <div className="pagination-left">
        <div className="page-size-container">
          <div 
            className="page-size-selector"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <span className="items-per-page">{itemsPerPage}</span>
            <span className="dropdown-arrow">▼</span>
          </div>
          
          {showDropdown && (
            <div className="page-size-dropdown">
              <div 
                className="page-size-option" 
                onClick={() => handleItemsPerPageChange(6)}
              >
                6
              </div>
              <div 
                className="page-size-option" 
                onClick={() => handleItemsPerPageChange(10)}
              >
                10
              </div>
              <div 
                className="page-size-option" 
                onClick={() => handleItemsPerPageChange(25)}
              >
                25
              </div>
              <div 
                className="page-size-option" 
                onClick={() => handleItemsPerPageChange(50)}
              >
                50
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="pagination-center">
        <div className="page-info">
          {totalItems > 0 
            ? `${firstItem}-${lastItem} of ${totalItems}` 
            : '0 items'
          }
        </div>
      </div>
      
      <div className="pagination-right">
        <button 
          className="nav-button prev"
          onClick={handlePrevPage}
          disabled={safeCurrentPage <= 1}
          title="Previous page"
        >
          ◄
        </button>
        
        <div className="page-display">
          <span className="current-page">{safeCurrentPage}</span>
          <span className="separator">/</span>
          <span className="total-pages">{totalPages || 1}</span>
        </div>
        
        <button 
          className="nav-button next"
          onClick={handleNextPage}
          disabled={safeCurrentPage >= totalPages || totalPages === 0}
          title="Next page"
        >
          ►
        </button>
        
        <button 
          className="refresh-button"
          onClick={() => window.location.reload()}
          title="Refresh page"
        >
          ⟳
        </button>
      </div>
    </div>
  );
};

export default Pagination;