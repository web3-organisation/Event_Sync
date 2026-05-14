"use client";

import { useState } from "react";
import SearchBar from "./SearchBar";
import SessionGroup from "./SessionGroup";
import styles from "./SpeakerList.module.css";

const SpeakerList = ({ sessions }) => {

    const [search, setSearch] = useState("");
    const [selectedSession, setSelectedSession] = useState("all");

    // Stats
    const totalSpeakers = sessions.reduce(
        (acc, s) => acc + s.speakers.length, 0
    );

    // Filtrage
    const query = search.toLowerCase();

    const filteredSessions = sessions
        .filter((s) =>
            selectedSession === "all" ||
            s.id === selectedSession
        )
        .map((session) => ({
            ...session,
            speakers: session.speakers.filter((sp) =>
                sp.fullName.toLowerCase().includes(query) ||
                sp.bio?.toLowerCase().includes(query)
            ),
        }))
        .filter((s) => s.speakers.length > 0);

    const resultCount = filteredSessions.reduce(
        (acc, s) => acc + s.speakers.length, 0
    );

    return (
        <div className={styles.page}>
            <div className={styles.container}>

                {/* Header */}
                <div className={styles.header}>
                    <h1 className={styles.title}>
                        🎤 Nos Intervenants
                    </h1>
                    <p className={styles.subtitle}>
                        Tous les speakers groupés par session
                    </p>
                </div>

                {/* Stats */}
                <div className={styles.stats}>
                    <div className={styles.statCard}>
                        <span className={styles.statIcon}>🗓️</span>
                        <span className={styles.statValue}>
                            {sessions.length}
                        </span>
                        <span className={styles.statLabel}>Sessions</span>
                    </div>
                    <div className={styles.statCard}>
                        <span className={styles.statIcon}>🎤</span>
                        <span className={styles.statValue}>
                            {totalSpeakers}
                        </span>
                        <span className={styles.statLabel}>Intervenants</span>
                    </div>
                </div>

                {/* Search */}
                <SearchBar
                    search={search}
                    setSearch={setSearch}
                    selectedSession={selectedSession}
                    setSelectedSession={setSelectedSession}
                    sessions={sessions}
                    resultCount={resultCount}
                />

                {/* No results */}
                {filteredSessions.length === 0 && (
                    <div className={styles.noResults}>
                        <p className={styles.noResultsIcon}>😕</p>
                        <p className={styles.noResultsText}>
                            Aucun intervenant trouvé
                        </p>
                        <button
                            className={styles.resetBtn}
                            onClick={() => {
                                setSearch("");
                                setSelectedSession("all");
                            }}
                        >
                            Réinitialiser
                        </button>
                    </div>
                )}

                {/* Sessions */}
                <div>
                    {filteredSessions.map((session) => (
                        <SessionGroup
                            key={session.id}
                            session={session}
                            searchQuery={search}
                        />
                    ))}
                </div>

            </div>
        </div>
    );
};

export default SpeakerList;