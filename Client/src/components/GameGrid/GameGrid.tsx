import type { Game } from "../../types/game";
import GameCard from "../GameCard/GameCard";
import styles from "./GameGrid.module.css";

interface GameGridProps {
  games: Game[];
  onOpenDetails: (game: Game) => void;
}

export function GameGrid({ games, onOpenDetails }: GameGridProps) {
  return (
    <section className={styles.grid} aria-label="Videojuegos">
      {games.map((game) => (
        <GameCard key={game.id} game={game} onOpenDetails={onOpenDetails} />
      ))}
    </section>
  );
}
