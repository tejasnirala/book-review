import mongoose from "mongoose";

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      minlength: [1, "Title must be at least 1 character"],
      maxlength: [200, "Title cannot exceed 200 characters"],
    },
    author: {
      type: String,
      required: [true, "Author is required"],
      trim: true,
      minlength: [1, "Author name must be at least 1 character"],
      maxlength: [100, "Author name cannot exceed 100 characters"],
    },
    genre: {
      type: String,
      required: [true, "Genre is required"],
      trim: true,
      enum: {
        values: [
          "Fiction",
          "Non-Fiction",
          "Science Fiction",
          "Fantasy",
          "Mystery",
          "Biography",
          "Romance",
          "Horror",
          "Other",
        ],
        message: "Genre must be a valid category",
      },
      default: "Other",
    },
    publishedYear: {
      type: Number,
      required: [true, "Published year is required"],
      min: [0, "Published year must be a positive number"],
      max: [new Date().getFullYear(), "Published year cannot be in the future"],
    },
  },
  { timestamps: true }
);

// Optional: create an index on title and author for search performance
bookSchema.index({ title: 1, author: 1 });

export const Book = mongoose.model("Book", bookSchema);
