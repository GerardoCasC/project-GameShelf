import { useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { Home } from "./pages/Home/Home";
import { Header } from "./components/Header/Header";
import { About } from "./pages/About/About";
import { MyLibrary } from "./pages/MyLibrary/MyLibrary";
import { GameDetails } from "./components/GameDetails/GameDetails";
import { Footer } from "./components/Footer/Footer";
import type { Game, GameDetail } from "./types/game";
import styles from "./App.module.css";
import { exampleGameDetail } from "./data/gameDetails";

export function App() {
  const isHome = useLocation().pathname === "/";

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
      <Header overlay={isHome} />
      <main className={`${styles.main} ${isHome ? styles.mainHome : ""}`}>
        <Routes>
          <Route path="/" element={<Home onOpenDetails={openGameDetails} />} />

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
      <Footer />
    </div>
  );
}
