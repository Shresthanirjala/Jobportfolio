class ErrorHandler extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

export const errorMiddleware = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";

  // Handle Mongoose CastError (Invalid MongoDB ID)
  
  if (err.name === "CastError") {
    err = new ErrorHandler(`Invalid ${err.path}`, 400);
  }

  // Handle Duplicate Key Error (MongoDB)
  if (err.code === 11000) {
    err = new ErrorHandler(
      `Duplicate ${Object.keys(err.keyValue)} entered`,
      400
    );
  }

  // Handle JWT Errors
  if (err.name === "JsonWebTokenError") {
    err = new ErrorHandler("Invalid JSON Web Token, try again", 400);
  }

  if (err.name === "TokenExpiredError") {
    err = new ErrorHandler("JSON Web Token has expired, try again", 400);
  }

  return res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};

export default ErrorHandler;