import { Code2, ExternalLink, UserRound } from "lucide-react";
import { FaGithub } from "react-icons/fa6";
import styles from "./About.module.css";

const technologies = [
  "React",
  "TypeScript",
  "Vite",
  "NodeJS",
  "MongoDB",
  "Mongoose",
];

export function About() {
  return (
    <section className={styles.about} aria-labelledby="about-title">
      <div className={styles.header}>
        <UserRound size={24} aria-hidden="true" />
        <h1 id="about-title">Sobre el autor</h1>
      </div>

      <div className={styles.content}>
        <div className={styles.introduction}>
          <h2>
            ¡Hola! Mi nombre es Gerardo y soy desarrollador web full-stack
          </h2>

          <p>
            Me apasiona crear aplicaciones para poner a prueba mis
            conocimientos, con ambición a seguir aprendiendo nuevas tecnologías
            para obtener mejores resultados.
          </p>

          <p>
            Runaria es uno de mis proyectos de desarrollo web. Su objetivo es
            permitir que los jugadores descubran videojuegos y organicen su
            biblioteca personal.
          </p>
        </div>

        <div className={styles.technologies}>
          <div className={styles.sectionHeading}>
            <Code2 size={20} aria-hidden="true" />
            <h2>Tecnologías utilizadas</h2>
          </div>

          <ul className={styles.techList}>
            {technologies.map((technology) => (
              <li key={technology} className={styles.techItem}>
                {technology}
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.links}>
          <h2>Conoce el proyecto</h2>

          <p>
            Puedes explorar el repositorio de Runaria y consultar su desarrollo
            en GitHub.
          </p>

          <a
            href="https://github.com/GerardoCasC/project-GameShelf"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.githubLink}
          >
            <FaGithub size={20} aria-hidden="true" />
            <span>Ver repositorio</span>
            <ExternalLink size={16} aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
}
