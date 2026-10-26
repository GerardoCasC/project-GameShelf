import assert from "node:assert/strict";
import { test } from "node:test";

import express from "express";
import request from "supertest";

import { rawgRouter } from "../src/routes/rawg.js";
import { errorHandler } from "../src/middlewares/errorHandler.js";

const app = express();

app.use(rawgRouter);
app.use(errorHandler);

test("API RAWG: endpoints y validaciones", async (t) => {
  const originalFetch = globalThis.fetch;
  const originalKey = process.env.RAWG_API_KEY;

  process.env.RAWG_API_KEY = "test-key";

  try {
    // GET /games
    await t.test("Consultar catálogo", async () => {
      let requestedUrl = "";

      globalThis.fetch = async (input) => {
        requestedUrl = String(input);

        return Response.json({
          count: 1,
          next: "https://api.rawg.io/api/games?page=2&key=test-key",
          previous: null,
          results: [{ id: 326243, name: "Elden Ring" }],
        });
      };

      const response = await request(app)
        .get("/games")
        .query({ search: "elden", page: 1 });

      assert.equal(response.status, 200);
      assert.equal(response.body.results[0].name, "Elden Ring");

      // Verificar que RAWG recibe la clave
      const url = new URL(requestedUrl);

      assert.equal(url.searchParams.get("key"), "test-key");

      // Verificar que el cliente NO recibe la clave
      assert.equal(response.text.includes("test-key"), false);
      assert.ok(response.body.next.startsWith("/games?"));
    });

    // GET /games/:id
    await t.test("Consultar detalles", async () => {
      globalThis.fetch = async () =>
        Response.json({
          id: 326243,
          name: "Elden Ring",
        });

      const response = await request(app).get("/games/326243");

      assert.equal(response.status, 200);
      assert.equal(response.body.id, 326243);
    });

    // GET /genres y GET /platforms
    await t.test("Consultar filtros", async () => {
      globalThis.fetch = async (input) => {
        const url = new URL(String(input));

        const name = url.pathname === "/api/genres" ? "Action" : "PC";

        return Response.json({
          count: 1,
          results: [{ id: 4, name, slug: name.toLowerCase() }],
        });
      };

      const genres = await request(app).get("/genres");
      const platforms = await request(app).get("/platforms");

      assert.equal(genres.status, 200);
      assert.equal(genres.body.results[0].name, "Action");

      assert.equal(platforms.status, 200);
      assert.equal(platforms.body.results[0].name, "PC");
    });

    // Parámetros inválidos
    await t.test("Rechazar parámetros inválidos", async () => {
      const paths = [
        "/games?page=-1",
        "/games?page_size=100",
        "/games?key=123",
        "/games/abc",
        "/genres?page=2",
      ];

      for (const path of paths) {
        const response = await request(app).get(path);

        assert.equal(response.status, 400, path);
      }
    });

    // Error del proveedor
    await t.test("Gestionar errores de RAWG", async () => {
      globalThis.fetch = async () => {
        throw new Error("Error de conexión");
      };

      const response = await request(app).get("/games");

      assert.equal(response.status, 502);
    });
  } finally {
    // Restaurar el fetch original
    globalThis.fetch = originalFetch;

    if (originalKey === undefined) {
      delete process.env.RAWG_API_KEY;
    } else {
      process.env.RAWG_API_KEY = originalKey;
    }
  }
});
