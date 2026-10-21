import { createContext } from "react";
import type { Game } from "../types/game";
import type { LibraryEntry } from "../types/game";

export interface LibraryContextValue {
  library: LibraryEntry[];
  addGame: (game: Game) => void;
  removeGame: (gameId: number) => void;
  isGameInLibrary: (gameId: number) => boolean;
}

export const LibraryContext = createContext<LibraryContextValue | null>(null);
