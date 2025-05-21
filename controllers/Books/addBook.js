import { Book } from "../../models/books.model.js";
import { catchAsyncError } from "../../middlewares/catchAsyncError.js";

export const addBook = catchAsyncError(async (req, res, next) => {
  try {
    const { title, author, genre, publishedYear } = req.body;

    // Ensuring all fields are present
    if (!title) {
      return res.status(400).json({
        success: false,
        error: {
          code: "TITLE_REQUIRED",
          message: "Title is required",
        },
      });
    }
    if (!author) {
      return res.status(400).json({
        success: false,
        error: {
          code: "AUTHOR_REQUIRED",
          message: "Author is required",
        },
      });
    }
    if (!genre) {
      return res.status(400).json({
        success: false,
        error: {
          code: "GENRE_REQUIRED",
          message: "Genre is required",
        },
      });
    }
    if (!publishedYear) {
      return res.status(400).json({
        success: false,
        error: {
          code: "PUBLISHED_YEAR_REQUIRED",
          message: "Published year is required",
        },
      });
    }

    // Ensuring if book is already added
    const existingBook = await Book.find({ title });
    if (existingBook) {
      return res.status(409).json({
        success: false,
        error: {
          code: "BOOK_ALREADY_EXISTS",
          message: "Book is already added",
        },
      });
    }

    // Add book in the books collection
    const newBook = await Book.create({
      title,
      author,
      genre,
      publishedYear,
    });

    res.status(201).json({
      success: true,
      message: "Book added successfully",
      data: {
        newBook,
      },
    });
  } catch (error) {
    console.error("Error adding the book:", error);
    return res.status(500).json({
      success: false,
      error: {
        code: "SERVER_ERROR",
        message: "Something went wrong while adding the book",
      },
    });
  }
});
