import { AlertCircle } from "lucide-react";
import styles from "./ErrorMessage.module.css";

interface ErrorMessageProps {
  message: string;
  variant?: "inline" | "overlay";
  onDismiss?: () => void;
}

export function ErrorMessage({
  message,
  variant = "inline",
  onDismiss,
}: ErrorMessageProps) {
  const content = (
    <div className={styles.content} role="alert">
      <AlertCircle size={28} aria-hidden="true" />

      <p>{message}</p>

      {onDismiss && (
        <button
          type="button"
          className={styles.button}
          onClick={onDismiss}
          autoFocus={variant === "overlay"}
        >
          Cerrar
        </button>
      )}
    </div>
  );

  if (variant === "overlay") {
    return <div className={styles.overlay}>{content}</div>;
  }

  return <div className={styles.inline}>{content}</div>;
}
