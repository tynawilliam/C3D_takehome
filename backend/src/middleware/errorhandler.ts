import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/AppErrors";

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ error: err.message });
  }

  console.error("Unhandled error:", err);

  res.status(500).json({
    error: "Internal Server Error",
  });
}
