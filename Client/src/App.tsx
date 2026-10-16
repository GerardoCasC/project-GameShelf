import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import { Home } from "./pages/Home/Home";
import { Header } from "./components/Header/Header";
import { About } from "./pages/About/About";
import { MyLibrary } from "./pages/MyLibrary/MyLibrary";
import { GameDetails } from "./components/GameDetails/GameDetails";

import type { Game, GameDetail } from "./types/game";
import styles from "./App.module.css";
import gamesData from "./data/games.json";
import { exampleGameDetail } from "./data/gameDetails";
export function App() {
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
        <Routes>
          <Route
            path="/"
            element={
              <Home games={featuredGames} onOpenDetails={openGameDetails} />
            }
          />

          <Route
            path="/library"
            element={<MyLibrary onOpenDetails={openGameDetails} />}
          />
          <Route path="/about" element={<About />} />
        </Routes>

        {selectedGame && (
          <GameDetails game={selectedGame} onClose={closeGameDetails} />
        )}
      </main>
    </div>
  );
}
