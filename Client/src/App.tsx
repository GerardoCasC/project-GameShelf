import { useState } from "react";
import { Star } from "lucide-react";
import Header from "./components/Header/Header";
import { GameGrid } from "./components/GameGrid/GameGrid";
import gamesData from "./data/games.json";
import { MyLibrary } from "./components/MyLibrary/MyLibrary";
import { GameDetails } from "./components/GameDetails/GameDetails";
import type { Game, GameDetail } from "./types/game";
import { exampleGameDetail } from "./data/gameDetails";
import styles from "./App.module.css";

function App() {
  const games: Game[] = gamesData;
  const featuredGames = games.slice(0, 5);

  const [selectedGame, setSelectedGame] = useState<GameDetail | null>(null);

  const openGameDetails = (game: Game) => {
    setSelectedGame(
      game.id === exampleGameDetail.id ? exampleGameDetail : game,
    );
  };

  const closeGameDetails = () => {
    setSelectedGame(null);
  };
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
          <GameGrid games={featuredGames} onOpenDetails={openGameDetails} />
        </section>
        <MyLibrary onOpenDetails={openGameDetails} />
        {selectedGame && (
          <GameDetails game={selectedGame} onClose={closeGameDetails} />
        )}
      </main>
    </div>
  );
}

export default App;
