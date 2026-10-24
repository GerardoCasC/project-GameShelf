import { useCallback, useMemo, useState, type ReactNode } from "react";
import type { Game, GameStatus, LibraryEntry } from "../types/game";
import { libraryStorage } from "../utils/libraryStorage";
import { LibraryContext } from "./LibraryContext";

interface LibraryProviderProps {
  children: ReactNode;
}

export function LibraryProvider({ children }: LibraryProviderProps) {
  const [library, setLibrary] = useState<LibraryEntry[]>(() =>
    libraryStorage.getLibrary(),
  );
  const [favorites, setFavorites] = useState<Game[]>(() =>
    libraryStorage.getFavorites(),
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

  const updateGameStatus = useCallback((gameId: number, status: GameStatus) => {
    const updatedLibrary = libraryStorage.updateGameStatus(gameId, status);

    setLibrary(updatedLibrary);
  }, []);

  const toggleFavorite = useCallback((game: Game) => {
    const updatedFavorites = libraryStorage.toggleFavorite(game);

    setFavorites(updatedFavorites);
  }, []);

  const isFavorite = useCallback(
    (gameId: number) => {
      return favorites.some((game) => game.id === gameId);
    },
    [favorites],
  );

  const value = useMemo(
    () => ({
      library,
      addGame,
      removeGame,
      isGameInLibrary,
      favorites,
      updateGameStatus,
      toggleFavorite,
      isFavorite,
    }),
    [
      library,
      addGame,
      removeGame,
      isGameInLibrary,
      favorites,
      updateGameStatus,
      toggleFavorite,
      isFavorite,
    ],
  );

  return (
    <LibraryContext.Provider value={value}>{children}</LibraryContext.Provider>
  );
}
