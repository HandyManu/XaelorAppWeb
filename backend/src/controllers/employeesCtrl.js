/*Este archivo tiene los métodos del CRUD
    (Select, insert, update, delete)
    */

//Creo un array de funciones 
const employeesController = {};
import employeesModel from "../models/employeesMdl.js";
import bcryptjs from "bcryptjs";

//SELECT
employeesController.getEmployee = async (req, res) => {
    try {
        const employees = await employeesModel.find().populate('branchId');
        res.json(employees);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

//INSERT
employeesController.insertEmployee = async (req, res) => {
    try {
        const { name, email, password, phone, branchId, position, salary } = req.body;
        
        // Verificar si ya existe un empleado con este email
        const existingEmployee = await employeesModel.findOne({ email });
        if (existingEmployee) {
            return res.status(400).json({ message: 'Ya existe un empleado con este email' });
        }

        // Verificar si ya existe un empleado con este teléfono
        const existingPhone = await employeesModel.findOne({ phone });
        if (existingPhone) {
            return res.status(400).json({ message: 'Ya existe un empleado con este teléfono' });
        }

        const passwordHash = await bcryptjs.hash(password, 10);

        const newEmployee = new employeesModel({ 
            name, 
            email, 
            password: passwordHash, 
            phone, 
            branchId, 
            position, 
            salary 
        });
        
        await newEmployee.save();
        res.json({ message: "Employee saved" });
    } catch (error) {
        // Manejar errores de validación de Mongoose
        if (error.name === 'ValidationError') {
            const errorMessages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({ message: errorMessages.join(', ') });
        }
        
        // Manejar errores de duplicación
        if (error.code === 11000) {
            const field = Object.keys(error.keyValue)[0];
            return res.status(400).json({ 
                message: `Ya existe un empleado con este ${field === 'email' ? 'email' : 'teléfono'}` 
            });
        }
        
        res.status(500).json({ message: error.message });
    }
}

//UPDATE
employeesController.updateEmployee = async (req, res) => {
    try {
        const { name, email, password, phone, branchId, position, salary } = req.body;
        const employeeId = req.params.id;

        // Verificar si el empleado existe
        const existingEmployee = await employeesModel.findById(employeeId);
        if (!existingEmployee) {
            return res.status(404).json({ message: 'Empleado no encontrado' });
        }

        // Verificar duplicados de email (excluyendo el empleado actual)
        if (email !== existingEmployee.email) {
            const emailExists = await employeesModel.findOne({ 
                email, 
                _id: { $ne: employeeId } 
            });
            if (emailExists) {
                return res.status(400).json({ message: 'Ya existe un empleado con este email' });
            }
        }

        // Verificar duplicados de teléfono (excluyendo el empleado actual)
        if (phone !== existingEmployee.phone) {
            const phoneExists = await employeesModel.findOne({ 
                phone, 
                _id: { $ne: employeeId } 
            });
            if (phoneExists) {
                return res.status(400).json({ message: 'Ya existe un empleado con este teléfono' });
            }
        }

        // Preparar datos para actualizar
        const updateData = { name, email, phone, branchId, position, salary };

        // Solo actualizar contraseña si se proporciona una nueva
        if (password && password.trim()) {
            const passwordHash = await bcryptjs.hash(password, 10);
            updateData.password = passwordHash;
        }

        const updatedEmployee = await employeesModel.findByIdAndUpdate(
            employeeId,
            updateData,
            { new: true, runValidators: true }
        );

        res.json({ message: "Employee updated" });
    } catch (error) {
        // Manejar errores de validación de Mongoose
        if (error.name === 'ValidationError') {
            const errorMessages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({ message: errorMessages.join(', ') });
        }
        
        // Manejar errores de duplicación
        if (error.code === 11000) {
            const field = Object.keys(error.keyValue)[0];
            return res.status(400).json({ 
                message: `Ya existe un empleado con este ${field === 'email' ? 'email' : 'teléfono'}` 
            });
        }
        
        res.status(500).json({ message: error.message });
    }
}

//DELETE
employeesController.deleteEmployee = async (req, res) => {
    try {
        const employee = await employeesModel.findById(req.params.id);
        
        if (!employee) {
            return res.status(404).json({ message: 'Empleado no encontrado' });
        }

        await employeesModel.findByIdAndDelete(req.params.id);
        res.json({ message: "Employee deleted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export default employeesController;