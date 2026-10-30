import { createContext } from "react";
import type { Game, GameStatus, LibraryEntry } from "../types/game";

export interface LibraryContextValue {
  library: LibraryEntry[];
  addGame: (game: Game) => Promise<LibraryEntry>;
  removeGame: (gameId: number) => Promise<void>;
  isGameInLibrary: (gameId: number) => boolean;
  favorites: Game[];
  toggleFavorite: (game: Game) => Promise<void>;
  isFavorite: (gameId: number) => boolean;
  updateGameStatus: (game: Game, status: GameStatus) => Promise<void>;
  isLibraryLoading: boolean;
  libraryError: string | null;
}

export const LibraryContext = createContext<LibraryContextValue | null>(null);
