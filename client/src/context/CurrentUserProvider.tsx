import { useEffect, useRef, useState, type ReactNode } from "react";
import { CurrentUserContext } from "./CurrentUserContext";
import type { User } from "../types/auth";
import { api } from "../utils/api";

interface CurrentUserProviderProps {
  children: ReactNode;
}

export function CurrentUserProvider({ children }: CurrentUserProviderProps) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(() =>
    Boolean(localStorage.getItem("runaria_token")),
  );
  const [authError, setAuthError] = useState<string | null>(null);

  const requestId = useRef(0);

  const isAuth = currentUser !== null;

  async function login(token: string): Promise<void> {
    const id = ++requestId.current;

    localStorage.setItem("runaria_token", token);

    try {
      const user = await api.getCurrentUser();

      if (id === requestId.current) {
        setCurrentUser(user);
      }
    } catch (error) {
      if (
        id === requestId.current &&
        (error as { status?: number }).status === 401
      ) {
        localStorage.removeItem("runaria_token");
        setCurrentUser(null);
      }

      throw error;
    } finally {
      if (id === requestId.current) {
        setIsCheckingAuth(false);
      }
    }
  }

  function logout(): void {
    requestId.current++;

    localStorage.removeItem("runaria_token");
    setCurrentUser(null);
    setIsCheckingAuth(false);
  }

  useEffect(() => {
    const id = ++requestId.current;
    const token = localStorage.getItem("runaria_token");
    let active = true;

    if (!token) {
      return;
    }

    api
      .getCurrentUser()
      .then((user) => {
        if (active && id === requestId.current) {
          setCurrentUser(user);
        }
      })
      .catch((error) => {
        if (!active || id !== requestId.current) {
          return;
        }

        if ((error as { status?: number }).status === 401) {
          localStorage.removeItem("runaria_token");
          setCurrentUser(null);
        } else {
          setAuthError("No se pudo verificar tu sesión.");
        }
      })
      .finally(() => {
        if (active && id === requestId.current) {
          setIsCheckingAuth(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <CurrentUserContext.Provider
      value={{
        currentUser,
        isAuth,
        isCheckingAuth,
        authError,
        login,
        logout,
      }}
    >
      {children}
    </CurrentUserContext.Provider>
  );
}
