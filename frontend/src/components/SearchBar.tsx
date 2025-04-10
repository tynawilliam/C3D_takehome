import React from "react";
import styles from "./SearchBar.module.css";

interface Props {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
}

const SearchBar: React.FC<Props> = ({ value, onChange, onSubmit }) => {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      className={styles.wrapper}
    >
      <input
        type="search"
        placeholder="Search students…"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={styles.input}
        aria-label="Search students"
      />
      <button type="submit" className={styles.button}>
        Search
      </button>
    </form>
  );
};

export default SearchBar;
