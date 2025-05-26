import express from 'express';
import inventoryCtrl from "../controllers/inventoryCtrl.js"

const router = express.Router();

router.route('/')
    .get(inventoryCtrl.getInventory)
    .post(inventoryCtrl.createInventory)

router.route('/:id')
    .put(inventoryCtrl.updateInventory)
    .delete(inventoryCtrl.deleteInventory)

// Ruta para agregar movimientos
router.route('/:id/movement')
    .put(inventoryCtrl.addMovement)

export default router;