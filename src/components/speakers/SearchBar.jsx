"use client";

import styles from "./SearchBar.module.css";

const SearchBar = ({
                       search,
                       setSearch,
                       selectedSession,
                       setSelectedSession,
                       sessions,
                       resultCount,
                   }) => {

    const hasFilters = search !== "" || selectedSession !== "all";

    const resetAll = () => {
        setSearch("");
        setSelectedSession("all");
    };

    return (
        <div className={styles.wrapper}>

            <div className={styles.top}>
                <span className={styles.label}>
                    🔍 Rechercher un intervenant
                </span>

                {hasFilters && (
                    <span className={styles.resultBadge}>
                        {resultCount} résultat{resultCount > 1 ? "s" : ""}
                    </span>
                )}
            </div>

            <div className={styles.row}>

                {/* Input */}
                <div className={styles.inputWrapper}>
                    <input
                        type="text"
                        placeholder="Nom, bio..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className={styles.input}
                    />
                    {search && (
                        <button
                            className={styles.clearBtn}
                            onClick={() => setSearch("")}
                        >
                            ✕
                        </button>
                    )}
                </div>

                {/* Select */}
                <div className={styles.selectWrapper}>
                    <select
                        value={selectedSession}
                        onChange={(e) => setSelectedSession(e.target.value)}
                        className={styles.select}
                    >
                        <option value="all">
                            Toutes les sessions ({sessions.length})
                        </option>
                        {sessions.map((s) => (
                            <option key={s.id} value={s.id}>
                                {s.title} — {s.speakers.length} intervenant
                                {s.speakers.length > 1 ? "s" : ""}
                            </option>
                        ))}
                    </select>
                </div>

            </div>

            {hasFilters && (
                <div className={styles.resetRow}>
                    <button
                        className={styles.resetBtn}
                        onClick={resetAll}
                    >
                        ✕ Réinitialiser les filtres
                    </button>
                </div>
            )}

        </div>
    );
};

export default SearchBar;