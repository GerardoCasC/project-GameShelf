import { Router } from "express";

import { requireAuth } from "../middlewares/auth.js";
import {
  getLibrary,
  addGameToLibrary,
  updateGameStatus,
  deleteGameFromLibrary,
} from "../controllers/library.js";

export const libraryRouter = Router();

libraryRouter.get("/", requireAuth, getLibrary);
libraryRouter.post("/", requireAuth, addGameToLibrary);
libraryRouter.patch("/:id", requireAuth, updateGameStatus);
libraryRouter.delete("/:id", requireAuth, deleteGameFromLibrary);
