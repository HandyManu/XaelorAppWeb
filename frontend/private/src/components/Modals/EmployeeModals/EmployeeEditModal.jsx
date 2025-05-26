// EmployeeEditModal.jsx - Actualizado para trabajar con el hook
import React from 'react';
import './EmployeeEditModal.css';

const EmployeeEditModal = ({
    // Estados del formulario
    name,
    setName,
    email,
    setEmail,
    password,
    setPassword,
    phone,
    setPhone,
    branchId,
    setBranchId,
    position,
    setPosition,
    salary,
    setSalary,
    branches,

    // Funciones
    handleSubmit,
    isLoading,
    isEditing,
    onClose
}) => {

    const handleFormSubmit = (e) => {
        e.preventDefault();

        // Validaciones básicas en el frontend
        if (!name.trim()) {
            alert('El nombre es obligatorio');
            return;
        }

        if (!email.trim() || !email.includes('@')) {
            alert('Por favor, ingrese un email válido');
            return;
        }

        if (!isEditing && !password) {
            alert('La contraseña es obligatoria para nuevos empleados');
            return;
        }

        if (password && password.length < 8) {
            alert('La contraseña debe tener al menos 8 caracteres');
            return;
        }

        if (!phone.trim()) {
            alert('El teléfono es obligatorio');
            return;
        }

        if (!position.trim()) {
            alert('El cargo es obligatorio');
            return;
        }

        if (!branchId) {
            alert('Por favor, seleccione una sucursal');
            return;
        }

        if (salary <= 0) {
            alert('El salario debe ser mayor a 0');
            return;
        }

        // Preparar los datos para el submit
        const formData = {
            name: name.trim(),
            email: email.trim(),
            password: password.trim(),
            phone: phone.trim(),
            branchId,
            position: position.trim(),
            salary: parseFloat(salary)
        };

        handleSubmit(formData);
    };

    // Formatear el salario para mostrar
    const formatSalaryDisplay = (salaryValue) => {
        return new Intl.NumberFormat('es-ES', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(salaryValue);
    };

    const handleSalaryChange = (e) => {
        const value = Math.max(0, parseFloat(e.target.value) || 0);
        setSalary(value);
    };

    return (
        <div className="modal-overlay">
            <div className="modal-container">
                <div className="modal-header">
                    <h2>
                        {isEditing ? 'Editar Empleado' : 'Nuevo Empleado'}
                    </h2>
                    <button className="close-button" onClick={onClose}>×</button>
                </div>

                <form onSubmit={handleFormSubmit} className="edit-form">
                    <div className="form-group">
                        <label htmlFor="name">Nombre Completo</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Nombre del empleado"
                            required
                            disabled={isLoading}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Correo Electrónico</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="correo@xaelor.com"
                            required
                            disabled={isLoading}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">
                            {isEditing ? 'Contraseña (dejar en blanco para mantener la actual)' : 'Contraseña'}
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder={isEditing ? '••••••••' : 'Nueva contraseña (mínimo 8 caracteres)'}
                            required={!isEditing}
                            disabled={isLoading}
                            minLength="8"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="phone">Teléfono</label>
                        <input
                            type="text"
                            id="phone"
                            name="phone"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="0000-0000"
                            required
                            disabled={isLoading}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="position">Cargo</label>
                        <input
                            type="text"
                            id="position"
                            name="position"
                            value={position}
                            onChange={(e) => setPosition(e.target.value)}
                            placeholder="Ej: Gerente de ventas, Coordinador, etc."
                            required
                            disabled={isLoading}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="branchId">Sucursal</label>
                        <select
                            id="branchId"
                            name="branchId"
                            value={branchId}
                            onChange={(e) => setBranchId(e.target.value)}
                            required
                            disabled={isLoading}
                        >
                            <option value="">Seleccione una sucursal</option>
                            {branches && branches.map((branch) => (
                                <option key={branch._id} value={branch._id}>
                                    {branch.branch_name || branch.address} - {branch.city || branch.country}
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
                                value={salary}
                                onChange={handleSalaryChange}
                                min="365"
                                step="1"
                                required
                                disabled={isLoading}
                            />
                            <span className="salary-currency">USD</span>
                        </div>

                        {salary > 0 && (
                            <div className="salary-preview">
                                {formatSalaryDisplay(salary)}
                            </div>
                        )}
                    </div>

                    <div className="form-actions">
                        <button
                            type="button"
                            className="cancel-button"
                            onClick={onClose}
                            disabled={isLoading}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="save-button"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Guardando...' : (isEditing ? 'Actualizar Empleado' : 'Crear Empleado')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EmployeeEditModal;