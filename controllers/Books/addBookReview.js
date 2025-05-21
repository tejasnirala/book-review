import { Book } from "../../models/books.model.js";
import { Review } from "../../models/reviews.model.js";
import { catchAsyncError } from "../../middlewares/catchAsyncError.js";
import mongoose from "mongoose";

export const addBookReview = catchAsyncError(async (req, res, next) => {
  const bookId = req.params.id;
  const userId = req.user._id;
  const { rating, comment } = req.body;

  // Validate input
  if (!rating || typeof rating !== "number" || rating < 1 || rating > 5) {
    return res.status(400).json({
      success: false,
      error: {
        code: "INVALID_RATING",
        message: "Rating must be a number between 1 and 5",
      },
    });
  }

  try {
    if (!mongoose.Types.ObjectId.isValid(bookId)) {
      return res.status(400).json({
        success: false,
        error: {
          code: "INVALID_BOOK_ID",
          message: "Invalid book ID",
        },
      });
    }

    // Check if the book exists
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({
        success: false,
        error: {
          code: "BOOK_NOT_FOUND",
          message: "Book not found",
        },
      });
    }

    // Check if user has already submitted a review for this book
    const existingReview = await Review.findOne({ book: bookId, user: userId });
    if (existingReview) {
      return res.status(409).json({
        success: false,
        error: {
          code: "REVIEW_ALREADY_EXISTS",
          message: "You have already reviewed this book",
        },
      });
    }

    // Add the review
    const review = await Review.create({
      book: bookId,
      user: userId,
      rating,
      comment,
    });

    return res.status(201).json({
      success: true,
      message: "Review submitted successfully",
      data: review,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      error: {
        code: "SERVER_ERROR",
        message: "Something went wrong while submitting the review",
      },
    });
  }
});
