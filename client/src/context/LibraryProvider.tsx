import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
  useRef,
} from "react";
import type { Game, GameStatus, LibraryEntry } from "../types/game";
import type { FavoriteEntry } from "../types/game";
import type { User } from "../types/auth";
import { api } from "../utils/api";
import { useCurrentUser } from "../hooks/useCurrentUser";
import { LibraryContext } from "./LibraryContext";

interface LibraryProviderProps {
  children: ReactNode;
}

export function LibraryProvider({ children }: LibraryProviderProps) {
  const { currentUser } = useCurrentUser();

  const [storedLibrary, setLibrary] = useState<LibraryEntry[]>([]);
  const [storedFavorites, setFavorites] = useState<FavoriteEntry[]>([]);

  const [loadedFor, setLoadedFor] = useState<User | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  const activeUserRef = useRef(currentUser?.id ?? null);

  useEffect(() => {
    activeUserRef.current = currentUser?.id ?? null;
  }, [currentUser?.id]);

  useEffect(() => {
    if (!currentUser) return;

    const controller = new AbortController();
    let active = true;

    Promise.all([
      api.getLibrary(controller.signal),
      api.getFavorites(controller.signal),
    ])
      .then(([libraryData, favoriteData]) => {
        if (!active) return;

        setLibrary(libraryData);
        setFavorites(favoriteData);
        setLoadError(null);
        setLoadedFor(currentUser);
      })
      .catch(() => {
        if (!active) return;

        setLoadError("No se pudieron cargar tu biblioteca y favoritos.");
        setLoadedFor(currentUser);
      });

    return () => {
      active = false;
      controller.abort();
    };
  }, [currentUser]);

  const isCurrentUser = currentUser !== null && loadedFor === currentUser;

  const library = useMemo(
    () => (isCurrentUser && !loadError ? storedLibrary : []),
    [isCurrentUser, loadError, storedLibrary],
  );

  const isLibraryLoading = currentUser !== null && !isCurrentUser;
  const libraryError = isCurrentUser ? loadError : null;

  const addGame = useCallback(
    async (game: Game): Promise<LibraryEntry> => {
      if (!currentUser || loadedFor?.id !== currentUser.id || loadError) {
        throw new Error("La biblioteca no está disponible.");
      }

      const existingEntry = library.find((entry) => entry.game.id === game.id);

      if (existingEntry) return existingEntry;

      const newEntry = await api.addGameToLibrary(game);

      if (activeUserRef.current === currentUser.id) {
        setLibrary((previous) => {
          const exists = previous.some((entry) => entry.game.id === game.id);

          return exists ? previous : [newEntry, ...previous];
        });
      }

      return newEntry;
    },
    [currentUser, loadedFor, loadError, library],
  );

  const removeGame = useCallback(
    async (gameId: number): Promise<void> => {
      if (!currentUser || loadedFor?.id !== currentUser.id || loadError) {
        throw new Error("La biblioteca no está disponible.");
      }

      const entry = library.find((entry) => entry.game.id === gameId);

      if (!entry) {
        throw new Error("El videojuego no está en tu biblioteca.");
      }

      await api.deleteGameFromLibrary(entry.id);

      if (activeUserRef.current !== currentUser.id) {
        return;
      }

      setLibrary((previous) => previous.filter((item) => item.id !== entry.id));
    },
    [currentUser, loadedFor, loadError, library],
  );

  const isGameInLibrary = useCallback(
    (gameId: number) => {
      return library.some((entry) => entry.game.id === gameId);
    },
    [library],
  );

  const updateGameStatus = useCallback(
    async (game: Game, status: GameStatus): Promise<void> => {
      if (!currentUser || loadedFor?.id !== currentUser.id || loadError) {
        throw new Error("La biblioteca no está disponible.");
      }

      const userId = currentUser.id;

      const entry = await addGame(game);

      if (activeUserRef.current !== userId) return;

      const updatedEntry = await api.updateGameStatus(entry.id, status);

      if (activeUserRef.current !== userId) return;

      setLibrary((previous) =>
        previous.map((item) =>
          item.id === updatedEntry.id ? updatedEntry : item,
        ),
      );
    },
    [currentUser, loadedFor, loadError, addGame],
  );

  const toggleFavorite = useCallback(
    async (game: Game): Promise<void> => {
      if (!currentUser || loadedFor?.id !== currentUser.id || loadError) {
        throw new Error("Los favoritos no están disponibles.");
      }

      const userId = currentUser.id;

      const existingFavorite = storedFavorites.find(
        (entry) => entry.game.id === game.id,
      );

      if (existingFavorite) {
        await api.deleteFavorite(existingFavorite.id);

        if (activeUserRef.current !== userId) return;

        setFavorites((previous) =>
          previous.filter((entry) => entry.id !== existingFavorite.id),
        );

        return;
      }

      const newFavorite = await api.addFavorite(game);

      if (activeUserRef.current !== userId) return;

      setFavorites((previous) => {
        const exists = previous.some((entry) => entry.game.id === game.id);

        return exists ? previous : [newFavorite, ...previous];
      });
    },
    [currentUser, loadedFor, loadError, storedFavorites],
  );

  const favorites = useMemo(
    () =>
      isCurrentUser && !loadError
        ? storedFavorites.map((entry) => entry.game)
        : [],
    [isCurrentUser, loadError, storedFavorites],
  );

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
      isLibraryLoading,
      libraryError,
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
      isLibraryLoading,
      libraryError,
    ],
  );

  return (
    <LibraryContext.Provider value={value}>{children}</LibraryContext.Provider>
  );
}
