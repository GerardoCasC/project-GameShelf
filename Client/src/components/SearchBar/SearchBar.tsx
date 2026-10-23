import { useState } from "react";
import type { FormEvent } from "react";
import { Search } from "lucide-react";
import styles from "./SearchBar.module.css";

interface SearchBarProps {
  onSearch: (query: string) => void;
}

export function SearchBar({ onSearch }: SearchBarProps) {
  const [query, setQuery] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    onSearch(query.trim());
  }

  return (
    <form className={styles.searchBar} onSubmit={handleSubmit}>
      <div className={styles.controls}>
        <input
          id="game-search"
          type="search"
          className={styles.input}
          placeholder="Buscar videojuegos"
          aria-label="Buscar videojuegos"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />

        <button type="submit" className={styles.button}>
          <Search size={18} aria-hidden="true" />
          <span>Buscar</span>
        </button>
      </div>
    </form>
  );
}
