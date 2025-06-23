import express from 'express';
import ReviewsController from '../controllers/reviewsCtrl.js';
import { validateAuthToken } from "../middlewares/validateAuthToken.js";

const router = express.Router();

router.route("/")
    .get(ReviewsController.getReview)
    .post(validateAuthToken(["customer","admin","employee"]),ReviewsController.insertReview)

router.route("/:id")
    .put(validateAuthToken(["customer","admin","employee"]),ReviewsController.updateReview)
    .delete(validateAuthToken(["customer","admin","employee"]),ReviewsController.deleteReview)

export default router;