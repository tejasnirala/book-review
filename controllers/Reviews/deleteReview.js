import { Review } from "../../models/reviews.model.js";
import { catchAsyncError } from "../../middlewares/catchAsyncError.js";
import mongoose from "mongoose";

export const deleteReview = catchAsyncError(async (req, res, next) => {
  try {
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
          message: "You can only delete your own review",
        },
      });
    }

    // Deleting the review
    await Review.findByIdAndDelete(reviewId);

    res.status(200).json({
      success: true,
      message: "Review deleted successfully",
      data: {}
    });
  } catch (err) {
    console.error("Error deleting review:", err);
    res.status(500).json({
      success: false,
      error: {
        code: "SERVER_ERROR",
        message: "An error occurred while deleting the review",
      },
    });
  }
});
