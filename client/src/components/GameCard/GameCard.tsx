import { Heart, Star, Bookmark, BookmarkCheck } from "lucide-react";
import { useState } from "react";
import { ConfirmRemoveDialog } from "../ConfirmRemoveDialog/ConfirmRemoveDialog";
import { GameStatusSelect } from "../GameStatusSelect/GameStatusSelect";
import type { Game } from "../../types/game";
import { useLibrary } from "../../hooks/useLibrary";
import fallbackGame from "../../images/fallback-game.svg";
import styles from "./GameCard.module.css";

interface GameCardProps {
  game: Game;
  onOpenDetails: (game: Game) => void;
  onGenreClick?: (genreId: string) => void;
  showStatusSelect?: boolean;
}
export function GameCard({
  game,
  onOpenDetails,
  onGenreClick,
  showStatusSelect = false,
}: GameCardProps) {
  const { name, background_image, released, rating, genres } = game;
  const year = released ? new Date(released).getUTCFullYear() : null;

  const {
    library,
    addGame,
    removeGame,
    isGameInLibrary,
    toggleFavorite,
    isFavorite,
    updateGameStatus,
  } = useLibrary();
  const isSaved = isGameInLibrary(game.id);
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(false);
  const currentStatus = library.find(
    (entry) => entry.game.id === game.id,
  )?.status;
  const isGameFavorite = isFavorite(game.id);

  function handleLibraryToggle() {
    if (isSaved) {
      setShowRemoveConfirm(true);
      return;
    }

    addGame(game);
  }

  function handleConfirmRemoval() {
    removeGame(game.id);
    setShowRemoveConfirm(false);
  }

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
            onError={(event) => {
              event.currentTarget.onerror = null;
              event.currentTarget.src = fallbackGame;
            }}
          />
        </button>
        <button
          type="button"
          className={styles.favoriteButton}
          onClick={() => toggleFavorite(game)}
          aria-label={
            isGameFavorite
              ? `Quitar ${game.name} de favoritos`
              : `Agregar ${game.name} a favoritos`
          }
          aria-pressed={isGameFavorite}
        >
          <Heart
            size={20}
            fill={isGameFavorite ? "currentColor" : "none"}
            aria-hidden="true"
          />
        </button>
      </div>

      <div className={styles.content}>
        <h3 className={styles.title}>
          <button
            type="button"
            className={styles.titleButton}
            onClick={() => onOpenDetails(game)}
          >
            {name}
          </button>
        </h3>

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
        {showStatusSelect ? (
          <GameStatusSelect
            status={currentStatus}
            isSaved={isSaved}
            onChange={(status) => updateGameStatus(game.id, status)}
            onRemove={() => setShowRemoveConfirm(true)}
          />
        ) : (
          <button
            type="button"
            className={styles.addButton}
            onClick={handleLibraryToggle}
          >
            {isSaved ? (
              <>
                <BookmarkCheck size={20} />{" "}
                <span>Eliminar de mi biblioteca</span>
              </>
            ) : (
              <>
                <Bookmark size={20} /> <span>Añadir a biblioteca</span>
              </>
            )}
          </button>
        )}
      </div>
      {showRemoveConfirm && (
        <ConfirmRemoveDialog
          gameName={game.name}
          onConfirm={handleConfirmRemoval}
          onCancel={() => setShowRemoveConfirm(false)}
        />
      )}
    </article>
  );
}
