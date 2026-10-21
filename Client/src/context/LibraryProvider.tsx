import { useCallback, useMemo, useState, type ReactNode } from "react";
import type { Game } from "../types/game";
import type { LibraryEntry } from "../types/game";
import { libraryStorage } from "../utils/libraryStorage";
import { LibraryContext } from "./LibraryContext";

interface LibraryProviderProps {
  children: ReactNode;
}

export function LibraryProvider({ children }: LibraryProviderProps) {
  const [library, setLibrary] = useState<LibraryEntry[]>(() =>
    libraryStorage.getLibrary(),
  );

  const addGame = useCallback((game: Game) => {
    const updatedLibrary = libraryStorage.addGame(game);
    setLibrary(updatedLibrary);
  }, []);

  const removeGame = useCallback((gameId: number) => {
    const updatedLibrary = libraryStorage.removeGame(gameId);
    setLibrary(updatedLibrary);
  }, []);

  const isGameInLibrary = useCallback(
    (gameId: number) => {
      return library.some((entry) => entry.game.id === gameId);
    },
    [library],
  );

  const value = useMemo(
    () => ({
      library,
      addGame,
      removeGame,
      isGameInLibrary,
    }),
    [library, addGame, removeGame, isGameInLibrary],
  );

  return (
    <LibraryContext.Provider value={value}>{children}</LibraryContext.Provider>
  );
}
