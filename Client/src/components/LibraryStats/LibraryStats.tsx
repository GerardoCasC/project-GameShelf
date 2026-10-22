import {
  BarChart3,
  Gamepad2,
  Heart,
  PlayCircle,
  CheckCircle2,
  Clock3,
  CircleX,
  type LucideIcon,
} from "lucide-react";

import type { GameStatus } from "../../types/game";
import styles from "./LibraryStats.module.css";

export type LibraryFilter = "all" | "favorites" | GameStatus;

interface LibraryStatsProps {
  selectedFilter: LibraryFilter;
  counts: Record<LibraryFilter, number>;
  onFilterChange: (filter: LibraryFilter) => void;
}

interface StatOption {
  value: LibraryFilter;
  label: string;
  icon: LucideIcon;
}

const statOptions: StatOption[] = [
  { value: "all", label: "Mis juegos", icon: Gamepad2 },
  { value: "favorites", label: "Favoritos", icon: Heart },
  { value: "playing", label: "Jugando", icon: PlayCircle },
  { value: "completed", label: "Completados", icon: CheckCircle2 },
  { value: "pending", label: "Pendientes", icon: Clock3 },
  { value: "abandoned", label: "Abandonados", icon: CircleX },
];

export function LibraryStats({
  selectedFilter,
  counts,
  onFilterChange,
}: LibraryStatsProps) {
  return (
    <section className={styles.container} aria-labelledby="library-stats-title">
      <div className={styles.header}>
        <BarChart3 size={22} aria-hidden="true" />
        <h2 id="library-stats-title">Mis estadísticas</h2>
      </div>

      <div className={styles.grid}>
        {statOptions.map((option) => {
          const Icon = option.icon;

          return (
            <button
              key={option.value}
              type="button"
              className={`${styles.statButton} ${styles[option.value]}`}
              aria-pressed={selectedFilter === option.value}
              onClick={() => onFilterChange(option.value)}
            >
              <span className={styles.statTop}>
                <Icon size={29} aria-hidden="true" />
                <strong className={styles.count}>{counts[option.value]}</strong>
              </span>

              <span className={styles.label}>{option.label}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
