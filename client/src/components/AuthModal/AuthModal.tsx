import { useEffect, useId, useRef, useState } from "react";
import { X } from "lucide-react";
import styles from "./AuthModal.module.css";
import type { SubmitEvent } from "react";
import { api } from "../../utils/api";

interface AuthModalProps {
  onClose: () => void;
  onSignInSuccess: (token: string) => Promise<void>;
}

export function AuthModal({ onClose, onSignInSuccess }: AuthModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const isRegister = mode === "register";

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

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isSubmitting) return;

    const formData = new FormData(event.currentTarget);

    const username = String(formData.get("username") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");

    setError(null);
    setSuccessMessage(null);
    setIsSubmitting(true);

    try {
      if (isRegister) {
        await api.signup({ username, email, password });

        setMode("login");
        setSuccessMessage("Cuenta creada correctamente.");
      } else {
        const { token } = await api.signin({ email, password });

        await onSignInSuccess(token);
      }
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "No se pudo completar la solicitud.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <dialog
      ref={dialogRef}
      className={styles.dialog}
      aria-labelledby={titleId}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
    >
      <div className={styles.header}>
        <h2 id={titleId}>{isRegister ? "Crear cuenta" : "Iniciar sesión"}</h2>

        <button
          type="button"
          className={styles.closeButton}
          onClick={onClose}
          aria-label="Cerrar"
        >
          <X size={22} aria-hidden="true" />
        </button>
      </div>

      <form key={mode} className={styles.form} onSubmit={handleSubmit}>
        {isRegister && (
          <div className={styles.field}>
            <label htmlFor="auth-username">Nombre de usuario</label>
            <input
              id="auth-username"
              name="username"
              type="text"
              placeholder="Usuario01"
              autoComplete="username"
              minLength={3}
              maxLength={24}
              pattern="[a-zA-Z0-9_]{3,24}"
              required
              autoFocus
            />
          </div>
        )}

        <div className={styles.field}>
          <label htmlFor="auth-email">Correo electrónico</label>
          <input
            id="auth-email"
            name="email"
            type="email"
            placeholder="correo@gmail.com"
            autoComplete="email"
            required
            autoFocus={!isRegister}
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="auth-password">Contraseña</label>
          <input
            id="auth-password"
            name="password"
            type="password"
            placeholder="••••••••"
            autoComplete={isRegister ? "new-password" : "current-password"}
            minLength={isRegister ? 8 : undefined}
            required
          />
        </div>
        {error && (
          <p className={styles.error} role="alert">
            {error}
          </p>
        )}

        {successMessage && (
          <p className={styles.success} role="status">
            {successMessage}
          </p>
        )}
        <button
          type="submit"
          className={styles.submitButton}
          disabled={isSubmitting}
        >
          {isSubmitting
            ? isRegister
              ? "Registrando..."
              : "Iniciando sesión..."
            : isRegister
              ? "Crear mi cuenta"
              : "Iniciar sesión"}
        </button>
      </form>

      <div className={styles.footer}>
        <span>
          {isRegister ? "¿Ya tienes una cuenta?" : "¿Aun no tienes una cuenta?"}
        </span>

        <button
          type="button"
          className={styles.switchButton}
          onClick={() => {
            setMode(isRegister ? "login" : "register");
            setError(null);
            setSuccessMessage(null);
          }}
          disabled={isSubmitting}
        >
          {isRegister ? "Iniciar sesión" : "Registrarse"}
        </button>
      </div>
    </dialog>
  );
}
