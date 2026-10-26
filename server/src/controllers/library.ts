import type { RequestHandler } from "express";
import { LibraryEntry } from "../models/libraryEntry.js";
import { AppError } from "../errors/appError.js";
import type { IGameSnapshot } from "../models/game.js";
import { Types } from "mongoose";

export const getLibrary: RequestHandler = async (req, res) => {
  if (!req.userId) {
    throw new AppError(401);
  }

  const entries = await LibraryEntry.find({
    owner: req.userId,
  }).sort({ createdAt: -1 });

  const library = entries.map((entry) => ({
    id: entry._id.toString(),
    game: entry.game,
    status: entry.status,
  }));

  res.status(200).json(library);
};

export const addGameToLibrary: RequestHandler = async (req, res) => {
  if (!req.userId) {
    throw new AppError(401);
  }

  const body: unknown = req.body;

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    throw new AppError(400);
  }

  const { game } = body as Record<string, unknown>;

  if (!game || typeof game !== "object" || Array.isArray(game)) {
    throw new AppError(400, "Datos del videojuego inválidos");
  }

  const data = game as Record<string, unknown>;
  const { id, name } = data;

  if (
    typeof id !== "number" ||
    !Number.isSafeInteger(id) ||
    id < 1 ||
    typeof name !== "string" ||
    !name.trim()
  ) {
    throw new AppError(400, "ID o nombre del videojuego inválidos");
  }

  const gameSnapshot = {
    id,
    name: name.trim(),
    background_image: data.background_image ?? null,
    released: data.released,
    rating: data.rating,
    genres: data.genres,
  } as IGameSnapshot;

  const entry = await LibraryEntry.create({
    owner: req.userId,
    game: gameSnapshot,
    status: "pending",
  });

  res.status(201).json({
    id: entry._id.toString(),
    game: entry.game,
    status: entry.status,
  });
};

export const updateGameStatus: RequestHandler = async (req, res) => {
  if (!req.userId) {
    throw new AppError(401);
  }

  const { id } = req.params;

  if (typeof id !== "string" || !Types.ObjectId.isValid(id)) {
    throw new AppError(400, "ID inválido");
  }

  const body: unknown = req.body;

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    throw new AppError(400);
  }

  const data = body as Record<string, unknown>;
  const { status } = data;

  if (
    Object.keys(data).length !== 1 ||
    (status !== "pending" &&
      status !== "playing" &&
      status !== "completed" &&
      status !== "abandoned")
  ) {
    throw new AppError(400, "Estado inválido o campos no permitidos");
  }

  const entry = await LibraryEntry.findById(id);

  if (!entry) {
    throw new AppError(404);
  }

  if (entry.owner.toString() !== req.userId) {
    throw new AppError(403);
  }

  entry.status = status;

  await entry.save();

  res.status(200).json({
    id: entry._id.toString(),
    game: entry.game,
    status: entry.status,
  });
};

export const deleteGameFromLibrary: RequestHandler = async (req, res) => {
  if (!req.userId) {
    throw new AppError(401);
  }

  const { id } = req.params;

  if (typeof id !== "string" || !Types.ObjectId.isValid(id)) {
    throw new AppError(400, "ID de biblioteca inválido");
  }

  const entry = await LibraryEntry.findById(id);

  if (!entry) {
    throw new AppError(404);
  }

  if (entry.owner.toString() !== req.userId) {
    throw new AppError(403);
  }

  await entry.deleteOne();

  res.sendStatus(204);
};
