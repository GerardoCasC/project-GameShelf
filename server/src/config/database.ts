import dns from "node:dns";
import mongoose from "mongoose";

let connectionPromise: Promise<void> | null = null;

export async function connectDatabase(): Promise<void> {
  if (mongoose.connection.readyState === 1) return;

  if (!connectionPromise) {
    const uri = process.env.MONGODB_URI;

    if (!uri) {
      throw new Error("MONGODB_URI no está configurada");
    }

    if (process.env.NODE_ENV !== "production" && !process.env.VERCEL) {
      dns.setServers(["8.8.8.8", "8.8.4.4"]);
    }

    connectionPromise = mongoose
      .connect(uri, {
        dbName: "runaria",
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 10000,
      })
      .then(() => {
        console.log("MongoDB Atlas conectado");
      })
      .finally(() => {
        connectionPromise = null;
      });
  }

  await connectionPromise;
}
