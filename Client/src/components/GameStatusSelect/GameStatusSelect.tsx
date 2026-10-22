import { useEffect, useRef } from "react";
import {
  CirclePlus,
  ChevronDown,
  Gamepad2,
  Bookmark,
  CircleCheck,
  CircleMinus,
  Trash2,
} from "lucide-react";

import type { GameStatus } from "../../types/game";
import styles from "./GameStatusSelect.module.css";

interface GameStatusSelectProps {
  status?: GameStatus;
  isSaved: boolean;
  onChange: (status: GameStatus) => void;
  onRemove?: () => void;
}

const statusOptions = [
  { value: "playing", label: "Jugando", icon: Gamepad2 },
  { value: "pending", label: "Pendiente", icon: Bookmark },
  { value: "completed", label: "Completado", icon: CircleCheck },
  { value: "abandoned", label: "Abandonado", icon: CircleMinus },
] as const;

export function GameStatusSelect({
  status,
  isSaved,
  onChange,
  onRemove,
}: GameStatusSelectProps) {
  const detailsRef = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    function handleOutsideClick(event: PointerEvent) {
      if (
        detailsRef.current &&
        !detailsRef.current.contains(event.target as Node)
      ) {
        detailsRef.current.open = false;
      }
    }

    document.addEventListener("pointerdown", handleOutsideClick);

    return () => {
      document.removeEventListener("pointerdown", handleOutsideClick);
    };
  }, []);

  const currentLabel = isSaved
    ? (statusOptions.find((option) => option.value === status)?.label ??
      "Pendiente")
    : "Agregar a lista";

  function handleSelect(value: GameStatus) {
    onChange(value);

    if (detailsRef.current) {
      detailsRef.current.open = false;
    }
  }

  return (
    <details
      ref={detailsRef}
      className={styles.container}
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          event.preventDefault();
          event.stopPropagation();

          if (detailsRef.current) {
            detailsRef.current.open = false;
          }
        }
      }}
    >
      <summary className={styles.trigger}>
        <span className={styles.triggerContent}>
          <CirclePlus size={19} aria-hidden="true" />
          {currentLabel}
        </span>

        <span className={styles.arrow}>
          <ChevronDown size={18} aria-hidden="true" />
        </span>
      </summary>

      <div
        className={styles.menu}
        role="group"
        aria-label="Estado del videojuego"
      >
        {statusOptions.map((option) => {
          const Icon = option.icon;

          return (
            <button
              key={option.value}
              type="button"
              className={styles.option}
              onClick={() => handleSelect(option.value)}
              aria-pressed={isSaved && status === option.value}
            >
              <Icon size={19} aria-hidden="true" />
              <span>{option.label}</span>
            </button>
          );
        })}
        {isSaved && onRemove && (
          <div className={styles.removeContainer}>
            <button
              type="button"
              className={styles.removeOption}
              onClick={() => {
                detailsRef.current?.removeAttribute("open");
                onRemove();
              }}
            >
              <Trash2 size={19} aria-hidden="true" />
              <span>Eliminar</span>
            </button>
          </div>
        )}
      </div>
    </details>
  );
}
