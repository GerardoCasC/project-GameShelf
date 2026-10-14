import type { Game } from "../../types/game";
import GameCard from "../GameCard/GameCard";
import styles from "./GameGrid.module.css";

interface GameGridProps {
  games: Game[];
}

export function GameGrid({ games }: GameGridProps) {
  return (
    <section className={styles.grid} aria-label="Videojuegos">
      {games.map((game) => (
        <GameCard key={game.id} game={game} />
      ))}
    </section>
  );
}
