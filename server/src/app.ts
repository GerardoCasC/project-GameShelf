import "dotenv/config";
import express from "express";
import cors from "cors";
import { router } from "./routes/index.js";

const app = express();

const port = Number(process.env.PORT ?? 3001);
const clientOrigin = process.env.CLIENT_ORIGIN ?? "http://localhost:5173";

app.use(cors({ origin: clientOrigin }));
app.use(express.json());
app.use(router);

app.listen(port, () => {
  console.log(`Servidor ejecutándose en http://localhost:${port}`);
});
