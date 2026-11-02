import { createContext } from "react";
import type { User } from "../types/auth";

export interface CurrentUserContextValue {
  currentUser: User | null;
  isAuth: boolean;
  isCheckingAuth: boolean;
  authError: string | null;
  login: (token: string) => Promise<void>;
  logout: () => void;
}

export const CurrentUserContext = createContext<CurrentUserContextValue | null>(
  null,
);
