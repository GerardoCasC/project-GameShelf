import { BookOpen } from "lucide-react";
import { PageLayout } from "../../components/PageLayout/PageLayout";
import { GameSection } from "../../components/GameSection/GameSection";
import { useLibrary } from "../../hooks/useLibrary";
import type { Game } from "../../types/game";

interface MyLibraryProps {
  onOpenDetails: (game: Game) => void;
}

export function MyLibrary({ onOpenDetails }: MyLibraryProps) {
  const { library } = useLibrary();

  const libraryGames = library.map((entry) => entry.game);

  return (
    <PageLayout>
      <GameSection
        title="Mi biblioteca"
        icon={<BookOpen size={22} />}
        games={libraryGames}
        onOpenDetails={onOpenDetails}
        emptyMessage="Tu biblioteca está vacía. Explora el catálogo y agrega tus videojuegos favoritos."
      />
    </PageLayout>
  );
}
