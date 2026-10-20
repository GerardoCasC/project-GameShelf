import { Route, Routes, useLocation } from "react-router-dom";
import { Home } from "./pages/Home/Home";
import { Header } from "./components/Header/Header";
import { About } from "./pages/About/About";
import { MyLibrary } from "./pages/MyLibrary/MyLibrary";
import { GameDetails } from "./components/GameDetails/GameDetails";
import { Footer } from "./components/Footer/Footer";
import { Loading } from "./components/Loading/Loading";
import { ErrorMessage } from "./components/ErrorMessage/ErrorMessage";
import { rawgApi } from "./utils/rawgApi";
import { useAsyncRequest } from "./hooks/useAsyncRequest";
import type { Game, GameDetail } from "./types/game";
import styles from "./App.module.css";

export function App() {
  const isHome = useLocation().pathname === "/";

  const {
    data: selectedGame,
    status: detailStatus,
    error: detailError,
    execute: loadGameDetails,
    reset: resetGameDetails,
  } = useAsyncRequest<GameDetail>();

  function openGameDetails(game: Game) {
    void loadGameDetails(
      () => rawgApi.getGameById(game.id),
      "No se pudieron cargar los detalles del videojuego.",
    );
  }

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
        {detailStatus === "loading" && (
          <Loading
            message="Cargando detalles del videojuego..."
            variant="overlay"
          />
        )}

        {detailError && (
          <ErrorMessage
            message={detailError}
            variant="overlay"
            onDismiss={resetGameDetails}
          />
        )}

        {selectedGame && (
          <GameDetails game={selectedGame} onClose={resetGameDetails} />
        )}
      </main>
      <Footer />
    </div>
  );
}
