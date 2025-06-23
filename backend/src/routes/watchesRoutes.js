import express from 'express';
import multer from 'multer';
import watchController from '../controllers/watchesCtrl.js';

const router = express.Router();

// Configurar carpeta local para guardar imágenes temporalmente
const upload = multer({
    dest: 'public/'
});

router.route('/')
    .get(watchController.getWatches)
    .post(upload.array('photos'), watchController.insertWatches); // Sin validateAuthToken

router.route('/:id')
    .put(upload.array('photos'), watchController.updateWatches) // Sin validateAuthToken
    .delete(watchController.deleteWatches); // Sin validateAuthToken

export default router;