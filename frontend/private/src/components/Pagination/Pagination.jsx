// Pagination.jsx
import React from 'react';
import './Pagination.css';

const Pagination = ({ 
  totalItems, 
  itemsPerPage = 10, 
  currentPage = 1, 
  onPageChange 
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  
  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    if (onPageChange) {
      onPageChange(page);
    }
  };
  
  return (
    <div className="pagination">
      <div className="page-size-selector">
        <span className="items-per-page">25</span>
        <span className="dropdown-arrow">▼</span>
      </div>
      
      <div className="page-info">
        {`${(currentPage - 1) * itemsPerPage + 1}-${Math.min(currentPage * itemsPerPage, totalItems)} of ${totalItems}`}
      </div>
      
      <div className="page-controls">
        <button 
          className="refresh-button"
          onClick={() => handlePageChange(currentPage)}
        >
          ⟳
        </button>
      </div>
    </div>
  );
};

export default Pagination;