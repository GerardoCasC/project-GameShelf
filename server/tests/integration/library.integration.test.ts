import "dotenv/config";
import assert from "node:assert/strict";
import { randomBytes, randomUUID } from "node:crypto";
import dns from "node:dns";
import { test } from "node:test";

import bcrypt from "bcryptjs";
import express from "express";
import mongoose from "mongoose";
import request from "supertest";

import { User } from "../../src/models/user.js";
import { LibraryEntry } from "../../src/models/libraryEntry.js";
import { Favorite } from "../../src/models/favorite.js";
import { libraryRouter } from "../../src/routes/library.js";
import { errorHandler } from "../../src/middlewares/errorHandler.js";
import { createToken } from "../../src/utils/jwt.js";

// Clave exclusiva de este proceso de pruebas.
process.env.JWT_SECRET = randomBytes(32).toString("hex");

test("API de biblioteca: usuarios, estados y eliminación", async (t) => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error("MONGODB_URI no está configurada");
  }

  dns.setServers(["8.8.8.8", "8.8.4.4"]);

  const app = express();

  app.use(express.json());
  app.use("/library", libraryRouter);
  app.use(errorHandler);

  const suffix = randomUUID().replaceAll("-", "").slice(0, 12);

  const game = {
    id: 326243,
    name: "Elden Ring",
    background_image: null,
    rating: 4.5,
  };

  const userIds: string[] = [];

  await mongoose.connect(uri, {
    dbName: "runaria_test",
    serverSelectionTimeoutMS: 10000,
  });

  try {
    // Protección contra operaciones en otra base de datos.
    assert.equal(mongoose.connection.db?.databaseName, "runaria_test");

    await Promise.all([User.init(), LibraryEntry.init(), Favorite.init()]);

    const passwordHash = await bcrypt.hash("TestPassword123!", 10);

    const userA = await User.create({
      username: `usera_${suffix}`,
      email: `usera_${suffix}@example.com`,
      passwordHash,
    });

    userIds.push(userA._id.toString());

    const userB = await User.create({
      username: `userb_${suffix}`,
      email: `userb_${suffix}@example.com`,
      passwordHash,
    });

    userIds.push(userB._id.toString());

    const tokenA = createToken(userA._id.toString());
    const tokenB = createToken(userB._id.toString());

    const auth = (token: string) => ({
      Authorization: `Bearer ${token}`,
    });

    let entryId = "";

    await t.test("Agregar y evitar duplicados", async () => {
      const response = await request(app)
        .post("/library")
        .set(auth(tokenA))
        .send({
          game,
          owner: userB._id.toString(),
        });

      assert.equal(response.status, 201);
      assert.equal(response.body.status, "pending");
      assert.equal(response.body.game.id, game.id);

      entryId = response.body.id;

      const savedEntry = await LibraryEntry.findById(entryId);

      assert.ok(savedEntry);
      assert.equal(savedEntry.owner.toString(), userA._id.toString());

      const duplicate = await request(app)
        .post("/library")
        .set(auth(tokenA))
        .send({ game });

      assert.equal(duplicate.status, 409);
    });

    await t.test("Aislamiento entre usuarios", async () => {
      const emptyLibrary = await request(app).get("/library").set(auth(tokenB));

      assert.equal(emptyLibrary.status, 200);
      assert.equal(emptyLibrary.body.length, 0);

      // Otro usuario sí puede guardar el mismo videojuego.
      const response = await request(app)
        .post("/library")
        .set(auth(tokenB))
        .send({ game });

      assert.equal(response.status, 201);

      const libraryA = await request(app).get("/library").set(auth(tokenA));

      const libraryB = await request(app).get("/library").set(auth(tokenB));

      assert.equal(libraryA.body.length, 1);
      assert.equal(libraryB.body.length, 1);

      assert.notEqual(libraryA.body[0].id, libraryB.body[0].id);
    });

    await t.test("Actualizar estados y proteger registros", async () => {
      const updated = await request(app)
        .patch(`/library/${entryId}`)
        .set(auth(tokenA))
        .send({ status: "playing" });

      assert.equal(updated.status, 200);
      assert.equal(updated.body.status, "playing");

      const invalid = await request(app)
        .patch(`/library/${entryId}`)
        .set(auth(tokenA))
        .send({ status: "paused" });

      assert.equal(invalid.status, 400);

      const forbidden = await request(app)
        .patch(`/library/${entryId}`)
        .set(auth(tokenB))
        .send({ status: "completed" });

      assert.equal(forbidden.status, 403);

      const invalidId = await request(app)
        .patch("/library/invalid-id")
        .set(auth(tokenA))
        .send({ status: "completed" });

      assert.equal(invalidId.status, 400);

      const notFound = await request(app)
        .patch("/library/000000000000000000000000")
        .set(auth(tokenA))
        .send({ status: "completed" });

      assert.equal(notFound.status, 404);
    });

    await t.test("Rutas privadas requieren JWT", async () => {
      const response = await request(app).get("/library");

      assert.equal(response.status, 401);
    });
  } finally {
    try {
      if (userIds.length > 0) {
        const owners = { $in: userIds };

        await LibraryEntry.deleteMany({ owner: owners });
        await Favorite.deleteMany({ owner: owners });
        await User.deleteMany({ _id: owners });
      }
    } finally {
      await mongoose.disconnect();
    }
  }
});
