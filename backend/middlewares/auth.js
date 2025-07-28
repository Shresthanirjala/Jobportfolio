import ErrorHandler from "./error.js";
import jwt from "jsonwebtoken";
import { User } from "../models/userSchema.js";
import { catchAsyncError } from "./catchAsyncError.js";

export const isAuthenticated = catchAsyncError(async (req, res, next) => {
  // Extract token from Authorization header
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return next(
      new ErrorHandler("User is not authenticated. Token is missing.", 400)
    );
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    // Fetch user from the database
    const user = await User.findById(decoded.id);

    if (!user) {
      return next(
        new ErrorHandler("User not found. Authentication failed.", 404)
      );
    }

    req.user = user; // Attach user to request object
    next(); // Proceed to the next middleware
  } catch (error) {
    return next(new ErrorHandler("Invalid or expired token.", 401));
  }
});

// Middleware to check if the user is authorized
export const isAuthorized = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHandler(
          `${req.user.role} is not authorized to access this resource.`,
          403
        )
      );
    }
    next(); // Proceed to the next middleware
  };
};
