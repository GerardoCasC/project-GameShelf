import { Route, Routes, useLocation } from "react-router-dom";
import { useState } from "react";
import { Home } from "./pages/Home/Home";
import { Header } from "./components/Header/Header";
import { About } from "./pages/About/About";
import { MyLibrary } from "./pages/MyLibrary/MyLibrary";
import { GameDetails } from "./components/GameDetails/GameDetails";
import { Footer } from "./components/Footer/Footer";
import { Loading } from "./components/Loading/Loading";
import { ErrorMessage } from "./components/ErrorMessage/ErrorMessage";
import { AuthModal } from "./components/AuthModal/AuthModal";
import { ProtectedRoute } from "./components/ProtectedRoute/ProtectedRoute";
import { api } from "./utils/api";
import { useAsyncRequest } from "./hooks/useAsyncRequest";
import { useCurrentUser } from "./hooks/useCurrentUser";
import type { Game, GameDetail } from "./types/game";
import styles from "./App.module.css";

export function App() {
  const [isAuthOpen, setIsAuthModalOpen] = useState(false);
  const isHome = useLocation().pathname === "/";
  const { login } = useCurrentUser();

  const {
    data: selectedGame,
    status: detailStatus,
    error: detailError,
    execute: loadGameDetails,
    reset: resetGameDetails,
  } = useAsyncRequest<GameDetail>();

  function openGameDetails(game: Game) {
    void loadGameDetails(
      () => api.getGameById(game.id),
      "No se pudieron cargar los detalles",
    );
  }

  return (
    <div className={styles.app} id="inicio">
      <Header
        overlay={isHome}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
      />
      <main className={`${styles.main} ${isHome ? styles.mainHome : ""}`}>
        <Routes>
          <Route path="/" element={<Home onOpenDetails={openGameDetails} />} />

          <Route
            path="/library"
            element={
              <ProtectedRoute>
                <MyLibrary onOpenDetails={openGameDetails} />
              </ProtectedRoute>
            }
          />
          <Route path="/about" element={<About />} />
        </Routes>
        {detailStatus === "loading" && (
          <Loading message="Cargando detalles..." variant="overlay" />
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
      {isAuthOpen && (
        <AuthModal
          onClose={() => setIsAuthModalOpen(false)}
          onSignInSuccess={async (token) => {
            await login(token);
            setIsAuthModalOpen(false);
          }}
        />
      )}
      <Footer />
    </div>
  );
}
