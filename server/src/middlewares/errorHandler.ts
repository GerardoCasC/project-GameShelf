import type { ErrorRequestHandler } from "express";
import mongoose from "mongoose";
import { AppError, ERROR_MESSAGES } from "../errors/appError.js";
import type { HttpStatus } from "../errors/appError.js";

interface ApiErrorResponse {
  error: {
    status: number;
    message: string;
  };
}

function isDuplicateKeyError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === 11000
  );
}

function isInvalidJson(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "type" in error &&
    error.type === "entity.parse.failed"
  );
}

function normalizeError(error: unknown): {
  status: HttpStatus;
  message: string;
} {
  if (error instanceof AppError) {
    return {
      status: error.statusCode,
      message: error.message,
    };
  }

  if (
    error instanceof mongoose.Error.ValidationError ||
    error instanceof mongoose.Error.CastError ||
    isInvalidJson(error)
  ) {
    return {
      status: 400,
      message: ERROR_MESSAGES[400],
    };
  }

  if (isDuplicateKeyError(error)) {
    return {
      status: 409,
      message: ERROR_MESSAGES[409],
    };
  }

  return {
    status: 500,
    message: ERROR_MESSAGES[500],
  };
}

export const errorHandler: ErrorRequestHandler = (
  error: unknown,
  _req,
  res,
  next,
) => {
  if (res.headersSent) {
    next(error);
    return;
  }

  const { status, message } = normalizeError(error);

  const response: ApiErrorResponse = {
    error: {
      status,
      message,
    },
  };

  res.status(status).json(response);
};
