import { rawgConfig } from "../config/rawg";
import type { RawgGamesParams, RawgGamesResponse } from "../types/rawg";
import type { GameDetail } from "../types/game";

export class RawgApi {
  private baseUrl: string;
  private apiKey: string;
  private headers: Record<string, string> = {};

  constructor(
    baseUrl: string,
    apiKey: string,
    headers: Record<string, string> = {},
  ) {
    this.baseUrl = baseUrl;
    this.headers = headers;
    this.apiKey = apiKey;
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorText = await response.text();

      throw new Error(
        `API Error: ${response.status} ${response.statusText} - ${errorText}`,
      );
    }

    return (await response.json()) as T;
  }

  private async request(
    endpoint: string,
    params: URLSearchParams = new URLSearchParams(),
  ): Promise<Response> {
    if (!this.apiKey) {
      throw new Error("Falta configurar la API Key de RAWG");
    }

    const url = new URL(this.baseUrl + endpoint);
    const searchParams = new URLSearchParams(params);

    searchParams.forEach((value, key) => {
      url.searchParams.set(key, value);
    });

    url.searchParams.set("key", this.apiKey);

    return fetch(url.toString(), {
      method: "GET",
      headers: this.headers,
    });
  }

  public async getGames(
    params: RawgGamesParams = {},
  ): Promise<RawgGamesResponse> {
    const searchParams = new URLSearchParams();

    if (params.search) {
      searchParams.set("search", params.search);
    }

    if (params.page !== undefined) {
      searchParams.set("page", String(params.page));
    }

    if (params.page_size !== undefined) {
      searchParams.set("page_size", String(params.page_size));
    }

    const response = await this.request("/games", searchParams);

    return this.handleResponse<RawgGamesResponse>(response);
  }

  public async getGameById(id: number): Promise<GameDetail> {
    const response = await this.request(`/games/${id}`);

    return this.handleResponse<GameDetail>(response);
  }
}

export const rawgApi = new RawgApi(rawgConfig.baseUrl, rawgConfig.apiKey, {
  Accept: "application/json",
});
