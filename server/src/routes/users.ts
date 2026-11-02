import { Router } from "express";
import { requireAuth } from "../middlewares/auth.js";
import { getCurrentUser } from "../controllers/users.js";

export const usersRouter = Router();

usersRouter.get("/me", requireAuth, getCurrentUser);
