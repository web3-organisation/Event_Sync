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

            {/* ── Titre + résultats ───────────── */}
            <div className={styles.top}>

        <span className={styles.label}>
          Rechercher un intervenant
        </span>

                {hasFilters && (
                    <span className={styles.resultBadge}>
            {resultCount} résultat{resultCount > 1 ? "s" : ""}
          </span>
                )}

            </div>

            {/* ── Input + Select ──────────────── */}
            <div className={styles.row}>

                {/* Input recherche */}
                <div className={styles.inputWrapper}>

                    <span className={styles.inputIcon}>🔍</span>

                    <input
                        type="text"
                        placeholder="Nom, email, entreprise, poste..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className={styles.input}
                    />

                    {search && (
                        <button
                            className={styles.clearBtn}
                            onClick={() => setSearch("")}
                            title="Effacer"
                        >
                            ✕
                        </button>
                    )}

                </div>

                {/* Select session */}
                <div className={styles.selectWrapper}>

                    <span className={styles.selectIcon}>🗓️</span>

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
                                {s.name} — {s.speakers.length} intervenant
                                {s.speakers.length > 1 ? "s" : ""}
                            </option>
                        ))}
                    </select>

                    <span className={styles.arrow}>▼</span>

                </div>

            </div>

            {/* ── Reset ───────────────────────── */}
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