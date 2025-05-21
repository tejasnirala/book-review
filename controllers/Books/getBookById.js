import { Book } from "../../models/books.model.js";
import { Review } from "../../models/reviews.model.js";
import { catchAsyncError } from "../../middlewares/catchAsyncError.js";
import mongoose from "mongoose";

export const getBookById = catchAsyncError(async (req, res, next) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 5 } = req.query;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        error: {
          code: "INVALID_BOOK_ID",
          message: "Invalid book ID",
        },
      });
    }

    const book = await Book.findById(id);
    if (!book) {
      return res.status(404).json({
        success: false,
        error: {
          code: "BOOK_NOT_FOUND",
          message: "The requested book was not found in the system.",
        },
      });
    }

    // Get reviews and average rating
    const reviewsQuery = Review.find({ book: id })
      .sort({ createdAt: -1 }) // newest first
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .populate("user", "name email");

    const [reviews, totalReviews, avgRatingAgg] = await Promise.all([
      reviewsQuery,
      Review.countDocuments({ book: id }),
      Review.aggregate([
        { $match: { book: new mongoose.Types.ObjectId(id) } },
        {
          $group: {
            _id: "$book",
            averageRating: { $avg: "$rating" },
          },
        },
      ]),
    ]);

    const averageRating = avgRatingAgg.length
      ? parseFloat(avgRatingAgg[0].averageRating.toFixed(2))
      : null;

    return res.status(200).json({
      success: true,
      book,
      averageRating,
      reviews: {
        total: totalReviews,
        page: parseInt(page),
        pageSize: reviews.length,
        totalPages: Math.ceil(totalReviews / limit),
        data: reviews,
      },
    });
  } catch (error) {
    console.error("Error fetching book details:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});
