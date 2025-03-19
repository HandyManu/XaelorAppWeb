/*Este archivo tiene los métodos del CRUD
    (Select, insert, update, delete)
    */

//Creo un array de funciones 

const employeesController = {};
import employeesModel from "../models/employeesMdl.js";

//SELECT
employeesController.getEmployee = async (req, res) => {
    const employees = await employeesModel.find();
    res.json(employees);
}
//INSERT
employeesController.insertEmployee = async (req, res) => {
    const { name, email, password, phone, branchId, position, salary } = req.body;
    const newEmployee = new employeesModel({ name, email, password, phone, branchId, position, salary  });
    await newEmployee.save();
    res.json({ message: "Employee saved" });
}
//UPDATE
employeesController.updateEmployee = async (req, res) => {
    const { name, lastName, birthday, email, address, hireDate, password, telephone, dui, isssNumber, isVerified } = req.body;
    const updateEmployee = await employeesModel.findByIdAndUpdate(req.params.id,
        { name, lastName, birthday, email, address, hireDate, password, telephone, dui, isssNumber, isVerified }, { new: true });
    res.json({ message: "Employee updated" });
}

//DELETE
employeesController.deleteEmployee = async (req, res) => {
    await employeesModel.findByIdAndDelete(req.params.id);
    res.json({ message: "Employee deleted" });
}
export default employeesController;
