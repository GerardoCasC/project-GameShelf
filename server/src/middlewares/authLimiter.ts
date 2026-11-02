import { rateLimit } from "express-rate-limit";
import { AppError } from "../errors/appError.js";

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  handler: (_req, _res, next) => {
    next(new AppError(429));
  },
});
