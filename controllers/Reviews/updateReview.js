import { Review } from "../../models/reviews.model.js";
import { catchAsyncError } from "../../middlewares/catchAsyncError.js";
import mongoose from "mongoose";

export const updateReview = catchAsyncError(async (req, res, next) => {
  try {
    const { rating, comment } = req.body;
    const reviewId = req.params.id;
    const userId = req.user._id;

    // Ensuring reviewId is a valid mongodb ObjectId
    if (!mongoose.Types.ObjectId.isValid(reviewId)) {
      return res.status(400).json({
        success: false,
        error: {
          code: "INVALID_REVIEW_ID",
          message: "Invalid review ID",
        },
      });
    }

    // Ensuring review exists
    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({
        success: false,
        error: {
          code: "REVIEW_NOT_FOUND",
          message: "Review not found",
        },
      });
    }

    // Ensuring review is of the user itself
    if (review.user.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        error: {
          code: "FORBIDDEN",
          message: "You can only update your own review",
        },
      });
    }

    // Updating the necessary fields and saving the record
    review.rating = rating ?? review.rating;
    review.comment = comment ?? review.comment;
    await review.save();

    res.status(200).json({
      success: true,
      message: "Review update successfully",
      data: review,
    });
  } catch (err) {
    console.error("Error updating review:", err);
    res.status(500).json({
      success: false,
      error: {
        code: "SERVER_ERROR",
        message: "An error occurred while updating the review",
      },
    });
  }
});
