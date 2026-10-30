import { Router } from "express";
import { healthRouter } from "./health.js";
import { authRouter } from "./auth.js";
import { usersRouter } from "./users.js";
import { libraryRouter } from "./library.js";
import { favoritesRouter } from "./favorites.js";
import { rawgRouter } from "./rawg.js";

export const router = Router();

router.use("/health", healthRouter);
router.use(authRouter);
router.use("/users", usersRouter);
router.use("/library", libraryRouter);
router.use("/favorites", favoritesRouter);
router.use(rawgRouter);
