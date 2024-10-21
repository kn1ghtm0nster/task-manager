import { Request, Response, NextFunction } from "express";

/**
 * Custom error class to handle application errors
 *
 * @class
 * @extends Error
 */
export class AppError extends Error {
  statusCode: number = 0;
  isOperational: boolean = false;

  /**
   * Creates an instance of `AppError`
   *
   * @param {string} message - Error message to be displayed
   * @param {number} statusCode - HTTP status code to send back with response
   */
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    // This helps capture where the error happened
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Middleware to handle errors and send consistent error responses.
 *
 * @param {AppError} err - The `AppError` object
 * @param {Request} req - The `Request` object
 * @param {Response} res - The `Response` object
 * @param {NextFunction} next - middleware function to prevent app crashing on errors
 */
export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // If the error is an instance of AppError, use its status code otherwise use 500
  const statusCode = err instanceof AppError ? err.statusCode : 500;
  const message = err.message || "Server Error Occurred";

  // send back an error response in JSON format
  res.status(statusCode).json({
    status: "error",
    statusCode,
    message,
  });

  // log the full error (for non-operational errors)
  console.error(err);
};
