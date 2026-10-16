import type { Game } from "./game";

export interface RawgGamesResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Game[];
}

export interface RawgGamesParams {
  search?: string;
  page?: number;
  page_size?: number;
}
