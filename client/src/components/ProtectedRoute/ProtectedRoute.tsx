import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import { AuthModal } from "../AuthModal/AuthModal";
import { ErrorMessage } from "../ErrorMessage/ErrorMessage";
import { Loading } from "../Loading/Loading";

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuth, isCheckingAuth, authError, login } = useCurrentUser();
  const navigate = useNavigate();

  if (isCheckingAuth) {
    return <Loading message="Verificando sesión..." />;
  }
  if (authError && !isAuth) {
    return (
      <ErrorMessage
        message={authError}
        variant="overlay"
        onRetry={() => window.location.reload()}
      />
    );
  }

  if (!isAuth) {
    return (
      <AuthModal
        onClose={() => navigate("/", { replace: true })}
        onSignInSuccess={login}
      />
    );
  }

  return <>{children}</>;
}
