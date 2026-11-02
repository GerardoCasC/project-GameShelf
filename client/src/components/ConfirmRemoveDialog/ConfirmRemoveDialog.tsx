import { useEffect, useId, useRef } from "react";
import { ErrorMessage } from "../ErrorMessage/ErrorMessage";
import styles from "./ConfirmRemoveDialog.module.css";

interface ConfirmRemoveDialogProps {
  gameName: string;
  onConfirm: () => void;
  onCancel: () => void;
  isProcessing?: boolean;
  error?: string | null;
}

export function ConfirmRemoveDialog({
  gameName,
  onConfirm,
  onCancel,
  isProcessing = false,
  error = null,
}: ConfirmRemoveDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;

    if (!dialog) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    if (!dialog.open) {
      dialog.showModal();
    }

    return () => {
      if (dialog.open) {
        dialog.close();
      }
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  return (
    <dialog
      ref={dialogRef}
      className={styles.dialog}
      aria-labelledby={titleId}
      onClick={(event) => event.stopPropagation()}
      onCancel={(event) => {
        event.preventDefault();
        event.stopPropagation();
        onCancel();
      }}
    >
      <h2 id={titleId}>¿Eliminar de mi biblioteca?</h2>

      <p>
        ¿Seguro que quieres eliminar
        <strong> {gameName} </strong>
        de tu biblioteca?
      </p>
      {error && <ErrorMessage message={error} />}
      <div className={styles.actions}>
        <button
          type="button"
          onClick={onCancel}
          autoFocus
          disabled={isProcessing}
        >
          Cancelar
        </button>

        <button
          type="button"
          className={styles.confirmButton}
          onClick={onConfirm}
          disabled={isProcessing}
        >
          {isProcessing ? "Eliminando..." : "Eliminar"}
        </button>
      </div>
    </dialog>
  );
}
