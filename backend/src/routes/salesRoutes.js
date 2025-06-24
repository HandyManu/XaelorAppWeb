/*
Este archivo sirve para definir que metodos del CRUD va a tener mi ruta 
(/api/sales)
*/

import express from 'express';
import salesController from '../controllers/salesCtrl.js';
import { validateAuthToken } from '../middlewares/validateAuthToken.js';

const router = express.Router();

router.route("/")
    .get(validateAuthToken(["admin","employee"]), salesController.getSales)
    .post(salesController.insertSale)

router.route("/:id")
    .put(validateAuthToken(["admin","employee"]),salesController.updateSale)
    .delete(validateAuthToken(["admin","employee"]),salesController.deleteSale)

router.route("/customer/:id")
    .get(salesController.getSalesByCustomerId);

export default router;

