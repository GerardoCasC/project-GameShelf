import "dotenv/config";
import express from "express";
import cors from "cors";
import { router } from "./routes/index.js";
import { connectDatabase } from "./config/database.js";
import { AppError } from "./errors/appError.js";
import { errorHandler } from "./middlewares/errorHandler.js";

const app = express();
app.set("trust proxy", 1);

const port = Number(process.env.PORT ?? 3001);
const clientOrigin = process.env.CLIENT_ORIGIN ?? "http://localhost:5173";

app.use(cors({ origin: clientOrigin }));
app.use(express.json());
app.use(
  ["/signup", "/signin", "/users", "/library", "/favorites"],
  async (_req, _res, next) => {
    try {
      await connectDatabase();
      next();
    } catch (error) {
      next(error);
    }
  },
);
app.use(router);
app.use((_req, _res, next) => {
  next(new AppError(404));
});
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Servidor ejecutándose en http://localhost:${port}`);
});
