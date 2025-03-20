const ReviewsController = {};

import ReviewModel from "../models/reviewsMdl.js";

// SELECT
ReviewsController.getReview = async (req, res) => {
  const review = await ReviewModel.find().populate("watchId").populate("customerId");
  res.json(review);
};

// INSERT
ReviewsController.insertReview = async (req, res) => {
  const { watchId , customerId , message , rating , date } = req.body;
  const newReview = new branchModel({ watchId , customerId , message , rating , date});
  await newReview.save();
  res.json({ message: "Review saved" });
};s

// DELETE
ReviewsController.deleteReview = async (req, res) => {
  await ReviewModel.findByIdAndDelete(req.params.id);
  res.json({ message: "Review deleted" });
};

// UPDATE
ReviewsController.updateReview = async (req, res) => {
  const { watchId , customerId , message , rating , date } = req.body;
  const updateReview = await ReviewModel.findByIdAndUpdate(
    req.params.id,
    { watchId , customerId , message , rating , date},
    { new: true }
  );
  res.json({ message: "Review updated successfully" });
};


export default ReviewsController;