import { useState } from "react";
import { BookOpen } from "lucide-react";

import { PageLayout } from "../../components/PageLayout/PageLayout";
import { GameSection } from "../../components/GameSection/GameSection";

import {
  LibraryStats,
  type LibraryFilter,
} from "../../components/LibraryStats/LibraryStats";

import { useLibrary } from "../../hooks/useLibrary";
import type { Game } from "../../types/game";

interface MyLibraryProps {
  onOpenDetails: (game: Game) => void;
}

const filterLabels: Record<LibraryFilter, string> = {
  all: "Mis juegos",
  favorites: "Favoritos",
  playing: "Jugando",
  completed: "Completados",
  pending: "Pendientes",
  abandoned: "Abandonados",
};

export function MyLibrary({ onOpenDetails }: MyLibraryProps) {
  const { library, favorites } = useLibrary();

  const [selectedFilter, setSelectedFilter] = useState<LibraryFilter>("all");

  const counts: Record<LibraryFilter, number> = {
    all: library.length,
    favorites: favorites.length,
    playing: library.filter((entry) => entry.status === "playing").length,
    completed: library.filter((entry) => entry.status === "completed").length,
    pending: library.filter(
      (entry) => (entry.status ?? "pending") === "pending",
    ).length,
    abandoned: library.filter((entry) => entry.status === "abandoned").length,
  };

  const displayedGames =
    selectedFilter === "favorites"
      ? favorites
      : library
          .filter(
            (entry) =>
              selectedFilter === "all" ||
              (entry.status ?? "pending") === selectedFilter,
          )
          .map((entry) => entry.game);

  const sectionTitle = filterLabels[selectedFilter];

  const emptyMessage =
    selectedFilter === "favorites"
      ? "Todavía no tienes videojuegos favoritos."
      : selectedFilter === "all"
        ? "Tu biblioteca está vacía. Explora el catálogo y agrega videojuegos."
        : `No tienes videojuegos en la categoría ${sectionTitle.toLowerCase()}.`;

  return (
    <PageLayout
      sidebarFirstOnMobile
      sidebar={
        <LibraryStats
          selectedFilter={selectedFilter}
          counts={counts}
          onFilterChange={setSelectedFilter}
        />
      }
    >
      <GameSection
        title={sectionTitle}
        icon={<BookOpen size={22} />}
        games={displayedGames}
        onOpenDetails={onOpenDetails}
        emptyMessage={emptyMessage}
        showStatusSelect={selectedFilter !== "favorites"}
        headingLevel="h1"
      />
    </PageLayout>
  );
}
