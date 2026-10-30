import { useEffect, useRef, useState } from "react";
import { Heart, Star, X, Bookmark, BookmarkCheck } from "lucide-react";
import { ConfirmRemoveDialog } from "../ConfirmRemoveDialog/ConfirmRemoveDialog";
import { GameStatusSelect } from "../GameStatusSelect/GameStatusSelect";
import { ErrorMessage } from "../ErrorMessage/ErrorMessage";
import type { GameDetail, GameStatus } from "../../types/game";
import { useLibrary } from "../../hooks/useLibrary";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import fallbackGame from "../../images/fallback-game.svg";
import styles from "./GameDetails.module.css";

interface GameDetailsProps {
  game: GameDetail;
  onClose: () => void;
  onRequireAuth: () => void;
}

export function GameDetails({
  game,
  onClose,
  onRequireAuth,
}: GameDetailsProps) {
  const {
    library,
    addGame,
    removeGame,
    isGameInLibrary,
    updateGameStatus,
    toggleFavorite,
    isFavorite,
  } = useLibrary();
  const isSaved = isGameInLibrary(game.id);
  const { isAuth, isCheckingAuth } = useCurrentUser();
  const currentStatus = library.find(
    (entry) => entry.game.id === game.id,
  )?.status;
  const isGameFavorite = isFavorite(game.id);

  const [showRemoveConfirm, setShowRemoveConfirm] = useState(false);

  const [actionError, setActionError] = useState<string | null>(null);
  const [pendingAction, setPendingAction] = useState<
    "adding" | "removing" | "updating" | "favorite" | null
  >(null);

  function requireAuth(): boolean {
    if (isCheckingAuth) return true;

    if (!isAuth) {
      onClose();
      onRequireAuth();
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

  const dialogRef = useRef<HTMLDialogElement>(null);

  const {
    name,
    background_image,
    released,
    rating,
    genres,
    description_raw,
    developers,
    platforms,
  } = game;

  useEffect(() => {
    const dialog = dialogRef.current;

    if (!dialog) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    if (!dialog.open) {
      dialog.showModal();
    }

    return () => {
      if (dialog.open) {
        dialog.close();
      }
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  const handleBackdropClick = (event: React.MouseEvent<HTMLDialogElement>) => {
    const dialog = event.currentTarget;
    const rect = dialog.getBoundingClientRect();

    const clickedOutside =
      event.clientX < rect.left ||
      event.clientX > rect.right ||
      event.clientY < rect.top ||
      event.clientY > rect.bottom;

    if (clickedOutside) {
      onClose();
    }
  };

  const releaseDate = released
    ? new Date(released).toLocaleDateString("es-MX", {
        day: "numeric",
        month: "long",
        year: "numeric",
        timeZone: "UTC",
      })
    : null;
  return (
    <dialog
      ref={dialogRef}
      className={styles.modal}
      aria-label={`Detalles de ${name}`}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={handleBackdropClick}
    >
      <div className={styles.modalHeader}>
        <button
          type="button"
          className={styles.closeButton}
          onClick={onClose}
          autoFocus
        >
          <X size={22} aria-hidden="true" />
        </button>
      </div>

      <article className={styles.details}>
        <div className={styles.mainContent}>
          <div className={styles.imageContainer}>
            <img
              src={background_image ?? fallbackGame}
              alt={`Portada de ${name}`}
              className={styles.image}
              onError={(event) => {
                event.currentTarget.onerror = null;
                event.currentTarget.src = fallbackGame;
              }}
            />
          </div>

          <div className={styles.information}>
            <h2 className={styles.title}>{name}</h2>

            <div className={styles.gameMetadata}>
              {releaseDate && (
                <p className={styles.releaseDate}>{releaseDate}</p>
              )}

              {rating !== undefined && (
                <div className={styles.rating}>
                  <Star size={19} fill="currentColor" aria-hidden="true" />
                  <span>{rating.toFixed(1)}/5</span>
                </div>
              )}
            </div>

            {!!genres?.length && (
              <ul className={styles.genreList}>
                {genres.map((genre) => (
                  <li key={genre.id} className={styles.genre}>
                    {genre.name}
                  </li>
                ))}
              </ul>
            )}

            {!!(developers?.length || platforms?.length) && (
              <section className={styles.additionalInfo}>
                <h3>Información adicional</h3>

                <div className={styles.metadata}>
                  {!!developers?.length && (
                    <div>
                      <h4>Desarrollador</h4>
                      <p>{developers.map((dev) => dev.name).join(", ")}</p>
                    </div>
                  )}

                  {!!platforms?.length && (
                    <div>
                      <h4>Plataformas</h4>
                      <p>
                        {platforms
                          .map(({ platform }) => platform.name)
                          .join(", ")}
                      </p>
                    </div>
                  )}
                </div>
              </section>
            )}

            <div className={styles.actions}>
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
            <GameStatusSelect
              status={currentStatus}
              isSaved={isSaved}
              onChange={handleStatusChange}
              onRemove={() => setShowRemoveConfirm(true)}
              isUpdating={pendingAction === "updating"}
            />
          </div>
        </div>
        {!!description_raw?.trim() && (
          <section className={styles.description}>
            <h3>Acerca del juego</h3>
            <p>{description_raw}</p>
          </section>
        )}
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
    </dialog>
  );
}
