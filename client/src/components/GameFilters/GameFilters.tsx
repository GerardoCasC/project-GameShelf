import { SlidersHorizontal } from "lucide-react";
import type { RawgFilterOption } from "../../types/rawg";
import styles from "./GameFilters.module.css";

interface GameFiltersProps {
  genres: RawgFilterOption[];
  platforms: RawgFilterOption[];
  selectedGenre: string;
  selectedPlatform: string;
  onGenreChange: (genre: string) => void;
  onPlatformChange: (platform: string) => void;
  onClear: () => void;
}

export function GameFilters({
  genres,
  platforms,
  selectedGenre,
  selectedPlatform,
  onGenreChange,
  onPlatformChange,
  onClear,
}: GameFiltersProps) {
  const hasActiveFilters = Boolean(selectedGenre || selectedPlatform);

  return (
    <section className={styles.filters} aria-label="Filtros del catálogo">
      <div className={styles.header}>
        <SlidersHorizontal size={20} aria-hidden="true" />
        <h2>Filtros</h2>
      </div>

      <div className={styles.field}>
        <label htmlFor="genre-filter">Género</label>

        <select
          id="genre-filter"
          value={selectedGenre}
          onChange={(event) => onGenreChange(event.target.value)}
        >
          <option value="">Todos los géneros</option>

          {genres.map((genre) => (
            <option key={genre.id} value={genre.id}>
              {genre.name}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.field}>
        <label htmlFor="platform-filter">Plataforma</label>

        <select
          id="platform-filter"
          value={selectedPlatform}
          onChange={(event) => onPlatformChange(event.target.value)}
        >
          <option value="">Todas las plataformas</option>

          {platforms.map((platform) => (
            <option key={platform.id} value={platform.id}>
              {platform.name}
            </option>
          ))}
        </select>
      </div>

      <button
        type="button"
        className={styles.clearButton}
        onClick={onClear}
        disabled={!hasActiveFilters}
      >
        Limpiar filtros
      </button>
    </section>
  );
}
