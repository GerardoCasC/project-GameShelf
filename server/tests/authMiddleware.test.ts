import assert from "node:assert/strict";
import { randomBytes } from "node:crypto";
import { test } from "node:test";

import express from "express";
import jwt from "jsonwebtoken";
import { Types } from "mongoose";
import type {} from "../src/types/express.js";
import request from "supertest";

import { requireAuth } from "../src/middlewares/auth.js";
import { authLimiter } from "../src/middlewares/authLimiter.js";
import { errorHandler } from "../src/middlewares/errorHandler.js";
import { createToken } from "../src/utils/jwt.js";

// Clave temporal exclusiva para las pruebas
const testSecret = randomBytes(32).toString("hex");
process.env.JWT_SECRET = testSecret;

const userId = new Types.ObjectId().toString();

// Aplicación Express aislada para probar requireAuth
const app = express();

app.get("/private", requireAuth, (req, res) => {
  res.status(200).json({ userId: req.userId });
});

app.use(errorHandler);

test("JWT válido permite acceder", async () => {
  const token = createToken(userId);

  const response = await request(app)
    .get("/private")
    .set("Authorization", `Bearer ${token}`);

  assert.equal(response.status, 200);
  assert.equal(response.body.userId, userId);
});

test("Sin JWT devuelve 401", async () => {
  const response = await request(app).get("/private");

  assert.equal(response.status, 401);
  assert.equal(response.body.error.status, 401);
});

test("JWT inválido devuelve 401", async () => {
  const response = await request(app)
    .get("/private")
    .set("Authorization", "Bearer token-invalido");

  assert.equal(response.status, 401);
});

test("JWT expirado devuelve 401", async () => {
  const expiredToken = jwt.sign({}, testSecret, {
    algorithm: "HS256",
    subject: userId,
    expiresIn: -1,
  });

  const response = await request(app)
    .get("/private")
    .set("Authorization", `Bearer ${expiredToken}`);

  assert.equal(response.status, 401);
});

test("JWT sin sub devuelve 401", async () => {
  const token = jwt.sign({ userId }, testSecret, { algorithm: "HS256" });

  const response = await request(app)
    .get("/private")
    .set("Authorization", `Bearer ${token}`);

  assert.equal(response.status, 401);
});

test("JWT con firma incorrecta devuelve 401", async () => {
  const token = jwt.sign({}, "otra-clave-secreta", {
    algorithm: "HS256",
    subject: userId,
  });

  const response = await request(app)
    .get("/private")
    .set("Authorization", `Bearer ${token}`);

  assert.equal(response.status, 401);
});

test("El JWT contiene sub y no expone datos privados", () => {
  const token = createToken(userId);
  const payload = jwt.decode(token);

  if (!payload || typeof payload === "string") {
    throw new Error("El JWT no contiene un payload válido");
  }

  assert.equal(payload.sub, userId);
  assert.equal("_id" in payload, false);
  assert.equal("email" in payload, false);
  assert.equal("passwordHash" in payload, false);
  assert.equal(typeof payload.exp, "number");
});

test("Rate limiter devuelve 429 al superar el límite", async () => {
  const limiterApp = express();

  limiterApp.post("/signin", authLimiter, (_req, res) => {
    res.status(200).json({ ok: true });
  });

  limiterApp.use(errorHandler);

  for (let attempt = 1; attempt <= 10; attempt++) {
    const response = await request(limiterApp).post("/signin");

    assert.equal(response.status, 200);
  }

  const blockedResponse = await request(limiterApp).post("/signin");

  assert.equal(blockedResponse.status, 429);

  assert.deepEqual(blockedResponse.body, {
    error: {
      status: 429,
      message: "Demasiadas solicitudes, inténtalo más tarde",
    },
  });
});
