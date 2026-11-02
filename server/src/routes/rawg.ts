import { Router } from "express";
import { rateLimit } from "express-rate-limit";
import {
  getGames,
  getGameById,
  getGenres,
  getPlatforms,
} from "../controllers/rawg.js";

export const rawgRouter = Router();

const rawgLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: 60,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    error: {
      status: 429,
      message: "Demasiadas solicitudes al catálogo",
    },
  },
});

rawgRouter.use(rawgLimiter);
rawgRouter.get("/games", getGames);
rawgRouter.get("/games/:id", getGameById);
rawgRouter.get("/genres", getGenres);
rawgRouter.get("/platforms", getPlatforms);
