export interface Game {
  id: number;
  name: string;
  background_image: string | null;
  released?: string | null;
  rating?: number;
  genres?: {
    id: number;
    name: string;
  }[];
}

export interface GameDetail extends Game {
  description_raw?: string;
  platforms?: {
    platform: {
      id: number;
      name: string;
    };
  }[];
  developers?: {
    id: number;
    name: string;
  }[];
}

export type GameStatus = "pending" | "playing" | "completed" | "abandoned";

export interface LibraryEntry {
  game: Game;
  status?: GameStatus;
}
