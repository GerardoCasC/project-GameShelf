import assert from "node:assert/strict";
import { test } from "node:test";
import express from "express";
import mongoose from "mongoose";
import request from "supertest";

import { AppError } from "../src/errors/appError.js";
import { errorHandler } from "../src/middlewares/errorHandler.js";

function createTestApp() {
  const app = express();

  app.use(express.json());

  // Errores controlados
  app.get("/unauthorized", () => {
    throw new AppError(401);
  });

  app.get("/forbidden", () => {
    throw new AppError(403);
  });

  // Error de validación de Mongoose
  app.get("/invalid-id", () => {
    throw new mongoose.Error.CastError("ObjectId", "invalid", "_id");
  });

  // Simulación de duplicado de MongoDB
  app.get("/duplicate", () => {
    throw Object.assign(new Error("Información interna de MongoDB"), {
      code: 11000,
    });
  });

  // Error inesperado
  app.get("/unexpected", () => {
    throw new Error("Contraseña interna secreta");
  });

  // Ruta inexistente
  app.use((_req, _res, next) => {
    next(new AppError(404));
  });

  // Manejador global
  app.use(errorHandler);

  return app;
}

const app = createTestApp();

test("401: autenticación requerida", async () => {
  const response = await request(app).get("/unauthorized");

  assert.equal(response.status, 401);
  assert.deepEqual(response.body, {
    error: {
      status: 401,
      message: "Autenticación requerida",
    },
  });
});

test("403: acceso denegado", async () => {
  const response = await request(app).get("/forbidden");

  assert.equal(response.status, 403);
  assert.equal(response.body.error.status, 403);
});

test("404: ruta inexistente", async () => {
  const response = await request(app).get("/unknown");

  assert.equal(response.status, 404);
  assert.equal(response.body.error.message, "Recurso no encontrado");
});

test("400: identificador inválido", async () => {
  const response = await request(app).get("/invalid-id");

  assert.equal(response.status, 400);
  assert.equal(response.body.error.message, "Solicitud inválida");
});

test("400: JSON mal formado", async () => {
  const response = await request(app)
    .post("/unknown")
    .set("Content-Type", "application/json")
    .send('{"username":}');

  assert.equal(response.status, 400);
  assert.equal(response.body.error.status, 400);
});

test("409: recurso duplicado", async () => {
  const response = await request(app).get("/duplicate");

  assert.equal(response.status, 409);
  assert.equal(
    response.body.error.message,
    "Conflicto con un recurso existente",
  );

  assert.doesNotMatch(response.text, /MongoDB/);
});

test("500: error inesperado sin datos sensibles", async () => {
  const response = await request(app).get("/unexpected");

  assert.equal(response.status, 500);
  assert.deepEqual(response.body, {
    error: {
      status: 500,
      message: "Error interno del servidor",
    },
  });

  assert.doesNotMatch(response.text, /secreta/);
  assert.doesNotMatch(response.text, /stack/);
});
