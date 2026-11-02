import { Gamepad2 } from "lucide-react";
import { FaGithub } from "react-icons/fa6";
import { Link } from "react-router-dom";
import styles from "./Footer.module.css";

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.columns}>
          <div className={styles.brand}>
            <div className={styles.brandHeader}>
              <Gamepad2 size={24} aria-hidden="true" />
              <span className={styles.brandName}>Runaria</span>
            </div>

            <p className={styles.description}>
              Descubre videojuegos y organiza tu biblioteca personal.
            </p>
          </div>

          <nav
            className={styles.navigation}
            aria-label="Navegación del pie de página"
          >
            <h2 className={styles.title}>Explorar</h2>

            <ul className={styles.links}>
              <li>
                <Link to="/">Inicio</Link>
              </li>
              <li>
                <Link to="/library">Mi biblioteca</Link>
              </li>
              <li>
                <Link to="/about">Sobre el autor</Link>
              </li>
            </ul>
          </nav>

          <div className={styles.project}>
            <h2 className={styles.title}>Proyecto</h2>

            <a
              href="https://github.com/GerardoCasC/project-GameShelf"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.githubLink}
            >
              <FaGithub size={18} aria-hidden="true" />
              <span>GitHub</span>
            </a>

            <p className={styles.attribution}>
              Datos proporcionados por{" "}
              <a
                href="https://rawg.io/"
                target="_blank"
                rel="noopener noreferrer"
              >
                RAWG
              </a>
            </p>
          </div>
        </div>

        <div className={styles.bottom}>
          <p>
            © {new Date().getFullYear()} Runaria · Proyecto de desarrollo web
          </p>
        </div>
      </div>
    </footer>
  );
}
