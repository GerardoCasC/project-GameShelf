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
import { Favorite } from "../../src/models/favorite.js";
import { favoritesRouter } from "../../src/routes/favorites.js";
import { errorHandler } from "../../src/middlewares/errorHandler.js";
import { createToken } from "../../src/utils/jwt.js";

// Clave temporal para las pruebas
process.env.JWT_SECRET = randomBytes(32).toString("hex");

test("API de favoritos: CRUD y permisos", async (t) => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error("MONGODB_URI no está configurada");
  }

  dns.setServers(["8.8.8.8", "8.8.4.4"]);

  const app = express();

  app.use(express.json());
  app.use("/favorites", favoritesRouter);
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
    assert.equal(mongoose.connection.db?.databaseName, "runaria_test");

    await Promise.all([User.init(), Favorite.init()]);

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

    let favoriteId = "";

    await t.test("Agregar favorito y evitar duplicados", async () => {
      const response = await request(app)
        .post("/favorites")
        .set(auth(tokenA))
        .send({ game });

      assert.equal(response.status, 201);
      assert.equal(response.body.game.id, game.id);

      favoriteId = response.body.id;

      const saved = await Favorite.findById(favoriteId);

      assert.ok(saved);
      assert.equal(saved.owner.toString(), userA._id.toString());

      const duplicate = await request(app)
        .post("/favorites")
        .set(auth(tokenA))
        .send({ game });

      assert.equal(duplicate.status, 409);
    });

    await t.test("Aislamiento entre usuarios", async () => {
      const emptyFavorites = await request(app)
        .get("/favorites")
        .set(auth(tokenB));

      assert.equal(emptyFavorites.status, 200);
      assert.equal(emptyFavorites.body.length, 0);

      // Ambos usuarios pueden marcar el mismo juego
      const response = await request(app)
        .post("/favorites")
        .set(auth(tokenB))
        .send({ game });

      assert.equal(response.status, 201);

      const favoritesA = await request(app).get("/favorites").set(auth(tokenA));

      const favoritesB = await request(app).get("/favorites").set(auth(tokenB));

      assert.equal(favoritesA.body.length, 1);
      assert.equal(favoritesB.body.length, 1);

      assert.notEqual(favoritesA.body[0].id, favoritesB.body[0].id);
    });

    await t.test("Validación y autenticación", async () => {
      const invalid = await request(app)
        .post("/favorites")
        .set(auth(tokenA))
        .send({
          game: {
            id: -1,
            name: "",
          },
        });

      assert.equal(invalid.status, 400);

      const unauthorized = await request(app).get("/favorites");

      assert.equal(unauthorized.status, 401);
    });

    await t.test("Eliminar favorito y verificar permisos", async () => {
      // El usuario B no puede eliminar un favorito de A
      const forbidden = await request(app)
        .delete(`/favorites/${favoriteId}`)
        .set(auth(tokenB));

      assert.equal(forbidden.status, 403);

      // El usuario A puede eliminarlo
      const deleted = await request(app)
        .delete(`/favorites/${favoriteId}`)
        .set(auth(tokenA));

      assert.equal(deleted.status, 204);

      // El favorito ya no existe
      const removedFavorite = await Favorite.findById(favoriteId);

      assert.equal(removedFavorite, null);

      // Intentar eliminarlo nuevamente devuelve 404
      const notFound = await request(app)
        .delete(`/favorites/${favoriteId}`)
        .set(auth(tokenA));

      assert.equal(notFound.status, 404);

      // El favorito del usuario B permanece
      const favoritesB = await request(app).get("/favorites").set(auth(tokenB));

      assert.equal(favoritesB.body.length, 1);
    });
  } finally {
    try {
      if (userIds.length > 0) {
        const owners = { $in: userIds };

        await Favorite.deleteMany({ owner: owners });
        await User.deleteMany({ _id: owners });
      }
    } finally {
      await mongoose.disconnect();
    }
  }
});
