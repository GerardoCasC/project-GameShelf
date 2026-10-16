import { Star } from "lucide-react";
import { PageLayout } from "../../components/PageLayout/PageLayout";
import { GameSection } from "../../components/GameSection/GameSection";
import type { Game } from "../../types/game";

interface HomeProps {
  games: Game[];
  onOpenDetails: (game: Game) => void;
}

export function Home({ games, onOpenDetails }: HomeProps) {
  return (
    <PageLayout>
      <GameSection
        title="Videojuegos destacados"
        icon={<Star size={20} fill="currentColor" />}
        games={games}
        onOpenDetails={onOpenDetails}
      />
    </PageLayout>
  );
}
