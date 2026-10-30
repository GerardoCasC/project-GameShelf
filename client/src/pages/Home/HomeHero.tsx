import { SearchBar } from "../../components/SearchBar/SearchBar";
import styles from "./HomeHero.module.css";

interface HomeHeroProps {
  onSearch: (query: string) => void;
}

export function HomeHero({ onSearch }: HomeHeroProps) {
  return (
    <section className={styles.hero} aria-labelledby="hero-title">
      <div className={styles.content}>
        <p className={styles.eyebrow}>TU COLECCIÓN. TUS HISTORIAS.</p>

        <h1 id="hero-title" className={styles.title}>
          Todos tus videojuegos
          <br />
          en <span>un solo lugar</span>
        </h1>

        <p className={styles.description}>
          Descubre nuevos mundos, encuentra tus videojuegos favoritos y organiza
          tu aventura gamer con Runaria.
        </p>

        <div className={styles.search}>
          <SearchBar onSearch={onSearch} />
        </div>
      </div>
    </section>
  );
}
