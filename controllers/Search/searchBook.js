import { Book } from "../../models/books.model.js";
import { catchAsyncError } from "../../middlewares/catchAsyncError.js";

export const searchBook = catchAsyncError(async (req, res, next) => {
  try {
    const { query, page = 1, limit = 10 } = req.query;

    // Ensuring query is not empty
    if (!query || query.trim() === "") {
      return res.status(400).json({
        success: false,
        error: {
          code: "INVALID_QUERY",
          message: "Search query cannot be empty",
        },
      });
    }

    // Creating the regex expression to search as case-insensitive
    const regex = new RegExp(query, "i");

    // Query is present either in 'title' or in 'author'
    const filter = {
      $or: [{ title: regex }, { author: regex }],
    };

    // Fetching all books matching the filter and counting them.
    const books = await Book.find(filter)
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Book.countDocuments(filter);

    res.status(200).json({
      success: true,
      message: `Found ${total} book(s) matching your search`,
      data: {
        books,
        total,
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error searching books:", error);
    res.status(500).json({
      success: false,
      error: {
        code: "SERVER_ERROR",
        message: "An unexpected error occurred while searching for books",
      },
    });
  }
});
