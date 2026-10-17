import { useEffect, useState } from "react";
import { Star, Search } from "lucide-react";
import { HomeHero } from "./HomeHero";
import { PageLayout } from "../../components/PageLayout/PageLayout";
import { GameSection } from "../../components/GameSection/GameSection";
import { rawgApi } from "../../utils/rawgApi";
import type { Game } from "../../types/game";
import styles from "./Home.module.css";

interface HomeProps {
  onOpenDetails: (game: Game) => void;
}

export function Home({ onOpenDetails }: HomeProps) {
  const [games, setGames] = useState<Game[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState({
    query: "",
    requestId: 0,
  });

  useEffect(() => {
    let active = true;

    async function loadGames() {
      try {
        const data = await rawgApi.getGames({
          search: search.query,
          page: 1,
          page_size: 12,
        });

        if (active) {
          setGames(data.results);
        }
      } catch {
        if (active) {
          setError("No se pudieron cargar los videojuegos.");
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    }

    void loadGames();

    return () => {
      active = false;
    };
  }, [search]);

  function handleSearch(query: string) {
    setIsLoading(true);
    setError(null);

    setSearch((previous) => ({
      query,
      requestId: previous.requestId + 1,
    }));
  }

  return (
    <>
      <HomeHero onSearch={handleSearch} />
      <div className={styles.catalog}>
        <PageLayout>
          {isLoading && <p role="status">Buscando videojuegos...</p>}

          {error && <p role="alert">{error}</p>}

          {!isLoading && !error && games.length === 0 && (
            <p role="status">No se encontraron videojuegos.</p>
          )}

          {!isLoading && !error && games.length > 0 && (
            <GameSection
              title={
                search.query
                  ? "Resultados de búsqueda"
                  : "Videojuegos destacados"
              }
              icon={
                search.query ? (
                  <Search size={20} />
                ) : (
                  <Star size={20} fill="currentColor" />
                )
              }
              games={games}
              onOpenDetails={onOpenDetails}
            />
          )}
        </PageLayout>
      </div>
    </>
  );
}
