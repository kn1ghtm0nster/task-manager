// region Imports
import request from "supertest";
import express, { Request, Response, NextFunction } from "express";
import { AppError, errorHandler } from "../src/utils/errorHandler";

// endregion Imports

// region Setup

const app = express();
app.use(express.json());

// Route to simulate operational (AppError) handling
app.get(
  "/api/test-app-error",
  (req: Request, res: Response, next: NextFunction) => {
    next(new AppError("This is a test AppError", 400)); // Pass AppError to handler
  }
);

// Route to simulate non-operational (generic Error) handling
app.get(
  "/api/test-generic-error",
  (req: Request, res: Response, next: NextFunction) => {
    next(new Error("Server Error Occurred")); // Pass Error to handler
  }
);

// Attach error handler as last middleware
app.use(errorHandler);

// endregion Setup

// region Integration Tests

describe("Error Handler Tests", () => {
  // Test handling of AppError with specific status and message
  it("handles AppError and returns correct status and message", async () => {
    const response = await request(app).get("/api/test-app-error");
    expect(response.status).toBe(400);
    expect(response.body).toMatchObject({
      status: "error",
      statusCode: 400,
      message: "This is a test AppError",
    });
  });

  // Test handling of non-operational (generic Error) with default 500 status code and message
  it("handles generic errors and returns 500 status code with default message", async () => {
    const response = await request(app).get("/api/test-generic-error");
    expect(response.status).toBe(500);
    expect(response.body).toMatchObject({
      status: "error",
      statusCode: 500,
      message: "Server Error Occurred",
    });
  });
});

// endregion Integration Tests
