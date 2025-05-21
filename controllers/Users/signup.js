import { User } from "../../models/users.model.js";
import { catchAsyncError } from "../../middlewares/catchAsyncError.js";

export const signup = catchAsyncError(async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Ensuring all fields are present
    if (!name) {
      return res.status(400).json({
        success: false,
        error: {
          code: "NAME_REQUIRED",
          message: "Name is required",
        },
      });
    }
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
    if (name.length < 2 || name.length > 100) {
      return res.status(400).json({
        success: false,
        error: {
          code: "INVALID_NAME",
          message: "Name must be at least 2 characters long and should not exceed 100 characters.",
        },
      });
    }
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

    // Ensuring Email is unique
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: {
          code: "EMAIL_ALREADY_EXISTS",
          message: "A user with the provided email already exists",
        },
      });
    }

    // Hashing the password
    const hashedPassword = await User.hashPassword(password);

    const userData = {
      name,
      email,
      password: hashedPassword,
    };

    // Registering user
    const user = await User.create(userData);

    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: {
        userId: user._id,
      },
    });
  } catch (error) {
    console.error("Error signing up the user:", error);
    return res.status(500).json({
      success: false,
      error: {
        code: "SERVER_ERROR",
        message: "Something went wrong while signing up the user",
      },
    });
  }
});
