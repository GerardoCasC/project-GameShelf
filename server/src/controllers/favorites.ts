import type { RequestHandler } from "express";
import { Favorite } from "../models/favorite.js";
import { AppError } from "../errors/appError.js";
import type { IGameSnapshot } from "../models/game.js";
import { Types } from "mongoose";

export const getFavorites: RequestHandler = async (req, res) => {
  if (!req.userId) {
    throw new AppError(401);
  }

  const entries = await Favorite.find({
    owner: req.userId,
  }).sort({ createdAt: -1 });

  const favorites = entries.map((entry) => ({
    id: entry._id.toString(),
    game: entry.game,
  }));

  res.status(200).json(favorites);
};

export const addFavorite: RequestHandler = async (req, res) => {
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

  const favorite = await Favorite.create({
    owner: req.userId,
    game: gameSnapshot,
  });

  res.status(201).json({
    id: favorite._id.toString(),
    game: favorite.game,
  });
};

export const deleteFavorite: RequestHandler = async (req, res) => {
  if (!req.userId) {
    throw new AppError(401);
  }

  const { id } = req.params;

  if (typeof id !== "string" || !Types.ObjectId.isValid(id)) {
    throw new AppError(400, "ID de favorito inválido");
  }

  const favorite = await Favorite.findById(id);

  if (!favorite) {
    throw new AppError(404);
  }

  if (favorite.owner.toString() !== req.userId) {
    throw new AppError(403);
  }

  await favorite.deleteOne();

  res.sendStatus(204);
};
