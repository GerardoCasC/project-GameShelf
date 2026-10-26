import { AppError } from "../errors/appError.js";

const RAWG_BASE_URL = "https://api.rawg.io/api";

export interface RawgGamesResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: unknown[];
}

export interface RawgGameDetail {
  id: number;
  name: string;
  [key: string]: unknown;
}

export interface RawgFilterOption {
  id: number;
  name: string;
  slug: string;
}

export interface RawgFilterOptionsResponse {
  count: number;
  results: RawgFilterOption[];
}

export async function requestRawg(
  endpoint: string,
  params: URLSearchParams = new URLSearchParams(),
): Promise<unknown> {
  const apiKey = process.env.RAWG_API_KEY;

  if (!apiKey) {
    throw new Error("RAWG_API_KEY no está configurada");
  }

  const url = new URL(`${RAWG_BASE_URL}${endpoint}`);

  params.forEach((value, key) => {
    url.searchParams.set(key, value);
  });

  url.searchParams.set("key", apiKey);

  let response: Response;

  try {
    response = await fetch(url, {
      headers: {
        Accept: "application/json",
      },
      signal: AbortSignal.timeout(10000),
    });
  } catch {
    throw new AppError(502);
  }

  if (response.status === 404) {
    throw new AppError(404, "Recurso no encontrado en RAWG");
  }

  if (!response.ok) {
    throw new AppError(502);
  }

  try {
    return (await response.json()) as unknown;
  } catch {
    throw new AppError(502);
  }
}

export async function fetchRawgGames(
  params: URLSearchParams,
): Promise<RawgGamesResponse> {
  const data = await requestRawg("/games", params);

  if (
    !data ||
    typeof data !== "object" ||
    Array.isArray(data) ||
    !("count" in data) ||
    typeof data.count !== "number" ||
    !("results" in data) ||
    !Array.isArray(data.results)
  ) {
    throw new AppError(502);
  }

  // Reconstruir paginación sin exponer la API Key
  const safePageLink = (link: unknown): string | null => {
    if (typeof link !== "string") {
      return null;
    }

    try {
      const url = new URL(link);

      if (
        url.origin !== "https://api.rawg.io" ||
        url.pathname !== "/api/games"
      ) {
        return null;
      }

      const page = url.searchParams.get("page") ?? "1";

      if (!/^[1-9]\d*$/.test(page) || !Number.isSafeInteger(Number(page))) {
        return null;
      }

      const safeParams = new URLSearchParams(params);
      safeParams.set("page", page);

      return `/games?${safeParams.toString()}`;
    } catch {
      return null;
    }
  };

  return {
    count: data.count,
    next: safePageLink("next" in data ? data.next : null),
    previous: safePageLink("previous" in data ? data.previous : null),
    results: data.results,
  };
}

export async function fetchRawgGameById(id: number): Promise<RawgGameDetail> {
  const data = await requestRawg(`/games/${id}`);

  if (
    !data ||
    typeof data !== "object" ||
    Array.isArray(data) ||
    !("id" in data) ||
    typeof data.id !== "number" ||
    !("name" in data) ||
    typeof data.name !== "string"
  ) {
    throw new AppError(502);
  }

  return data as RawgGameDetail;
}

async function fetchRawgFilterOptions(
  endpoint: "/genres" | "/platforms",
): Promise<RawgFilterOptionsResponse> {
  const params = new URLSearchParams({
    page_size: "40",
  });

  const data = await requestRawg(endpoint, params);

  if (
    !data ||
    typeof data !== "object" ||
    Array.isArray(data) ||
    !("count" in data) ||
    typeof data.count !== "number" ||
    !("results" in data) ||
    !Array.isArray(data.results)
  ) {
    throw new AppError(502);
  }

  const results: RawgFilterOption[] = data.results.map((item: unknown) => {
    if (
      !item ||
      typeof item !== "object" ||
      !("id" in item) ||
      typeof item.id !== "number" ||
      !("name" in item) ||
      typeof item.name !== "string" ||
      !("slug" in item) ||
      typeof item.slug !== "string"
    ) {
      throw new AppError(502);
    }

    return {
      id: item.id,
      name: item.name,
      slug: item.slug,
    };
  });

  return {
    count: data.count,
    results,
  };
}

export async function fetchRawgGenres() {
  return fetchRawgFilterOptions("/genres");
}

export async function fetchRawgPlatforms() {
  return fetchRawgFilterOptions("/platforms");
}
