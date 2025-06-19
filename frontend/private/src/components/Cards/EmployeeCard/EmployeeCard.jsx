// EmployeeCard.jsx
import React, { useState } from 'react';
import './EmployeeCard.css';

const EmployeeCard = ({ data, branchInfo, onEdit, onDelete }) => {
  const [showDeleteIcon, setShowDeleteIcon] = useState(false);
  
  const handleClick = () => {
    if (onEdit) {
      onEdit(data);
    }
  };
  
  const handleDelete = (e) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(data._id);
    }
  };
  
  // Determinar el color basado en el salario
  const getSalaryColor = (salary) => {
    if (salary <= 2800) return 'basic';
    if (salary <= 3500) return 'standard';
    return 'premium';
  };
  
  // Formatear salario
  const formatSalary = (salary) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(salary);
  };
  
  const salaryLevel = getSalaryColor(data.salary);
  
  return (
    <div 
      className="employee-card"
      onClick={handleClick}
      onMouseEnter={() => setShowDeleteIcon(true)}
      onMouseLeave={() => setShowDeleteIcon(false)}
    >
      <div className="employee-avatar">
        {data.name.split(' ').map(n => n[0]).join('').toUpperCase()}
      </div>
      
      <div className="employee-info">
        <div className="employee-name">{data.name}</div>
        
        <div className="employee-position">
          {data.position}
        </div>
        
        <div className="employee-contact">
          <div className="contact-item">
            <i className="contact-icon">✉</i>
            <span>{data.email}</span>
          </div>
          <div className="contact-item">
            <i className="contact-icon">☏</i>
            <span>{data.phone}</span>
          </div>
        </div>
        
        <div className="employee-branch">
          <i className="branch-icon">📍</i>
          <span>{branchInfo?.address || 'Sucursal no asignada'}</span>
        </div>
        
        <div className="employee-salary">
          <span className={`salary-amount ${salaryLevel}`}>
            {formatSalary(data.salary)}
          </span>
          <span className="salary-label">/ mes</span>
        </div>
      </div>
      
      {showDeleteIcon && (
        <div className="delete-icon" onClick={handleDelete}>
          <img src="/basura.svg" alt="Delete Icon" className="delete-icon-img" />
        </div>
      )}
    </div>
  );
};

export default EmployeeCard;