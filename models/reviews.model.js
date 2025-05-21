import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
      required: [true, "Book reference is required"],
      index: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User reference is required"],
      index: true,
    },
    rating: {
      type: Number,
      required: [true, "Rating is required"],
      min: [1, "Rating must be at least 1"],
      max: [5, "Rating cannot exceed 5"],
      validate: {
        validator: function (v) {
          return /^\d+(\.\d)?$/.test(v.toString());
        },
        message: (props) =>
          `${props.value} is not a valid rating (max 1 decimal place)`,
      },
    },
    comment: {
      type: String,
      trim: true,
      maxlength: [1000, "Review text cannot exceed 1000 characters"],
      default: "",
    },
  },
  { timestamps: true }
);

// Compound unique index to ensure one review per user per book
reviewSchema.index({ book: 1, user: 1 }, { unique: true });

// Optional: add an index on rating to speed up rating aggregation queries
reviewSchema.index({ book: 1, rating: 1 });

export const Review = mongoose.model("Review", reviewSchema);
