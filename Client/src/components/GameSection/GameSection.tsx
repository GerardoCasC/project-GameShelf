import { useId } from "react";
import { GameCard } from "../GameCard/GameCard";
import { Loading } from "../Loading/Loading";
import { ErrorMessage } from "../ErrorMessage/ErrorMessage";
import type { ReactNode } from "react";
import type { Game } from "../../types/game";

import styles from "./GameSection.module.css";

interface GameSectionProps {
  title: string;
  icon?: ReactNode;
  games: Game[];
  onOpenDetails: (game: Game) => void;
  onGenreClick?: (genreId: string) => void;
  hasMore?: boolean;
  isLoadingMore?: boolean;
  loadMoreError?: string | null;
  onLoadMore?: () => void;
  emptyMessage?: string;
  showStatusSelect?: boolean;
  headingLevel?: "h1" | "h2";
}

export function GameSection({
  title,
  icon,
  games,
  onOpenDetails,
  onGenreClick,
  hasMore = false,
  isLoadingMore = false,
  loadMoreError = null,
  onLoadMore,
  emptyMessage,
  showStatusSelect = false,
  headingLevel = "h2",
}: GameSectionProps) {
  const titleId = useId();

  const Heading = headingLevel;

  return (
    <section className={styles.section} aria-labelledby={titleId}>
      <div className={styles.header}>
        {icon && (
          <span className={styles.icon} aria-hidden="true">
            {icon}
          </span>
        )}

        <Heading id={titleId} className={styles.title}>
          {title}
        </Heading>
      </div>

      {games.length === 0 && emptyMessage ? (
        <p className={styles.emptyMessage} role="status">
          {emptyMessage}
        </p>
      ) : (
        <div className={styles.grid}>
          {games.map((game) => (
            <GameCard
              key={game.id}
              game={game}
              onOpenDetails={onOpenDetails}
              onGenreClick={onGenreClick}
              showStatusSelect={showStatusSelect}
            />
          ))}
        </div>
      )}
      {loadMoreError && <ErrorMessage message={loadMoreError} />}

      {isLoadingMore && <Loading message="Cargando..." />}

      {hasMore && onLoadMore && (
        <button
          type="button"
          className={styles.loadMoreButton}
          onClick={onLoadMore}
          disabled={isLoadingMore}
        >
          {isLoadingMore
            ? "Cargando..."
            : loadMoreError
              ? "Reintentar"
              : "Ver más"}
        </button>
      )}
    </section>
  );
}
