import { BookOpen } from "lucide-react";
import { PageLayout } from "../../components/PageLayout/PageLayout";
import { GameSection } from "../../components/GameSection/GameSection";
import gamesData from "../../data/games.json";
import type { Game } from "../../types/game";

interface MyLibraryProps {
  onOpenDetails: (game: Game) => void;
}

const games: Game[] = gamesData;

const libraryGames = [games[0], games[2], games[3]];

export function MyLibrary({ onOpenDetails }: MyLibraryProps) {
  return (
    <PageLayout>
      <GameSection
        title="Mi biblioteca"
        icon={<BookOpen size={22} />}
        games={libraryGames}
        onOpenDetails={onOpenDetails}
      />
    </PageLayout>
  );
}
