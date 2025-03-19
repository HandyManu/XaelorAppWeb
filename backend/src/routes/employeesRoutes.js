/*
Este archivo sirve para definir que metodos del CRUD va a tener mi ruta 
(/api/employees)
*/

import express from "express";
import employeesController from "../controllers/employeesCtrl.js";

const router = express.Router();

router.route("/")
    .get(employeesController.getEmployee)
    .post(employeesController.insertEmployee)

    router.route("/:id")
    .put(employeesController.updateEmployee)
    .delete(employeesController.deleteEmployee);
    
export default router;