import express from 'express';
import watchController from '../controllers/watchesCtrl.js';

const router = express.Router();

router.route('/').get(watchController.getWatches)
    .post(watchController.insertWatches);

router.route('/:id').put(watchController.updateWatches)
    .delete(watchController.deleteWatches);

export default router;
