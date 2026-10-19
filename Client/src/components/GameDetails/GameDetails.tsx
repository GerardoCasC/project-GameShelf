import { useEffect, useRef } from "react";
import { Heart, Plus, Star, X } from "lucide-react";
import type { GameDetail } from "../../types/game";
import fallbackGame from "../../images/fallback-game.svg";
import styles from "./GameDetails.module.css";

interface GameDetailsProps {
  game: GameDetail;
  onClose: () => void;
}

export function GameDetails({ game, onClose }: GameDetailsProps) {
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
          aria-label="Cerrar detalles"
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
              <button type="button" className={styles.addButton}>
                <Plus size={20} aria-hidden="true" />
                <span>Añadir a biblioteca</span>
              </button>

              <button
                type="button"
                className={styles.favoriteButton}
                aria-label="Añadir a favoritos"
                title="Añadir a favoritos"
              >
                <Heart size={20} aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
        {!!description_raw?.trim() && (
          <section className={styles.description}>
            <h3>Acerca del juego</h3>
            <p>{description_raw}</p>
          </section>
        )}
      </article>
    </dialog>
  );
}
