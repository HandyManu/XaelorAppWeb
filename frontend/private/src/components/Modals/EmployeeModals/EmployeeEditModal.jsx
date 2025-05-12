// EmployeeEditModal.jsx
import React, { useState, useEffect } from 'react';
import './EmployeeEditModal.css';

const EmployeeEditModal = ({ employee, isOpen, onClose, onSave, branches }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    branchId: '',
    position: '',
    salary: 0
  });
  
  useEffect(() => {
    if (employee) {
      // Si se está editando un empleado existente, cargar sus datos
      setFormData({
        name: employee.name || '',
        email: employee.email || '',
        password: '', // Por seguridad, no mostramos la contraseña actual
        phone: employee.phone || '',
        branchId: employee.branchId?.$oid || employee.branchId || '',
        position: employee.position || '',
        salary: employee.salary || 0
      });
    } else {
      // Si es un nuevo empleado, inicializar con valores por defecto
      setFormData({
        name: '',
        email: '',
        password: '',
        phone: '',
        branchId: '',
        position: '',
        salary: 0
      });
    }
  }, [employee]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'salary') {
      // Asegurar que el salario sea un número positivo
      const salaryValue = Math.max(0, parseFloat(value) || 0);
      setFormData({
        ...formData,
        [name]: salaryValue
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validaciones
    if (!formData.name.trim()) {
      alert('El nombre es obligatorio');
      return;
    }
    
    if (!formData.email.trim() || !formData.email.includes('@')) {
      alert('Por favor, ingrese un email válido');
      return;
    }
    
    // Para nuevos empleados, la contraseña es obligatoria
    if (!employee?._id && !formData.password) {
      alert('La contraseña es obligatoria para nuevos empleados');
      return;
    }
    
    if (!formData.position.trim()) {
      alert('El cargo es obligatorio');
      return;
    }
    
    if (formData.salary <= 0) {
      alert('El salario debe ser mayor a 0');
      return;
    }
    
    // Preparar los datos para el guardado
    const employeeData = {
      ...employee, // Mantener el _id si existe
      ...formData,
      // Si la contraseña está vacía y estamos editando, no la actualizamos
      password: formData.password || (employee ? employee.password : ''),
      branchId: formData.branchId ? { $oid: formData.branchId } : null,
      salary: parseFloat(formData.salary)
    };
    
    onSave(employeeData);
  };

  // Formatear el salario para mostrar
  const formatSalaryDisplay = (salary) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(salary);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2>{employee && employee._id ? 'Editar Empleado' : 'Nuevo Empleado'}</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        <form onSubmit={handleSubmit} className="edit-form">
          <div className="form-group">
            <label htmlFor="name">Nombre Completo</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Nombre del empleado"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Correo Electrónico</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="correo@xaelor.com"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">
              {employee && employee._id ? 'Contraseña (dejar en blanco para mantener la actual)' : 'Contraseña'}
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder={employee && employee._id ? '••••••••' : 'Nueva contraseña'}
              required={!employee || !employee._id}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="phone">Teléfono</label>
            <input
              type="text"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="0000-0000"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="position">Cargo</label>
            <input
              type="text"
              id="position"
              name="position"
              value={formData.position}
              onChange={handleChange}
              placeholder="Ej: Gerente de ventas, Coordinador, etc."
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="branchId">Sucursal</label>
            <select
              id="branchId"
              name="branchId"
              value={formData.branchId}
              onChange={handleChange}
            >
              <option value="">Sin sucursal asignada</option>
              {branches && branches.map((branch) => (
                <option 
                  key={branch._id?.$oid || branch._id} 
                  value={branch._id?.$oid || branch._id}
                >
                  {branch.address} - {branch.city}
                </option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="salary">Salario Mensual</label>
            <div className="salary-input-container">
              <input
                type="number"
                id="salary"
                name="salary"
                value={formData.salary}
                onChange={handleChange}
                min="0"
                step="100"
                required
              />
              <span className="salary-currency">USD</span>
            </div>
            
            {formData.salary > 0 && (
              <div className="salary-preview">
                {formatSalaryDisplay(formData.salary)}
              </div>
            )}
          </div>
          
          <div className="form-actions">
            <button type="button" className="cancel-button" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="save-button">
              {employee && employee._id ? 'Actualizar Empleado' : 'Crear Empleado'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmployeeEditModal;