import express from 'express';
import multer from 'multer';
import watchController from '../controllers/watchesCtrl.js';
import { validateAuthToken } from '../middlewares/validateAuthToken.js';

const router = express.Router();

// Configurar carpeta local para guardar imágenes temporalmente
const upload = multer({
    dest: 'public/'
});

router.route('/')
    .get(watchController.getWatches)
    .post(upload.array("photos"), watchController.insertWatches);

router.route('/:id')
    .put(upload.array("photos"), watchController.updateWatches)
    .delete(watchController.deleteWatches);

export default router;
