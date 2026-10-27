import type {
  RawgGamesParams,
  RawgGamesResponse,
  RawgFilterOptionsResponse,
} from "../types/rawg";
import type {
  User,
  SignupData,
  SigninData,
  SigninResponse,
} from "../types/auth";
import type {
  Game,
  GameDetail,
  GameStatus,
  LibraryEntry,
  FavoriteEntry,
} from "../types/game";

interface ApiRequestOptions extends RequestInit {
  params?: URLSearchParams;
  requiresAuth?: boolean;
}

export class Api {
  private baseUrl: string;
  private headers: Record<string, string> = {};

  constructor(baseUrl: string, headers: Record<string, string> = {}) {
    this.baseUrl = baseUrl;
    this.headers = headers;
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const data: { error?: { message?: string } } | null = await response
        .json()
        .catch(() => null);

      const message = data?.error?.message || `Error HTTP ${response.status}`;

      throw Object.assign(new Error(message), {
        status: response.status,
      });
    }

    if (response.status === 204) {
      return undefined as T;
    }

    return (await response.json()) as T;
  }

  private async request(
    endpoint: string,
    options: ApiRequestOptions = {},
  ): Promise<Response> {
    if (!this.baseUrl) {
      throw new Error("Falta configurar VITE_API_URL");
    }

    const { params, requiresAuth = false, ...fetchOptions } = options;

    const url = new URL(this.baseUrl.replace(/\/+$/, "") + endpoint);

    params?.forEach((value, key) => {
      url.searchParams.set(key, value);
    });

    const headers = new Headers(this.headers);

    new Headers(fetchOptions.headers).forEach((value, key) => {
      headers.set(key, value);
    });

    if (typeof fetchOptions.body === "string" && !headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json");
    }

    if (requiresAuth) {
      const token = localStorage.getItem("runaria_token");

      if (!token) {
        throw new Error("Debes iniciar sesión");
      }

      headers.set("Authorization", `Bearer ${token}`);
    }

    return fetch(url.toString(), {
      method: "GET",
      ...fetchOptions,
      headers,
    });
  }

  public async getGames(
    params: RawgGamesParams = {},
    signal?: AbortSignal,
  ): Promise<RawgGamesResponse> {
    const searchParams = new URLSearchParams();

    if (params.genres) {
      searchParams.set("genres", params.genres);
    }

    if (params.platforms) {
      searchParams.set("platforms", params.platforms);
    }

    if (params.search) {
      searchParams.set("search", params.search);
    }

    if (params.page !== undefined) {
      searchParams.set("page", String(params.page));
    }

    if (params.page_size !== undefined) {
      searchParams.set("page_size", String(params.page_size));
    }

    const response = await this.request("/games", {
      params: searchParams,
      signal,
    });

    return this.handleResponse<RawgGamesResponse>(response);
  }
  public async getGameById(
    id: number,
    signal?: AbortSignal,
  ): Promise<GameDetail> {
    const response = await this.request(`/games/${id}`, {
      signal,
    });

    return this.handleResponse<GameDetail>(response);
  }

  public async getGenres(
    signal?: AbortSignal,
  ): Promise<RawgFilterOptionsResponse> {
    const response = await this.request("/genres", {
      signal,
    });

    return this.handleResponse<RawgFilterOptionsResponse>(response);
  }

  public async getPlatforms(
    signal?: AbortSignal,
  ): Promise<RawgFilterOptionsResponse> {
    const response = await this.request("/platforms", {
      signal,
    });

    return this.handleResponse<RawgFilterOptionsResponse>(response);
  }

  public async signup(userData: SignupData): Promise<User> {
    const response = await this.request("/signup", {
      method: "POST",
      body: JSON.stringify(userData),
    });

    return this.handleResponse<User>(response);
  }

  public async signin(userData: SigninData): Promise<SigninResponse> {
    const response = await this.request("/signin", {
      method: "POST",
      body: JSON.stringify(userData),
    });

    return this.handleResponse<SigninResponse>(response);
  }

  public async getCurrentUser(signal?: AbortSignal): Promise<User> {
    const response = await this.request("/users/me", {
      requiresAuth: true,
      signal,
    });

    return this.handleResponse<User>(response);
  }

  public async getLibrary(signal?: AbortSignal): Promise<LibraryEntry[]> {
    const response = await this.request("/library", {
      requiresAuth: true,
      signal,
    });

    return this.handleResponse<LibraryEntry[]>(response);
  }

  public async addGameToLibrary(game: Game): Promise<LibraryEntry> {
    const response = await this.request("/library", {
      method: "POST",
      body: JSON.stringify({ game }),
      requiresAuth: true,
    });

    return this.handleResponse<LibraryEntry>(response);
  }

  public async deleteGameFromLibrary(id: string): Promise<void> {
    const response = await this.request(`/library/${id}`, {
      method: "DELETE",
      requiresAuth: true,
    });

    return this.handleResponse<void>(response);
  }

  public async updateGameStatus(
    id: string,
    status: GameStatus,
  ): Promise<LibraryEntry> {
    const response = await this.request(`/library/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
      requiresAuth: true,
    });

    return this.handleResponse<LibraryEntry>(response);
  }

  public async getFavorites(signal?: AbortSignal): Promise<FavoriteEntry[]> {
    const response = await this.request("/favorites", {
      requiresAuth: true,
      signal,
    });

    return this.handleResponse<FavoriteEntry[]>(response);
  }

  public async addFavorite(game: Game): Promise<FavoriteEntry> {
    const response = await this.request("/favorites", {
      method: "POST",
      body: JSON.stringify({ game }),
      requiresAuth: true,
    });

    return this.handleResponse<FavoriteEntry>(response);
  }

  public async deleteFavorite(id: string): Promise<void> {
    const response = await this.request(`/favorites/${id}`, {
      method: "DELETE",
      requiresAuth: true,
    });

    return this.handleResponse<void>(response);
  }
}

export const api = new Api(import.meta.env.VITE_API_URL, {
  Accept: "application/json",
});
