import { createContext } from "react";
import type { Game, GameStatus, LibraryEntry } from "../types/game";

export interface LibraryContextValue {
  library: LibraryEntry[];
  addGame: (game: Game) => void;
  removeGame: (gameId: number) => void;
  isGameInLibrary: (gameId: number) => boolean;
  favorites: Game[];
  toggleFavorite: (game: Game) => void;
  isFavorite: (gameId: number) => boolean;
  updateGameStatus: (gameId: number, status: GameStatus) => void;
}

export const LibraryContext = createContext<LibraryContextValue | null>(null);
