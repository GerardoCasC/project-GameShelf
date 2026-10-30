import type { RequestHandler } from "express";
import bcrypt from "bcryptjs";
import { User } from "../models/user.js";
import { AppError } from "../errors/appError.js";
import { createToken } from "../utils/jwt.js";

export const signup: RequestHandler = async (req, res) => {
  const body: unknown = req.body;

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    throw new AppError(400);
  }

  const { username, email, password } = body as Record<string, unknown>;

  if (
    typeof username !== "string" ||
    typeof email !== "string" ||
    typeof password !== "string"
  ) {
    throw new AppError(400, "Faltan campos obligatorios");
  }

  if (password.length < 8 || Buffer.byteLength(password, "utf8") > 72) {
    throw new AppError(
      400,
      "La contraseña debe tener al menos 8 caracteres y no superar 72 bytes",
    );
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const user = await User.create({
    username: username.trim(),
    email: email.trim().toLowerCase(),
    passwordHash,
  });

  res.status(201).json({
    id: user._id.toString(),
    username: user.username,
    email: user.email,
  });
};

export const signin: RequestHandler = async (req, res) => {
  const body: unknown = req.body;

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    throw new AppError(400);
  }

  const { email, password } = body as Record<string, unknown>;

  if (
    typeof email !== "string" ||
    typeof password !== "string" ||
    !email.trim() ||
    !password
  ) {
    throw new AppError(400, "Email y contraseña son obligatorios");
  }

  if (Buffer.byteLength(password, "utf8") > 72) {
    throw new AppError(401, "Credenciales incorrectas");
  }

  const user = await User.findOne({
    email: email.trim().toLowerCase(),
  }).select("+passwordHash");

  if (!user) {
    throw new AppError(401, "Credenciales incorrectas");
  }

  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

  if (!isPasswordValid) {
    throw new AppError(401, "Credenciales incorrectas");
  }

  const token = createToken(user._id.toString());

  res.status(200).json({ token });
};
