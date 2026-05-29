import type { ErrorRequestHandler } from "express";
import { ZodError } from "zod";

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  if (error instanceof ZodError) {
    res.status(400).json({
      message: "Validation failed",
      errors: error.flatten().fieldErrors
    });
    return;
  }

  const statusCode = typeof error.statusCode === "number" ? error.statusCode : 500;

  res.status(statusCode).json({
    message: error.message || "Internal server error"
  });
};
