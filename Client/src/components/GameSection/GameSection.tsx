import { useId } from "react";
import type { ReactNode } from "react";
import type { Game } from "../../types/game";
import GameCard from "../GameCard/GameCard";
import styles from "./GameSection.module.css";

interface GameSectionProps {
  title: string;
  icon?: ReactNode;
  games: Game[];
  onOpenDetails: (game: Game) => void;
}

export function GameSection({
  title,
  icon,
  games,
  onOpenDetails,
}: GameSectionProps) {
  const titleId = useId();

  return (
    <section className={styles.section} aria-labelledby={titleId}>
      <div className={styles.header}>
        {icon && (
          <span className={styles.icon} aria-hidden="true">
            {icon}
          </span>
        )}

        <h1 id={titleId} className={styles.title}>
          {title}
        </h1>
      </div>

      <div className={styles.grid}>
        {games.map((game) => (
          <GameCard key={game.id} game={game} onOpenDetails={onOpenDetails} />
        ))}
      </div>
    </section>
  );
}
