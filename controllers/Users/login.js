import { User } from "../../models/users.model.js";
import { catchAsyncError } from "../../middlewares/catchAsyncError.js";

export const login = catchAsyncError(async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Ensuring all fields are present
    if (!email) {
      return res.status(400).json({
        success: false,
        error: {
          code: "EMAIL_REQUIRED",
          message: "Email is required",
        },
      });
    }

    if (!password) {
      return res.status(400).json({
        success: false,
        error: {
          code: "PASSWORD_REQUIRED",
          message: "Password is required",
        },
      });
    }

    // Validating inputs
    if (!/\S+@\S+\.\S+/.test(email)) {
      return res.status(400).json({
        success: false,
        error: {
          code: "INVALID_EMAIL",
          message: "Please provide a valid email address.",
        },
      });
    }

    if (password.length < 8 || password.length > 50) {
      return res.status(400).json({
        success: false,
        error: {
          code: "INVALID_PASSWORD",
          message: "Password must be at least 8 characters long and should not exceed 50 characters.",
        },
      });
    }

    // Ensuring user exists
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(404).json({
        success: false,
        error: {
          code: "USER_NOT_FOUND",
          message: "User does not exist",
        },
      });
    }

    // Validating the password
    const isMatch = await user.isValidPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: {
          code: "INVALID_PASSWORD",
          message: "Password does not match",
        },
      });
    }

    // Generating JWT token
    const token = await user.generateJWT();

    res.status(201).json({
      success: true,
      message: "User logged in successfully",
      data: {
        token
      },
    });
  } catch (error) {
    console.error("Error in user login:", error);
    return res.status(500).json({
      success: false,
      error: {
        code: "SERVER_ERROR",
        message: "Something went wrong while user login",
      },
    });
  }
});
