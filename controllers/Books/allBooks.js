import { Book } from "../../models/books.model.js";
import { catchAsyncError } from "../../middlewares/catchAsyncError.js";

export const allBooks = catchAsyncError(async (req, res, next) => {
  try {
    const { page = 1, limit = 10, author, genre } = req.query;

    const filters = {};

    if (author) {
      filters.author = { $regex: author, $options: "i" }; // case-insensitive partial match
    }

    if (genre) {
      filters.genre = genre; // exact match (controlled via enum)
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [books, total] = await Promise.all([
      Book.find(filters)
        .sort({ createdAt: -1 }) // newest first
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
    next();
  }
});
