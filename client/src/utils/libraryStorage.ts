import type { Game, GameStatus, LibraryEntry } from "../types/game";

class LibraryStorage {
  private readonly storageKey = "library";
  private readonly favoritesKey = "favorites";

  private saveLibrary(library: LibraryEntry[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(library));
  }

  public getLibrary(): LibraryEntry[] {
    try {
      const storedLibrary = localStorage.getItem(this.storageKey);

      if (!storedLibrary) return [];

      const parsedLibrary: unknown = JSON.parse(storedLibrary);

      if (!Array.isArray(parsedLibrary)) return [];

      return parsedLibrary as LibraryEntry[];
    } catch (error) {
      console.error("Error al recuperar la biblioteca:", error);
      return [];
    }
  }

  public isGameInLibrary(gameId: number): boolean {
    return this.getLibrary().some((entry) => entry.game.id === gameId);
  }

  public addGame(game: Game): LibraryEntry[] {
    const library = this.getLibrary();

    const alreadyExists = library.some((entry) => entry.game.id === game.id);

    if (alreadyExists) return library;

    const newEntry: LibraryEntry = {
      id: String(game.id),
      game,
      status: "pending",
    };

    const updatedLibrary = [...library, newEntry];

    this.saveLibrary(updatedLibrary);

    return updatedLibrary;
  }

  public removeGame(gameId: number): LibraryEntry[] {
    const library = this.getLibrary();

    const updatedLibrary = library.filter((entry) => entry.game.id !== gameId);

    this.saveLibrary(updatedLibrary);

    return updatedLibrary;
  }

  //  STATUS  //

  public updateGameStatus(gameId: number, status: GameStatus): LibraryEntry[] {
    const library = this.getLibrary();

    const gameExists = library.some((entry) => entry.game.id === gameId);

    if (!gameExists) {
      return library;
    }

    const updatedLibrary = library.map((entry) =>
      entry.game.id === gameId ? { ...entry, status } : entry,
    );

    this.saveLibrary(updatedLibrary);

    return updatedLibrary;
  }

  //  FAVORITES  //

  private saveFavorites(favorites: Game[]): void {
    localStorage.setItem(this.favoritesKey, JSON.stringify(favorites));
  }

  public getFavorites(): Game[] {
    try {
      const storedFavorites = localStorage.getItem(this.favoritesKey);

      if (!storedFavorites) return [];

      const parsedFavorites: unknown = JSON.parse(storedFavorites);

      if (!Array.isArray(parsedFavorites)) return [];

      return parsedFavorites as Game[];
    } catch (error) {
      console.error("Error al recuperar favoritos:", error);
      return [];
    }
  }

  public toggleFavorite(game: Game): Game[] {
    const favorites = this.getFavorites();

    const isFavorite = favorites.some((favorite) => favorite.id === game.id);

    const updatedFavorites = isFavorite
      ? favorites.filter((favorite) => favorite.id !== game.id)
      : [...favorites, game];

    this.saveFavorites(updatedFavorites);

    return updatedFavorites;
  }
}

export const libraryStorage = new LibraryStorage();
