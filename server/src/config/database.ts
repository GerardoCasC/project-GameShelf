import dns from "node:dns";
import mongoose from "mongoose";

export async function connectDatabase(): Promise<void> {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error("MONGODB_URI no está configurada");
  }

  dns.setServers(["8.8.8.8", "8.8.4.4"]);

  await mongoose.connect(uri, {
    dbName: "runaria",
    maxPoolSize: 10,
  });

  console.log("MongoDB Atlas conectado");
}
