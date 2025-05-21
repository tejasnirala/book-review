import jwt from "jsonwebtoken";
import { User } from "../models/users.model.js";
import { catchAsyncError } from "./catchAsyncError.js";

export const isAuthenticated = catchAsyncError(async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // Ensuring Authorization header exists and starts with 'Bearer '
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        error: {
          code: "UNAUTHENTICATED",
          message: "Authorization token missing or malformed",
        },
      });
    }

    // Extract JWT token
    const token = authHeader.split(" ")[1];

    // Ensuring token is present
    if (!token) {
      return res.status(401).json({
        success: false,
        error: {
          code: "UNAUTHENTICATED",
          message: "User is not authenticated",
        },
      });
    }

    let decoded;

    // Verify and decode the JWT token
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      // Token is either invalid or expired
      return res.status(403).json({
        success: false,
        error: {
          code: "INVALID_TOKEN",
          message: "Token is invalid or expired",
        },
      });
    }

    const user = await User.findById(decoded.id);

    // Ensuring user with assoicated token exists
    if (!user) {
      return res.status(404).json({
        success: false,
        error: {
          code: "USER_NOT_FOUND",
          message: "User associated with this token was not found",
        },
      });
    }
    
    // Attach user object to request for downstream usage
    req.user = user;

    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: {
        code: "SERVER_ERROR",
        message: "An unexpected error occurred during authentication",
      },
    });
  }
});
