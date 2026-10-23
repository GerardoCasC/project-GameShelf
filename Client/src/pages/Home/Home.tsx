import { useEffect, useState, useCallback } from "react";
import { Star, Search, BookOpen } from "lucide-react";
import { HomeHero } from "./HomeHero";
import { PageLayout } from "../../components/PageLayout/PageLayout";
import { GameSection } from "../../components/GameSection/GameSection";
import { GameFilters } from "../../components/GameFilters/GameFilters";
import { Loading } from "../../components/Loading/Loading";
import { ErrorMessage } from "../../components/ErrorMessage/ErrorMessage";
import { rawgApi } from "../../utils/rawgApi";
import { useAsyncRequest } from "../../hooks/useAsyncRequest";
import { useLibrary } from "../../hooks/useLibrary";
import type { Game } from "../../types/game";
import type { FilterOptions, RawgGamesResponse } from "../../types/rawg";
import styles from "./Home.module.css";

interface HomeProps {
  onOpenDetails: (game: Game) => void;
}

export function Home({ onOpenDetails }: HomeProps) {
  //  Games  //

  const [games, setGames] = useState<Game[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const { library } = useLibrary();
  const libraryGames = library.map((entry) => entry.game);
  const {
    status: catalogStatus,
    error: catalogError,
    execute: loadCatalog,
  } = useAsyncRequest<RawgGamesResponse>();

  const isLoading =
    page === 1 && (catalogStatus === "idle" || catalogStatus === "loading");
  const isLoadingMore = page > 1 && catalogStatus === "loading";
  const error = page === 1 ? catalogError : null;
  const loadMoreError = page > 1 ? catalogError : null;

  function handleLoadMore() {
    if (!hasMore || catalogStatus === "loading") return;

    if (loadMoreError) {
      setRetryCount((previous) => previous + 1);
    } else {
      setPage((previous) => previous + 1);
    }
  }

  //  Filters //
  const [selectedGenre, setSelectedGenre] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState("");

  const {
    data: filterOptions,
    status: filtersStatus,
    error: filtersError,
    execute: loadFilters,
  } = useAsyncRequest<FilterOptions>();

  const genres = filterOptions?.genres ?? [];
  const platforms = filterOptions?.platforms ?? [];
  const filtersLoading =
    filtersStatus === "idle" || filtersStatus === "loading";

  function handleGenreChange(genre: string) {
    setPage(1);
    setSelectedGenre(genre);
  }

  function handlePlatformChange(platform: string) {
    setPage(1);
    setSelectedPlatform(platform);
  }

  function handleClearFilters() {
    setPage(1);
    setSelectedGenre("");
    setSelectedPlatform("");
  }

  // Search //
  const [search, setSearch] = useState({
    query: "",
    requestId: 0,
  });

  function handleSearch(query: string) {
    setPage(1);

    setSearch((previous) => ({
      query,
      requestId: previous.requestId + 1,
    }));
  }

  const loadGamesData = useCallback(() => {
    let active = true;

    async function loadGames() {
      const result = await loadCatalog(
        () =>
          rawgApi.getGames({
            search: search.query,
            genres: selectedGenre,
            platforms: selectedPlatform,
            page,
            page_size: 10,
          }),
        "No se pudieron cargar los videojuegos.",
      );

      if (!active || !result) return;

      setGames((previousGames) => {
        if (page === 1) {
          return result.results;
        }

        const existingIds = new Set(previousGames.map((game) => game.id));

        const newGames = result.results.filter(
          (game) => !existingIds.has(game.id),
        );

        return [...previousGames, ...newGames];
      });

      setHasMore(Boolean(result.next));
    }

    void loadGames();

    return () => {
      active = false;
    };
  }, [search, selectedGenre, selectedPlatform, page, retryCount, loadCatalog]);

  useEffect(() => {
    loadGamesData();
  }, [loadGamesData]);

  const loadFiltersData = useCallback(() => {
    void loadFilters(async () => {
      const [genresData, platformsData] = await Promise.all([
        rawgApi.getGenres(),
        rawgApi.getPlatforms(),
      ]);

      return {
        genres: genresData.results,
        platforms: platformsData.results,
      };
    }, "No se pudieron cargar los filtros.");
  }, [loadFilters]);

  useEffect(() => {
    loadFiltersData();
  }, [loadFiltersData]);

  return (
    <>
      <HomeHero onSearch={handleSearch} />
      <div className={styles.catalog}>
        <PageLayout
          sidebarFirstOnMobile
          sidebar={
            filtersLoading ? (
              <Loading message="Cargando filtros..." />
            ) : filtersError ? (
              <ErrorMessage message={filtersError} onRetry={loadFiltersData} />
            ) : (
              <GameFilters
                genres={genres}
                platforms={platforms}
                selectedGenre={selectedGenre}
                selectedPlatform={selectedPlatform}
                onGenreChange={handleGenreChange}
                onPlatformChange={handlePlatformChange}
                onClear={handleClearFilters}
              />
            )
          }
        >
          {isLoading && <Loading message="Buscando videojuegos..." />}

          {error && <ErrorMessage message={error} onRetry={loadGamesData} />}

          {!isLoading && !error && (
            <GameSection
              title={
                search.query || selectedGenre || selectedPlatform
                  ? "Resultados de búsqueda"
                  : "Videojuegos destacados"
              }
              icon={
                search.query || selectedGenre || selectedPlatform ? (
                  <Search size={20} />
                ) : (
                  <Star size={20} fill="currentColor" />
                )
              }
              games={games}
              onOpenDetails={onOpenDetails}
              onGenreClick={handleGenreChange}
              hasMore={hasMore}
              isLoadingMore={isLoadingMore}
              loadMoreError={loadMoreError}
              onLoadMore={handleLoadMore}
              emptyMessage="No se encontraron videojuegos."
            />
          )}
          {libraryGames.length > 0 && (
            <GameSection
              title="Mi biblioteca"
              icon={<BookOpen size={22} />}
              games={libraryGames}
              onOpenDetails={onOpenDetails}
              emptyMessage="Tu biblioteca está vacía. Explora el catálogo y agrega tus videojuegos favoritos."
              showStatusSelect
            />
          )}
        </PageLayout>
      </div>
    </>
  );
}
