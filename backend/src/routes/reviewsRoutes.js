import express from 'express';
import ReviewsController from '../controllers/reviewsCtrl.js';

const router = express.Router();

router.route("/")
    .get(ReviewsController.getReview)
    .post(ReviewsController.insertReview)

router.route("/:id")
    .put(ReviewsController.updateReview)
    .delete(ReviewsController.deleteReview)

export default router;