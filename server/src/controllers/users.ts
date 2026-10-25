import type { RequestHandler } from "express";

import { User } from "../models/user.js";
import { AppError } from "../errors/appError.js";

export const getCurrentUser: RequestHandler = async (req, res) => {
  if (!req.userId) {
    throw new AppError(401);
  }

  const user = await User.findById(req.userId);

  if (!user) {
    throw new AppError(401, "Usuario no disponible");
  }

  res.status(200).json({
    id: user._id.toString(),
    username: user.username,
    email: user.email,
  });
};
