import { useEffect, useId, useRef } from "react";
import styles from "./ConfirmRemoveDialog.module.css";

interface ConfirmRemoveDialogProps {
  gameName: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmRemoveDialog({
  gameName,
  onConfirm,
  onCancel,
}: ConfirmRemoveDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;

    dialog?.showModal();

    return () => {
      if (dialog?.open) dialog.close();
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

      <div className={styles.actions}>
        <button type="button" onClick={onCancel} autoFocus>
          Cancelar
        </button>

        <button
          type="button"
          className={styles.confirmButton}
          onClick={onConfirm}
        >
          Eliminar videojuego
        </button>
      </div>
    </dialog>
  );
}
