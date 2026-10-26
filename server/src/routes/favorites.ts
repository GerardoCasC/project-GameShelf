import { Router } from "express";

import { requireAuth } from "../middlewares/auth.js";
import {
  getFavorites,
  addFavorite,
  deleteFavorite,
} from "../controllers/favorites.js";

export const favoritesRouter = Router();

favoritesRouter.get("/", requireAuth, getFavorites);
favoritesRouter.post("/", requireAuth, addFavorite);
favoritesRouter.delete("/:id", requireAuth, deleteFavorite);
