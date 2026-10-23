import { House, BookOpen, UserRound } from "lucide-react";
import { Link, NavLink } from "react-router-dom";
import logo from "../../assets/logo.webp";
import styles from "./Header.module.css";

interface HeaderProps {
  overlay?: boolean;
}

export function Header({ overlay = false }: HeaderProps) {
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
          <ul className={styles.navList}>
            <li>
              <NavLink to="/" end className={getNavLinkClass}>
                <House size={18} aria-hidden="true" />
                <span>Inicio</span>
              </NavLink>
            </li>

            <li>
              <NavLink to="/library" className={getNavLinkClass}>
                <BookOpen size={18} aria-hidden="true" />
                <span>Mi biblioteca</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/about" className={getNavLinkClass}>
                <UserRound size={18} aria-hidden="true" />
                <span>Sobre el autor</span>
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
