import { House, BookOpen, UserRound, LogIn, LogOut, User } from "lucide-react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import logo from "../../assets/logo.webp";
import styles from "./Header.module.css";

interface HeaderProps {
  overlay?: boolean;
  onOpenAuthModal: () => void;
}

export function Header({ overlay = false, onOpenAuthModal }: HeaderProps) {
  const { currentUser, isAuth, isCheckingAuth, logout } = useCurrentUser();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/", { replace: true });
  }
  const getNavLinkClass = ({ isActive }: { isActive: boolean }) =>
    `${styles.navLink} ${isActive ? styles.activeLink : ""}`;

  return (
    <header className={`${styles.header} ${overlay ? styles.main : ""}`}>
      <div className={styles.container}>
        <Link
          to="/"
          className={styles.logoLink}
          aria-label="Ir al inicio de Runaria"
        >
          <img src={logo} alt="Runaria" className={styles.logo} />
        </Link>

        <nav aria-label="Navegación principal">
          <ul
            className={`${styles.navList} ${
              !isCheckingAuth && !isAuth ? styles.navLoggedOut : ""
            }`}
          >
            <li>
              <NavLink to="/" end className={getNavLinkClass}>
                <House size={18} aria-hidden="true" />
                <span>Inicio</span>
              </NavLink>
            </li>

            {!isCheckingAuth && isAuth && (
              <li>
                <NavLink to="/library" className={getNavLinkClass}>
                  <BookOpen size={18} aria-hidden="true" />
                  <span>Mi biblioteca</span>
                </NavLink>
              </li>
            )}
            <li>
              <NavLink to="/about" className={getNavLinkClass}>
                <UserRound size={18} aria-hidden="true" />
                <span>Sobre el autor</span>
              </NavLink>
            </li>
            {!isCheckingAuth && (
              <li className={styles.authItem}>
                {isAuth ? (
                  <>
                    {currentUser?.username && (
                      <>
                        <User size={18} aria-hidden="true" />
                        <span className={styles.username}>
                          {currentUser.username}
                        </span>
                      </>
                    )}

                    <button
                      type="button"
                      className={`${styles.navLink} ${styles.navButton}`}
                      onClick={handleLogout}
                    >
                      <LogOut size={18} aria-hidden="true" />
                      <span>Cerrar sesión</span>
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    className={`${styles.navLink} ${styles.navButton}`}
                    onClick={onOpenAuthModal}
                  >
                    <LogIn size={18} aria-hidden="true" />
                    <span>Iniciar sesión</span>
                  </button>
                )}
              </li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
}
