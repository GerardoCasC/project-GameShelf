import { BookOpen } from "lucide-react";
import { GameGrid } from "../GameGrid/GameGrid";
import gamesData from "../../data/games.json";
import type { Game } from "../../types/game";
import styles from "./MyLibrary.module.css";

interface MyLibraryProps {
  onOpenDetails: (game: Game) => void;
}

const games: Game[] = gamesData;

// Datos de ejemplo para la maqueta.
const libraryGames = [games[0], games[2], games[3]];

export function MyLibrary({ onOpenDetails }: MyLibraryProps) {
  return (
    <section className={styles.library} aria-labelledby="library-title">
      <div className={styles.header}>
        <BookOpen size={22} aria-hidden="true" />
        <h1 id="library-title">Mi biblioteca</h1>
      </div>

      <GameGrid games={libraryGames} onOpenDetails={onOpenDetails} />
    </section>
  );
}
