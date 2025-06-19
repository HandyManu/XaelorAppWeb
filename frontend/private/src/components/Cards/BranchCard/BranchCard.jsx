// BranchCard.jsx
import { useState } from 'react';
import './BranchCard.css';

function BranchCard({ data, onEdit, onDelete }) {
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
  
  // Formatear horarios para visualización
  const formatBusinessHours = () => {
    if (!data.business_hours || data.business_hours.length === 0) {
      return 'No hay horarios disponibles';
    }
    
    return data.business_hours.map((hour, index) => (
      <div key={index} className="hour-item">
        <span className="day">{hour.day}:</span> {hour.open} - {hour.close}
      </div>
    ));
  };
  
  return (
    <div 
      className="branch-card"
      onClick={handleClick}
      onMouseEnter={() => setShowDeleteIcon(true)}
      onMouseLeave={() => setShowDeleteIcon(false)}
    >
      <div className="card-logo">æ</div>
      
      <div className="card-title">
        {data.branch_name}
      </div>
      
      <div className="card-location">
        <div className="card-country">{data.country}</div>
        <div className="card-address">{data.address}</div>
      </div>
      
      <div className="card-contact">
        <div className="card-phone">
          <span className="label">Teléfono:</span> {data.phone_number}
        </div>
      </div>
      
      <div className="card-hours">
        <h4>Horario:</h4>
        <div className="hours-container">
          {formatBusinessHours()}
        </div>
      </div>
      
      {showDeleteIcon && (
        <div className="delete-icon" onClick={handleDelete}>
          <img src="/basura.svg" alt="Delete Icon" className="delete-icon-img" />
        </div>
      )}
    </div>
  );
}

export default BranchCard;