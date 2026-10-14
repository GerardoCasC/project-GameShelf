import { Star } from "lucide-react";
import Header from "./components/Header/Header";
import { GameGrid } from "./components/GameGrid/GameGrid";
import gamesData from "./data/games.json";
import type { Game } from "./types/game";
import styles from "./App.module.css";

const games: Game[] = gamesData;
const featuredGames = games.slice(0, 5);

function App() {
  return (
    <div className={styles.app} id="inicio">
      <Header />

      <main className={styles.main}>
        <section
          className={styles.featuredSection}
          aria-labelledby="featured-title"
        >
          <div className={styles.sectionHeader}>
            <Star
              size={20}
              fill="currentColor"
              className={styles.sectionIcon}
              aria-hidden="true"
            />

            <h1 id="featured-title" className={styles.sectionTitle}>
              Videojuegos destacados
            </h1>
          </div>

          <GameGrid games={featuredGames} />
        </section>
      </main>
    </div>
  );
}

export default App;
