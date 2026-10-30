import { Heart, Star, Bookmark, BookmarkCheck } from "lucide-react";
import { useState } from "react";
import { ConfirmRemoveDialog } from "../ConfirmRemoveDialog/ConfirmRemoveDialog";
import { GameStatusSelect } from "../GameStatusSelect/GameStatusSelect";
import { ErrorMessage } from "../ErrorMessage/ErrorMessage";
import type { Game, GameStatus } from "../../types/game";
import { useLibrary } from "../../hooks/useLibrary";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import fallbackGame from "../../images/fallback-game.svg";
import styles from "./GameCard.module.css";

interface GameCardProps {
  game: Game;
  onOpenDetails: (game: Game) => void;
  onGenreClick?: (genreId: string) => void;
  showStatusSelect?: boolean;
  onRequireAuth?: () => void;
}
export function GameCard({
  game,
  onOpenDetails,
  onGenreClick,
  showStatusSelect = false,
  onRequireAuth,
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
  const { isAuth, isCheckingAuth } = useCurrentUser();
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [pendingAction, setPendingAction] = useState<
    "adding" | "removing" | "updating" | "favorite" | null
  >(null);

  const currentStatus = library.find(
    (entry) => entry.game.id === game.id,
  )?.status;
  const isGameFavorite = isFavorite(game.id);

  function requireAuth(): boolean {
    if (isCheckingAuth) return true;

    if (!isAuth) {
      onRequireAuth?.();
      return true;
    }

    return false;
  }

  async function handleLibraryToggle() {
    if (requireAuth()) return;
    if (isSaved) {
      setShowRemoveConfirm(true);
      return;
    }

    if (pendingAction !== null) return;

    setPendingAction("adding");
    setActionError(null);

    try {
      await addGame(game);
    } catch (error) {
      setActionError(
        error instanceof Error
          ? error.message
          : "No se pudo agregar el videojuego.",
      );
    } finally {
      setPendingAction(null);
    }
  }

  async function handleConfirmRemoval() {
    if (pendingAction !== null) return;

    setPendingAction("removing");
    setActionError(null);

    try {
      await removeGame(game.id);
      setShowRemoveConfirm(false);
    } catch (error) {
      setActionError(
        error instanceof Error
          ? error.message
          : "No se pudo eliminar el videojuego.",
      );
    } finally {
      setPendingAction(null);
    }
  }

  async function handleStatusChange(status: GameStatus) {
    if (requireAuth()) return;
    if (pendingAction !== null) return;

    setPendingAction("updating");
    setActionError(null);

    try {
      await updateGameStatus(game, status);
    } catch (error) {
      setActionError(
        error instanceof Error
          ? error.message
          : "No se pudo actualizar el estado.",
      );
    } finally {
      setPendingAction(null);
    }
  }

  async function handleFavoriteToggle() {
    if (requireAuth()) return;
    if (pendingAction !== null) return;

    setPendingAction("favorite");
    setActionError(null);

    try {
      await toggleFavorite(game);
    } catch (error) {
      setActionError(
        error instanceof Error
          ? error.message
          : "No se pudieron actualizar los favoritos.",
      );
    } finally {
      setPendingAction(null);
    }
  }

  return (
    <>
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
            onClick={handleFavoriteToggle}
            aria-label={
              isGameFavorite
                ? `Quitar ${game.name} de favoritos`
                : `Agregar ${game.name} a favoritos`
            }
            aria-pressed={isGameFavorite}
            disabled={pendingAction !== null}
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
              onChange={handleStatusChange}
              onRemove={() => setShowRemoveConfirm(true)}
              isUpdating={pendingAction === "updating"}
            />
          ) : (
            <>
              <button
                type="button"
                className={styles.addButton}
                onClick={handleLibraryToggle}
                disabled={pendingAction !== null}
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
            </>
          )}
        </div>
        {showRemoveConfirm && (
          <ConfirmRemoveDialog
            gameName={game.name}
            onConfirm={handleConfirmRemoval}
            onCancel={() => {
              setShowRemoveConfirm(false);
              setActionError(null);
            }}
            isProcessing={pendingAction === "removing"}
            error={actionError}
          />
        )}
      </article>
      {actionError && !showRemoveConfirm && (
        <ErrorMessage
          message={actionError}
          variant="overlay"
          onDismiss={() => setActionError(null)}
        />
      )}
    </>
  );
}
