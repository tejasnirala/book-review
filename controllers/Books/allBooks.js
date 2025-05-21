import { Book } from "../../models/books.model.js";
import { catchAsyncError } from "../../middlewares/catchAsyncError.js";

export const allBooks = catchAsyncError(async (req, res, next) => {
  try {
    const { page = 1, limit = 10, author, genre } = req.query;

    // Set filters to apply
    const filters = {};
    if (author) {
      // case-insensitive partial match
      filters.author = { $regex: author, $options: "i" };
    }
    if (genre) {
      filters.genre = genre;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Get books and total number of books
    const [books, total] = await Promise.all([
      Book.find(filters)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Book.countDocuments(filters),
    ]);

    return res.status(200).json({
      success: true,
      total,
      page: parseInt(page),
      pageSize: books.length,
      totalPages: Math.ceil(total / limit),
      data: books,
    });
  } catch (error) {
    console.error("Error fetching books:", error);
    return res.status(500).json({
      success: false,
      error: {
        code: "SERVER_ERROR",
        message: "Something went wrong while fetching books",
      },
    });
  }
});
