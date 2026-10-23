import { LoaderCircle } from "lucide-react";
import styles from "./Loading.module.css";

interface LoadingProps {
  message?: string;
  variant?: "inline" | "overlay";
}

export function Loading({
  message = "Cargando...",
  variant = "inline",
}: LoadingProps) {
  const content = (
    <div className={styles.content} role="status">
      <LoaderCircle size={36} className={styles.spinner} aria-hidden="true" />

      <p>{message}</p>
    </div>
  );

  if (variant === "overlay") {
    return <div className={styles.overlay}>{content}</div>;
  }

  return <div className={styles.inline}>{content}</div>;
}
