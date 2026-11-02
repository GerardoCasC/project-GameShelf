import type { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { Types } from "mongoose";
import { AppError } from "../errors/appError.js";
import { getJwtSecret } from "../utils/jwt.js";

export const requireAuth: RequestHandler = (req, _res, next) => {
  const authorization = req.headers.authorization;

  if (!authorization?.startsWith("Bearer ")) {
    throw new AppError(401);
  }

  const token = authorization.slice(7).trim();

  if (!token || token.includes(" ")) {
    throw new AppError(401);
  }

  let payload: string | jwt.JwtPayload;

  try {
    payload = jwt.verify(token, getJwtSecret(), {
      algorithms: ["HS256"],
    });
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      throw new AppError(401, "Token inválido o expirado");
    }

    throw error;
  }

  if (
    typeof payload === "string" ||
    typeof payload.sub !== "string" ||
    !Types.ObjectId.isValid(payload.sub)
  ) {
    throw new AppError(401, "Token inválido");
  }

  req.userId = payload.sub;

  next();
};
