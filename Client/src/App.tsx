import { useState, useRef } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { LoaderCircle } from "lucide-react";
import { Home } from "./pages/Home/Home";
import { Header } from "./components/Header/Header";
import { About } from "./pages/About/About";
import { MyLibrary } from "./pages/MyLibrary/MyLibrary";
import { GameDetails } from "./components/GameDetails/GameDetails";
import { Footer } from "./components/Footer/Footer";
import { rawgApi } from "./utils/rawgApi";
import type { Game, GameDetail } from "./types/game";
import styles from "./App.module.css";

export function App() {
  const isHome = useLocation().pathname === "/";

  const [selectedGame, setSelectedGame] = useState<GameDetail | null>(null);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState<string | null>(null);

  const requestIdRef = useRef(0);

  const openGameDetails = async (game: Game) => {
    const requestId = ++requestIdRef.current;

    setSelectedGame(null);
    setIsDetailLoading(true);
    setDetailError(null);

    try {
      const gameInfo = await rawgApi.getGameById(game.id);

      if (requestId !== requestIdRef.current) return;

      setSelectedGame(gameInfo);
    } catch (error) {
      if (requestId !== requestIdRef.current) return;

      console.error("Error al cargar detalles:", error);

      setDetailError("No se pudieron cargar los detalles");
    } finally {
      if (requestId === requestIdRef.current) {
        setIsDetailLoading(false);
      }
    }
  };

  const closeGameDetails = () => {
    requestIdRef.current += 1;
    setSelectedGame(null);
  };
  const closeDetailError = () => {
    setDetailError(null);
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
        {isDetailLoading && (
          <div className={styles.loadingOverlay}>
            <div className={styles.loadingContent} role="status">
              <LoaderCircle
                size={40}
                className={styles.spinner}
                aria-hidden="true"
              />
              <p>Cargando detalles...</p>
            </div>
          </div>
        )}

        {detailError && (
          <div className={styles.loadingOverlay}>
            <div className={styles.loadingContent} role="alert">
              <p>{detailError}</p>
              <button type="button" onClick={closeDetailError}>
                Cerrar
              </button>
            </div>
          </div>
        )}
        {selectedGame && (
          <GameDetails game={selectedGame} onClose={closeGameDetails} />
        )}
      </main>
      <Footer />
    </div>
  );
}
