/*
Este archivo sirve para definir que metodos del CRUD va a tener mi ruta 
(/api/sales)
*/

import express from 'express';
import salesController from '../controllers/salesCtrl.js';

const router = express.Router();

router.route("/")
    .get(salesController.getSales)
    .post(salesController.insertSale)

router.route("/:id")
    .put(salesController.updateSale)
    .delete(salesController.deleteSale)

export default router;

