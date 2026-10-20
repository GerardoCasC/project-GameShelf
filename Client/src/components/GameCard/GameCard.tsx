import { Heart, Plus, Star } from "lucide-react";
import type { Game } from "../../types/game";
import fallbackGame from "../../images/fallback-game.svg";
import styles from "./GameCard.module.css";

interface GameCardProps {
  game: Game;
  onOpenDetails: (game: Game) => void;
  onGenreClick?: (genreId: string) => void;
}
export function GameCard({ game, onOpenDetails, onGenreClick }: GameCardProps) {
  const { name, background_image, released, rating, genres } = game;

  const year = released ? new Date(released).getUTCFullYear() : null;

  return (
    <article className={styles.card}>
      <div className={styles.imageContainer}>
        <button
          type="button"
          className={styles.imageButton}
          onClick={() => onOpenDetails(game)}
          aria-label={`Ver detalles de ${name}`}
        >
          <img
            className={styles.image}
            src={background_image ?? fallbackGame}
            alt={`Portada de ${name}`}
          />
        </button>
        <button
          type="button"
          className={styles.favoriteButton}
          aria-label="Añadir a favoritos (próximamente)"
          title="Favoritos próximamente"
        >
          <Heart size={22} aria-hidden="true" />
        </button>
      </div>

      <div className={styles.content}>
        <h2 className={styles.title}>
          <button
            type="button"
            className={styles.titleButton}
            onClick={() => onOpenDetails(game)}
          >
            {name}
          </button>
        </h2>

        <div className={styles.meta}>
          {year !== null && !Number.isNaN(year) && (
            <p className={styles.year}>{year}</p>
          )}

          {rating !== undefined && (
            <div className={styles.rating}>
              <Star
                size={15}
                className={styles.star}
                fill="currentColor"
                aria-hidden="true"
              />
              <span>{rating.toFixed(1)}/5</span>
            </div>
          )}
        </div>

        {genres && genres.length > 0 && (
          <ul className={styles.genreList}>
            {genres.map((genre) => (
              <li key={genre.id}>
                {onGenreClick ? (
                  <button
                    type="button"
                    className={styles.genre}
                    onClick={() => onGenreClick(String(genre.id))}
                    aria-label={`Filtrar por género ${genre.name}`}
                  >
                    {genre.name}
                  </button>
                ) : (
                  <span className={styles.genre}>{genre.name}</span>
                )}
              </li>
            ))}
          </ul>
        )}

        <button
          type="button"
          className={styles.addButton}
          title="Biblioteca próximamente"
        >
          <Plus size={20} aria-hidden="true" />
          <span>Añadir a biblioteca</span>
        </button>
      </div>
    </article>
  );
}
