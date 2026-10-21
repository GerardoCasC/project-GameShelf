import type { Game } from "../types/game";
import type { LibraryEntry } from "../types/game";

class LibraryStorage {
  private readonly storageKey = "library";

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
      game,
      status: "pending",
      favorite: false,
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

  private saveLibrary(library: LibraryEntry[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(library));
  }
}

export const libraryStorage = new LibraryStorage();
