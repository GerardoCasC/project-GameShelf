import type { RequestHandler } from "express";
import { AppError } from "../errors/appError.js";
import {
  fetchRawgGames,
  fetchRawgGameById,
  fetchRawgGenres,
  fetchRawgPlatforms,
} from "../services/rawg.js";

export const getGames: RequestHandler = async (req, res) => {
  const allowedParams = ["search", "page", "page_size", "genres", "platforms"];

  for (const key of Object.keys(req.query)) {
    if (!allowedParams.includes(key)) {
      throw new AppError(400, `Parámetro no permitido: ${key}`);
    }
  }

  const params = new URLSearchParams();

  const { search, page, page_size, genres, platforms } = req.query;

  if (search !== undefined) {
    if (
      typeof search !== "string" ||
      !search.trim() ||
      search.trim().length > 100
    ) {
      throw new AppError(400, "Búsqueda inválida");
    }

    params.set("search", search.trim());
  }

  if (page !== undefined) {
    if (
      typeof page !== "string" ||
      !/^[1-9]\d*$/.test(page) ||
      !Number.isSafeInteger(Number(page))
    ) {
      throw new AppError(400, "Página inválida");
    }

    params.set("page", page);
  }

  if (page_size !== undefined) {
    if (
      typeof page_size !== "string" ||
      !/^[1-9]\d*$/.test(page_size) ||
      Number(page_size) > 40
    ) {
      throw new AppError(400, "Tamaño de página inválido");
    }

    params.set("page_size", page_size);
  }

  const validateIds = (value: unknown, field: string) => {
    if (
      typeof value !== "string" ||
      !/^[1-9]\d*(,[1-9]\d*)*$/.test(value) ||
      !value.split(",").every((id) => Number.isSafeInteger(Number(id)))
    ) {
      throw new AppError(400, `${field} inválidos`);
    }

    return value;
  };

  if (genres !== undefined) {
    params.set("genres", validateIds(genres, "Géneros"));
  }

  if (platforms !== undefined) {
    params.set("platforms", validateIds(platforms, "Plataformas"));
  }

  const games = await fetchRawgGames(params);

  res.status(200).json(games);
};

export const getGameById: RequestHandler = async (req, res) => {
  const { id } = req.params;

  if (
    typeof id !== "string" ||
    !/^[1-9]\d*$/.test(id) ||
    !Number.isSafeInteger(Number(id))
  ) {
    throw new AppError(400, "ID de videojuego inválido");
  }

  const game = await fetchRawgGameById(Number(id));

  res.status(200).json(game);
};

export const getGenres: RequestHandler = async (req, res) => {
  if (Object.keys(req.query).length > 0) {
    throw new AppError(400, "Parámetros no permitidos");
  }

  const genres = await fetchRawgGenres();

  res.status(200).json(genres);
};

export const getPlatforms: RequestHandler = async (req, res) => {
  if (Object.keys(req.query).length > 0) {
    throw new AppError(400, "Parámetros no permitidos");
  }

  const platforms = await fetchRawgPlatforms();

  res.status(200).json(platforms);
};
