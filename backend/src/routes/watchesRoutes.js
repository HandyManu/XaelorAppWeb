import express from 'express';
import watchController from '../controllers/watchesCtrl.js';
import { validateAuthToken } from '../middlewares/validateAuthToken.js';

const router = express.Router();

router.route('/')
.get(watchController.getWatches)
.post(validateAuthToken(["admin","employee"]),watchController.insertWatches);

router.route('/:id')
.put(validateAuthToken(["admin","employee"]),watchController.updateWatches)
.delete(validateAuthToken(["admin","employee"]),watchController.deleteWatches);

export default router;
