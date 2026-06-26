"use client";

import styles from "./SearchBar.module.css";
import Reveal from "../ui/Reveal";

const SearchBar = ({ search, setSearch, resultCount }) => {

    const hasFilters = search !== "";

    const resetAll = () => {
        setSearch("");
    };

    return (
        <Reveal>
            <div className={styles.wrapper}>

                <div className={styles.top}>
                    <span className={styles.label} />
                    {hasFilters && (
                        <span className={styles.resultBadge}>
                            {resultCount} speaker{resultCount > 1 ? "s" : ""} found
                        </span>
                    )}
                </div>

                <div className={styles.row}>
                    <div className={styles.inputWrapper}>
                        <input
                            type="text"
                            placeholder="Find Speaker..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className={styles.input}
                        />
                        {search && (
                            <button className={styles.clearBtn} onClick={() => setSearch("")}>
                                ✕
                            </button>
                        )}
                    </div>
                </div>

                {hasFilters && (
                    <div className={styles.resetRow}>
                        <button className={styles.resetBtn} onClick={resetAll}>
                            ✕ Réinitialiser les filtres
                        </button>
                    </div>
                )}

            </div>
        </Reveal>
    );
};

export default SearchBar;