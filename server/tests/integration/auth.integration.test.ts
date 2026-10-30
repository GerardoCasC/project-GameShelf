import "dotenv/config";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import dns from "node:dns";
import { test } from "node:test";

import express from "express";
import mongoose from "mongoose";
import request from "supertest";

import { authRouter } from "../../src/routes/auth.js";
import { usersRouter } from "../../src/routes/users.js";
import { errorHandler } from "../../src/middlewares/errorHandler.js";
import { User } from "../../src/models/user.js";

test("Registro, login y perfil", async (t) => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error("MONGODB_URI no está configurada");
  }

  dns.setServers(["8.8.8.8", "8.8.4.4"]);

  await mongoose.connect(uri, {
    dbName: "runaria_test",
    serverSelectionTimeoutMS: 10000,
  });

  const id = randomUUID().replaceAll("-", "").slice(0, 12);

  const credentials = {
    username: `user_${id}`,
    email: `test_${id}@example.com`,
    password: "SecurePassword123!",
  };

  let createdUserId: string | undefined;

  const app = express();

  app.use(express.json());
  app.use(authRouter);
  app.use("/users", usersRouter);
  app.use(errorHandler);

  try {
    // 1. Registro
    await t.test("POST /signup registra un usuario", async () => {
      const response = await request(app).post("/signup").send(credentials);

      assert.equal(response.status, 201);
      assert.equal(response.body.email, credentials.email);
      assert.equal(response.body.username, credentials.username);

      assert.equal("password" in response.body, false);
      assert.equal("passwordHash" in response.body, false);

      createdUserId = response.body.id;
    });

    // 2. Comprobar almacenamiento de contraseña
    await t.test("La contraseña se almacena como hash", async () => {
      const user = await User.findById(createdUserId).select("+passwordHash");

      assert.ok(user);
      assert.notEqual(user.passwordHash, credentials.password);
      assert.ok(user.passwordHash.startsWith("$2"));
    });

    // 3. Correo duplicado
    await t.test("Registro duplicado devuelve 409", async () => {
      const response = await request(app)
        .post("/signup")
        .send({
          ...credentials,
          username: `other_${id}`,
        });

      assert.equal(response.status, 409);
    });

    // 4. Inicio de sesión
    let token = "";

    await t.test("POST /signin devuelve un JWT", async () => {
      const response = await request(app).post("/signin").send({
        email: credentials.email,
        password: credentials.password,
      });

      assert.equal(response.status, 200);
      assert.equal(typeof response.body.token, "string");

      token = response.body.token;
    });

    // 5. Contraseña incorrecta
    await t.test("Credenciales incorrectas devuelven 401", async () => {
      const response = await request(app).post("/signin").send({
        email: credentials.email,
        password: "WrongPassword123!",
      });

      assert.equal(response.status, 401);
    });

    // 6. Perfil autenticado
    await t.test("GET /users/me devuelve el perfil", async () => {
      const response = await request(app)
        .get("/users/me")
        .set("Authorization", `Bearer ${token}`);

      assert.equal(response.status, 200);
      assert.equal(response.body.id, createdUserId);
      assert.equal(response.body.email, credentials.email);

      assert.equal("passwordHash" in response.body, false);
    });

    // 7. Perfil sin token
    await t.test("GET /users/me sin token devuelve 401", async () => {
      const response = await request(app).get("/users/me");

      assert.equal(response.status, 401);
    });
  } finally {
    if (createdUserId) {
      await User.deleteOne({ _id: createdUserId });
    }

    await mongoose.disconnect();
  }
});
