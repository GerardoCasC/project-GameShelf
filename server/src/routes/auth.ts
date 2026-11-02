import { Router } from "express";
import { signup, signin } from "../controllers/auth.js";
import { authLimiter } from "../middlewares/authLimiter.js";

export const authRouter = Router();

authRouter.post("/signup", authLimiter, signup);
authRouter.post("/signin", authLimiter, signin);
