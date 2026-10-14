import { House, BookOpen } from "lucide-react";
import logo from "../../assets/logo.webp";
import styles from "./Header.module.css";

function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <a
          href="#inicio"
          className={styles.logoLink}
          aria-label="Ir al inicio de Runaria"
        >
          <img src={logo} alt="Runaria" className={styles.logo} />
        </a>

        <nav aria-label="Navegación principal">
          <ul className={styles.navList}>
            <li>
              <a
                href="#inicio"
                className={`${styles.navLink} ${styles.activeLink}`}
                aria-current="location"
              >
                <House size={18} aria-hidden="true" />
                <span>Inicio</span>
              </a>
            </li>

            <li>
              <a href="#biblioteca" className={styles.navLink}>
                <BookOpen size={18} aria-hidden="true" />
                <span>Mi biblioteca</span>
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Header;
